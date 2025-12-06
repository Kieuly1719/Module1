class Employee{
    constructor(id, role, username, password, fullName, Email, salary){
        this.id = id;
        this.role = role;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.Email = Email;
        this.salary = salary;
    }
}

class LeaveRequest{
    constructor(employeeId, reason, startDate, endDate){
        this.id = 'REQ-' + Date.now();
        this.employeeId = employeeId;
        this.reason = reason;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = 'Pending';
    }
}
class PayrollRecord {
    constructor(employeeId, baseSalary, bonus, dateRecieve) {
        this.recordId = 'PAY-' + Date.now(); // ID duy nhất
        this.employeeId = employeeId;
        this.baseSalary = baseSalary;
        this.bonus = bonus || 0;
        this.netSalary = baseSalary + (bonus || 0);
        this.dateRecieve = dateRecieve; // Ngày nhận lương (ví dụ: '2025-11')
    }
}

const StorageManager = {
    KEYS: {
        EMPLOYEES: 'employees',
        LEAVE_REQUESTS: 'leaveRequests',
        PAYROLL_RECORDS: 'payrollRecords'
    },

    _getData(key){
        const data = localStorage.getItem(key);
        if(data){
            return JSON.parse(data);
        }
        else{
            return [];
        }
    },

    _saveData(key, data){
        localStorage.setItem(key, JSON.stringify(data));
    },

    initData() {
        if (!localStorage.getItem(this.KEYS.EMPLOYEES)) {
            // Dữ liệu nhân viên mẫu
            const initialEmployees = [
                new Employee('A001', 'admin', 'admin', 'admin123', 'Nguyễn Văn Admin', 'admin@ems.com', 50000000),
                new Employee('E101', 'employee', 'nv01', '123456', 'Trần Thị Nhân Viên A', 'a@ems.com', 15000000),
                new Employee('E102', 'employee', 'nv02', '123456', 'Lê Văn Nhân Viên B', 'b@ems.com', 18000000),
            ];
            this._saveData(this.KEYS.EMPLOYEES, initialEmployees);
        }

        if (!localStorage.getItem(this.KEYS.LEAVE_REQUESTS)) {
            // Dữ liệu đơn xin nghỉ phép mẫu
            const initialRequests = [
                new LeaveRequest('E101', 'Nghỉ ốm', '2025-12-01', '2025-12-03')
            ];
            this._saveData(this.KEYS.LEAVE_REQUESTS, initialRequests);
        }

        if (!localStorage.getItem(this.KEYS.PAYROLL_RECORDS)) {
            // Dữ liệu phiếu lương mẫu
            const initialPayroll = [
                new PayrollRecord('E101', 15000000, 1000000, 500000, '2025-10'),
                new PayrollRecord('E102', 18000000, 0, 800000, '2025-10'),
            ];
            this._saveData(this.KEYS.PAYROLL_RECORDS, initialPayroll);
        }
        console.log("Dữ liệu khởi tạo (nếu cần) đã hoàn tất.");
    },

    getEmployees() {
        return this._getData(this.KEYS.EMPLOYEES);
    },
    saveEmployees(data) {
      this._saveData(this.KEYS.EMPLOYEES, data);
    },
    getRequests(){
        return this._getData(this.KEYS.LEAVE_REQUESTS);
    },
    saveRequests(data){
        this._saveData(this.KEYS.LEAVE_REQUESTS, data);
    },
    getPayrollRecords() {
        return this._getData(this.KEYS.PAYROLL_RECORDS);
    },
    savePayrollRecords(data) {
        this._saveData(this.KEYS.PAYROLL_RECORDS, data);
    },
};
StorageManager.initData();

const AuthManager = {
    SESSION_KEY: 'current_user',

    login(username, password){
        const employees = StorageManager.getEmployees();
        const user = employees.find(
            emp => emp.username === username && emp.password === password
        );

        if(user){
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
                id: user.id,
                role: user.role,
                fullName: user.fullName
            }));
            console.log("Đăng nhập thành công");
            return true;
        }
        return false;
    },
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        // Chuyển hướng người dùng về trang đăng nhập
        window.location.href = 'login.html';
    },

    getCurrentUser(){
        const userJson = sessionStorage.getItem(this.SESSION_KEY);
        if(userJson){
            return JSON.parse(userJson);
        }
        else{
            return null;
        }
    },
    getCurrentUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    },
};

const EmployeeManager = {
    addEmployee(data){
        let employees = StorageManager.getEmployees();
        const nextId = 'E' + String(employees.length + 1).padStart(3, '0');
        const newEmployee = new Employee(
            nextId,
            data.role || 'employee',
            data.username,
            data.password,
            data.fullName,
            data.email,
            parseFloat(data.salary)
        );

        employees.push(newEmployee);
        StorageManager.saveEmployees(employees);
        return employees;
    },
    updateEmployee(id, newData){
        let employees = StorageManager.getEmployees();
        const index = employees.find(emp => emp.id === id);
        if(index !== -1){
            const emp = employees[index];
            emp.fullName = newData.fullName || emp.fullName;
            emp.Email = newData.Email || emp.Email;
            emp.role = newData.role || emp.role;

            if(newData.password){
                emp.password = newData.password;
            }
            StorageManager.saveEmployees(employees);
            return true;
        }
        return false;
    },

    deleteEmployee(id){
        let employees = StorageManager.getEmployees();
        const initialLength = employees.length;

        employees = employees.filter(emp => emp.id !== id);
        if(employees.length < initialLength){
            StorageManager.saveEmployees(employees);
            return employees;
        }
        console.error(`Không tìm thấy nhân viên có ID: ${id}`);
        return employees;
    },
    getEmployeeById(id) {
        const employees = StorageManager.getEmployees();
        return employees.find(emp => emp.id === id);
    }
};

const PayrollManager = {
    updateSalary(id, newSalary){
        if(newSalary <= 0 ||isNaN(newSalary)){
            console.error('Lỗi: Mức lương mới không hợp lệ.');
            return false;
        }
        let employees = StorageManager.getEmployees();
        const employeeIndex = employees.findIndex(emp => emp.id === id);

        if(employeeIndex !== -1){
            employees[employeeIndex].salary = parseFloat(newSalary);
            StorageManager.saveEmployees(employees);
            console.log(`Cập nhật lương cho NV ${id} thành công: ${newSalary}`);
            return true;
        }
        console.error(`Không tìm thấy nhân viên có ID: ${id}`);
        return false;
    },

    generatePayrollRecord(id, baseSalary, bonus = 0, deductions = 0) {
        const dateRecieve = new Date().toISOString().slice(0, 7); // Tháng YYYY-MM

        const newRecord = new PayrollRecord(
            id,
            parseFloat(baseSalary),
            parseFloat(bonus),
            parseFloat(deductions),
            dateRecieve
        );

        let records = StorageManager.getPayrollRecords();
        records.push(newRecord);
        StorageManager.savePayrollRecords(records);

        return newRecord;
    },
    getLatestPayroll(id) {
        const records = StorageManager.getPayrollRecords();
        const employeeRecords = records.filter(record => record.employeeId === id);

        if (employeeRecords.length === 0) {
            return null;
        }

        employeeRecords.sort((a, b) => (a.recordId > b.recordId) ? -1 : 1);

        return employeeRecords[0];
    }
};

const RequestManager = {
    submitRequest(data){
        if(!data.employeeId || !data.reason || !data.startDate || !data.endDate){
            console.error('Lỗi: Vui lòng điền đầy đủ thông tin đơn nghỉ phép.');
            return null;
        }

        const newRequest = new LeaveRequest(
            data.employeeId,
            data.reason,
            data.startDate,
            data.endDate
        );
        let requests = StorageManager.getRequests();
        requests.push(newRequest);
        StorageManager.saveRequests(requests);

        console.log(`Đã nộp đơn nghỉ phép thành công. ID: ${newRequest.id}`);
        return newRequest;
    },
    getRequestById(id) {
        const requests = StorageManager.getRequests();
        return requests.find(req => req.id === id);
    },
    approve(id) {
        let requests = StorageManager.getRequests();
        const requestIndex = requests.findIndex(req => req.id === id);

        if (requestIndex !== -1) {
            requests[requestIndex].status = 'Approved';
            StorageManager.saveRequests(requests);
            console.log(`Đơn nghỉ phép ID ${id} đã được phê duyệt.`);
            return true;
        }
        console.error(`Không tìm thấy đơn nghỉ phép có ID: ${id}`);
        return false;
    },
    reject(id) {
        let requests = StorageManager.getRequests();
        const requestIndex = requests.findIndex(req => req.id === id);

        if (requestIndex !== -1) {
            requests[requestIndex].status = 'Rejected';
            StorageManager.saveRequests(requests);
            console.log(`Đơn nghỉ phép ID ${id} đã bị từ chối.`);
            return true;
        }
        console.error(`Không tìm thấy đơn nghỉ phép có ID: ${id}`);
        return false;
    },
    getPendingRequests() {
        const requests = StorageManager.getRequests();
        return requests.filter(req => req.status === 'Pending');
    }
}

const AuthUI = {
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    errorDisplay: document.getElementById('loginError'),

    displayError (message){
        if(this.errorDisplay){
            this.errorDisplay.textContent = message;
            this.errorDisplay.style.display = 'block';
        }
    },
    clearError() {
        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        }
    },
    checkLoginState() {
        const user = AuthManager.getCurrentUser();
        if (user) {
            // Nếu đã đăng nhập, chuyển hướng đến dashboard tương ứng
            if (user.role === 'admin') {
                window.location.href = 'admin_dashboard.html';
            } else if (user.role === 'employee') {
                window.location.href = 'employee_dashboard.html';
            }
        }
    },
    bindLoginEvent(){
        if(this.loginForm){
            this.loginForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const username = this.usernameInput.value.trim();
                const password = this.passwordInput.value;

                this.clearError();
                if(AuthManager.login(username, password)){
                    const role = AuthManager.getCurrentUserRole();
                    if(role === 'admin'){
                        window.location.href = 'admin_dashboard.html';
                    }
                    else if(role === 'employee'){
                        window.location.href = 'employee_dashboard.html';
                    }
                }else{
                    this.displayError('Tên đăng nhập hoặc mật khẩu không đúng.');
                }
            });
        }
    }
};
if (window.location.pathname.includes('login.html')) { // Kiểm tra xem có đang ở trang đăng nhập không
    document.addEventListener('DOMContentLoaded', () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa, nếu rồi thì chuyển hướng
        AuthUI.checkLoginState(); // [cite: 28]

        // Gắn sự kiện submit cho form đăng nhập
        AuthUI.bindLoginEvent(); // [cite: 25, 26]
    });
}

const AdminUI = {
    employeeListBody: document.getElementById('employeeList'),
    leaveRequestListBody: document.getElementById('leaveRequestList'),
    logoutButton: document.getElementById('logoutButton'),

    addEmployeeBtn: document.getElementById('addEmployeeBtn'),
    employeeModal: document.getElementById('employeeModal'),
    employeeForm: document.getElementById('employeeForm'),
    salaryUpdateForm: document.getElementById('salaryUpdateForm'),

    currentEditingEmployeeId: null,

    renderEmployeeTable(employees) {
        if (!this.employeeListBody) return;
        this.employeeListBody.innerHTML = '';

        employees.forEach(emp => {
            if (emp.role === 'admin') return;
            const row = document.createElement('tr');
            const safeSalary = emp.salary ?? 0;
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.fullName}</td>
                <td>${emp.role}</td>
                <td>${safeSalary.toLocaleString('vi-VN')} VNĐ</td> 
                <td>
                    <button class="edit-btn" data-id="${emp.id}">Sửa</button>
                    <button class="delete-btn" data-id="${emp.id}">Xóa</button>
                    <button class="update-salary-btn" data-id="${emp.id}">Cập nhật Lương</button>
                </td>
            `;
            this.employeeListBody.appendChild(row);
        });

        this._bindEmployeeActionEvents();
    },

    renderLeaveRequests(requests) { // [cite: 33, 34]
        if (!this.leaveRequestListBody) return;
        this.leaveRequestListBody.innerHTML = ''; // Xóa nội dung cũ

        requests.forEach(req => {
            const employee = EmployeeManager.getEmployeeById(req.employeeId);
            const fullName = employee ? employee.fullName : 'Không tìm thấy NV';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${req.employeeId} (${fullName})</td>
                <td>${req.reason}</td>
                <td>${req.startDate} đến ${req.endDate}</td>
                <td><span class="status ${req.status.toLowerCase()}">${req.status}</span></td>
                <td>
                    <button class="approve-btn" data-id="${req.id}">Duyệt</button>
                    <button class="reject-btn" data-id="${req.id}">Từ chối</button>
                </td>
            `;
            this.leaveRequestListBody.appendChild(row); // Hiển thị đơn nghỉ dưới dạng bảng. [cite: 34]
        });

        // Sau khi render xong, gắn sự kiện cho các nút Duyệt/Từ chối
        this._bindRequestActionEvents();
    },

    // Trong const AdminUI = { ... }
    getEmployeeFormData() {
        const data = {
            id: document.getElementById('emp_id_edit').value,
            fullName: document.getElementById('emp_fullName').value,
            username: document.getElementById('emp_username').value,
            password: document.getElementById('emp_password').value,
            Email: document.getElementById('emp_email').value,
            role: document.getElementById('emp_role').value,
            salary: document.getElementById('emp_salary').value
        };
        return data;
    },
    getSalaryUpdateData() {
        return {
            employeeId: document.getElementById('salary_employeeId').value, // Thu thập id [cite: 37]
            newSalary: document.getElementById('newSalary').value // Thu thập newSalary [cite: 38]
        };
    },
    clearForm(formId) { // [cite: 38]
        const form = document.getElementById(formId);
        if (form) {
            form.reset(); // Hàm reset() của HTML Form element
            this.currentEditingEmployeeId = null;
        }
    },
    _bindEmployeeActionEvents() {
        // Gắn sự kiện Xóa
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ID ${id} không?`)) {
                    const updatedEmployees = EmployeeManager.deleteEmployee(id);
                    this.renderEmployeeTable(updatedEmployees);
                }
            });
        });

        // Gắn sự kiện Sửa (Mở modal)
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const emp = EmployeeManager.getEmployeeById(id);
                if (emp) {
                    this.currentEditingEmployeeId = id;
                    // TODO: Điền dữ liệu NV vào form #employeeForm
                    // Mở Modal (Giả lập)
                    this.employeeModal.style.display = 'block';
                }
            });
        });

        // Gắn sự kiện Cập nhật Lương (Mở modal)
        document.querySelectorAll('.update-salary-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                // TODO: Điền ID NV vào input ẩn trong form #salaryUpdateForm
                document.getElementById('salary_employeeId').value = id;
                // Mở Modal (Giả lập)
                document.getElementById('salaryModal').style.display = 'block';
            });
        });
    },
    _bindRequestActionEvents() {
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (RequestManager.approve(id)) {
                    // Cập nhật lại danh sách đơn nghỉ phép đang chờ duyệt
                    this.renderLeaveRequests(RequestManager.getPendingRequests());
                }
            });
        });

        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (RequestManager.reject(id)) {
                    this.renderLeaveRequests(RequestManager.getPendingRequests());
                }
            });
        });
    },

    bindAdminEvents() { // [cite: 35]
        // 1. Gắn sự kiện Log out
        this.logoutButton?.addEventListener('click', () => AuthManager.logout());

        // 2. Gắn sự kiện nút Thêm NV (Mở modal)
        this.addEmployeeBtn?.addEventListener('click', () => {
            this.clearForm('employeeForm');
            this.employeeModal.style.display = 'block';
        });

        this.employeeForm?.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = this.getEmployeeFormData();
            if (data.id) {
                EmployeeManager.updateEmployee(data.id, data);
                console.log(`Đã sửa NV ID: ${data.id}`);
            } else {
                // Xử lý Thêm NV
                EmployeeManager.addEmployee(data);
                console.log('Đã thêm NV mới');
            }

            this.employeeModal.style.display = 'none';
            this.clearForm('employeeForm');
            const latestList = StorageManager.getEmployees();
            this.renderEmployeeTable(latestList.filter(e => e.role !== 'admin'));
        });

        this.salaryUpdateForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = this.getSalaryUpdateData();

            PayrollManager.updateSalary(data.employeeId, data.newSalary);

            document.getElementById('salaryModal').style.display = 'none'; // Đóng modal
            this.clearForm('salaryUpdateForm');
            this.renderEmployeeTable(StorageManager.getEmployees().filter(e => e.role !== 'admin')); // Render lại bảng
        });
    },
};
if (window.location.pathname.includes('admin_dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Kiểm tra quyền Admin
        if (AuthManager.getCurrentUserRole() !== 'admin') {
            AuthManager.logout(); // Nếu không phải admin thì log out
            return;
        }

        // Gắn tất cả sự kiện chính
        AdminUI.bindAdminEvents();

        // Hiển thị dữ liệu ban đầu
        AdminUI.renderEmployeeTable(StorageManager.getEmployees().filter(e => e.role !== 'admin'));
        AdminUI.renderLeaveRequests(RequestManager.getPendingRequests());
    });
}
const EmployeeUI = {
    // Khu vực hiển thị/form
    personalInfoForm: document.getElementById('personalInfoForm'),
    infoDisplay: document.getElementById('infoDisplay'),
    leaveRequestForm: document.getElementById('leaveRequestForm'),
    payrollDisplay: document.getElementById('payrollDisplay'),

    // Các nút
    logoutButton: document.getElementById('logoutButton'),
    saveInfoBtn: document.getElementById('saveInfoBtn'),
    changePassBtn: document.getElementById('changePassBtn'),
    viewAllSlipsBtn: document.getElementById('viewAllSlips'), // Xem lịch sử phiếu lương (Chức năng mở rộng)
    /**
     * displayPersonalInfo(employee): Hiển thị thông tin cá nhân hiện tại của NV đang đăng nhập và cho phép chỉnh sửa.
     * @param {Employee} employee - Đối tượng nhân viên đang đăng nhập.
     */
    displayPersonalInfo(employee) { //
        if (!this.infoDisplay || !employee) return;

        // Hiển thị thông tin dưới dạng form/input để nhân viên có thể chỉnh sửa Email và Tên
        this.infoDisplay.innerHTML = `
            <div class="form-group">
                <label>ID:</label>
                <input type="text" id="emp_id_display" value="${employee.id}" disabled>
            </div>
            <div class="form-group">
                <label for="emp_fullName_edit">Họ và Tên:</label>
                <input type="text" id="emp_fullName_edit" value="${employee.fullName}">
            </div>
            <div class="form-group">
                <label for="emp_email_edit">Email:</label>
                <input type="email" id="emp_email_edit" value="${employee.Email}">
            </div>
            <div class="form-group">
                <label>Ngày vào làm:</label>
                <input type="text" value="${employee.joinDate}" disabled>
            </div>
        `;
        // Mật khẩu sẽ được xử lý riêng qua nút "Thay đổi Mật khẩu"
    },

    /**
     * renderPayrollSlip(record): Lấy dữ liệu phiếu lương và hiển thị chi tiết.
     * @param {PayrollRecord|null} record - Bản ghi lương gần nhất.
     */
    renderPayrollSlip(record) { //
        if (!this.payrollDisplay) return;

        if (!record) {
            this.payrollDisplay.innerHTML = '<p>Chưa có phiếu lương nào được ghi nhận.</p>';
            return;
        }

        this.payrollDisplay.innerHTML = `
            <h3>Phiếu Lương Tháng ${record.dateRecieve}</h3>
            <p><strong>Lương Cơ bản:</strong> ${record.baseSalary.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Thưởng:</strong> ${record.bonus.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Khấu trừ:</strong> ${record.deductions.toLocaleString('vi-VN')} VNĐ</p>
            <hr>
            <h4>Lương Thực nhận: ${record.netSalary.toLocaleString('vi-VN')} VNĐ</h4>
        `;
    },

    // ----------------------------------------------------------------
    // CHỨC NĂNG LẤY DỮ LIỆU FORM
    // ----------------------------------------------------------------

    /**
     * getLeaveRequestData(): Thu thập thông tin từ form nộp đơn nghỉ phép.
     * @returns {object|null} Dữ liệu đơn nghỉ phép
     */
    getLeaveRequestData() { //
        const startDate = document.getElementById('leave_startDate')?.value;
        const endDate = document.getElementById('leave_endDate')?.value;
        const reason = document.getElementById('leave_reason')?.value;

        if (!startDate || !endDate || !reason) {
            alert("Vui lòng điền đầy đủ thông tin đơn nghỉ phép.");
            return null;
        }

        const currentUser = AuthManager.getCurrentUser();
        return {
            employeeId: currentUser.id,
            reason: reason,
            startDate: startDate,
            endDate: endDate
        };
    },

    /**
     * getPersonalInfoData(): Thu thập thông tin cá nhân từ form chỉnh sửa.
     * @returns {object} Dữ liệu cập nhật
     */
    getPersonalInfoData() {
        return {
            fullName: document.getElementById('emp_fullName_edit')?.value,
            Email: document.getElementById('emp_email_edit')?.value
        };
    },

    // ----------------------------------------------------------------
    // CHỨC NĂNG GẮN SỰ KIỆN VÀ XỬ LÝ
    // ----------------------------------------------------------------

    /**
     * bindEmployeeEvents(): Gắn sự kiện cho các nút hành động của Nhân viên.
     */
    bindEmployeeEvents() { //
        // 1. Gắn sự kiện Log out
        this.logoutButton?.addEventListener('click', () => AuthManager.logout());

        // 2. Gắn sự kiện cho Form Chỉnh sửa Thông tin Cá nhân
        this.personalInfoForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentUser = AuthManager.getCurrentUser();
            const data = this.getPersonalInfoData();

            // Cập nhật thông tin NV
            if (EmployeeManager.updateEmployee(currentUser.id, data)) {
                alert('Cập nhật thông tin cá nhân thành công!');
                // Cần load lại thông tin người dùng hiện tại từ Local Storage sau khi cập nhật
                const updatedEmployee = EmployeeManager.getEmployeeById(currentUser.id);
                this.displayPersonalInfo(updatedEmployee);
            }
        });

        // 3. Gắn sự kiện cho nút Thay đổi Mật khẩu
        this.changePassBtn?.addEventListener('click', () => {
            const newPass = prompt("Nhập mật khẩu mới:");
            if (newPass && newPass.length >= 6) {
                const currentUser = AuthManager.getCurrentUser();
                // Cập nhật mật khẩu (sử dụng hàm updateEmployee)
                if (EmployeeManager.updateEmployee(currentUser.id, { password: newPass })) {
                    alert('Thay đổi mật khẩu thành công!');
                }
            } else if (newPass) {
                alert('Mật khẩu phải có ít nhất 6 ký tự.');
            }
        });

        // 4. Gắn sự kiện cho Form Nộp Đơn Xin nghỉ phép
        this.leaveRequestForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = this.getLeaveRequestData();

            if (data) {
                RequestManager.submitRequest(data);
                alert('Đơn xin nghỉ phép đã được gửi đi và đang chờ Admin phê duyệt.');
                this.leaveRequestForm.reset();
            }
        });
    }
};

// =================================================================
// ĐẢM BẢO KHỞI TẠO VÀ GẮN SỰ KIỆN TẠI TRANG EMPLOYEE
// =================================================================

// Đoạn mã này phải được đặt sau cùng trong tệp app.js, hoặc trong thẻ <script> của employee_dashboard.html
if (window.location.pathname.includes('employee_dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const currentUser = AuthManager.getCurrentUser();

        // Kiểm tra quyền Employee
        if (currentUser?.role !== 'employee') {
            AuthManager.logout(); // Nếu không phải employee thì log out
            return;
        }

        // Gắn tất cả sự kiện chính
        EmployeeUI.bindEmployeeEvents();

        // Hiển thị dữ liệu ban đầu
        const currentEmployeeDetails = EmployeeManager.getEmployeeById(currentUser.id);
        EmployeeUI.displayPersonalInfo(currentEmployeeDetails);

        const latestPayroll = PayrollManager.getLatestPayroll(currentUser.id);
        EmployeeUI.renderPayrollSlip(latestPayroll);
    });
}
