class Employee {
    constructor(id, name, phone, address, email, position, baseSalary){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.email = email;
        this.position = position || 'Staff';
        this.baseSalary = baseSalary || 0;
    }
}

function taiDanhSachNV(){
    const jsonString = localStorage.getItem('danhSachNV');
    if(jsonString){
        return JSON.parse(jsonString);
    }

    return[
        {id: 101, name: "Trần Thị Kiều Ly", phone: "0329773944", address: "Quảng Nam",email: "kieuly@example.com", position: "Marketing Manager", baseSalary: 18000000 },
        { id: 102, name: "Huỳnh Văn Quyền", phone: "0905821752", address: "Đà Nẵng", email: "quyen@example.com", position: "Software Developer", baseSalary: 25000000 }
    ];
}

function luuDanhSachNV(list){
    localStorage.setItem('danhSachNV', JSON.stringify(list));
}
var danh_sach_nhan_vien = taiDanhSachNV();

function themNhanVien(id, name, phone, address, email, position, baseSalary){
    var emp = new Employee(id, name, phone, address, email, position, baseSalary);
    danh_sach_nhan_vien.push(emp);
    luuDanhSachNV(danh_sach_nhan_vien);
    console.log("Thêm nhân viên " + emp.name + " thành công!");
    Hien_thi_danh_sach_nhan_vien();
}

function xoaNhanVien(id){
    let danhSach = taiDanhSachNV();
    const danhSachMoi = danhSach.filter(nv => nv.id !== id);
    luuDanhSachNV(danhSachMoi);
    Hien_thi_danh_sach_nhan_vien();
}

function capNhatNhanVien(updatedEmployee) {
    let danhSach = taiDanhSachNV();

    const index = danhSach.findIndex(nv => nv.id === updatedEmployee.id);

    if (index !== -1) {
        danhSach[index] = updatedEmployee;

        // 3. Lưu lại vào LocalStorage
        luuDanhSachNV(danhSach);

        console.log(`Cập nhật nhân viên ID ${updatedEmployee.id} thành công.`);
    } else {
        alert("Không tìm thấy nhân viên để cập nhật.");
    }
}

function suaNhanVien(id){
    window.location.href = `edit_employee.html?id=${id}`;
}

function Hien_thi_danh_sach_nhan_vien(){
    var tableBody = document.getElementById("employee_list_body");

    if(!tableBody){
        console.warn("Không tìm thấy ID 'employee_list_body'.");
        return;
    }
    tableBody.innerHTML = '';

    const danh_sach_moi = danh_sach_nhan_vien.slice().sort((a,b) => a.id - b.id);
    for(let emp of danh_sach_moi){
        const row = tableBody.insertRow();

        row.insertCell().textContent = emp.id;
        row.insertCell().textContent = emp.name;
        row.insertCell().textContent = emp.position;
        row.insertCell().textContent = emp.baseSalary.toLocaleString('vi-VN') + ' VNĐ';
        row.insertCell().textContent = emp.phone;
        row.insertCell().textContent = emp.email;
        row.insertCell().textContent = emp.address;

        const actionCell = row.insertCell();

        const editButton = document.createElement("button");
        editButton.textContent = "Sửa và lưu";
        editButton.classList.add("action-btn", 'edit-btn');
        editButton.onclick = function () {
            suaNhanVien(emp.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = function () {
            if(confirm(`Bạn có chắc muốn xóa nhân viên ${emp.name}?`)){
                xoaNhanVien(emp.id); // Đã đổi tên hàm ở đây
            }
        };
        actionCell.append(editButton);
        actionCell.append(deleteButton); // Sửa lỗi: Thêm nút xóa, không phải nút sửa
    }
}
document.addEventListener("DOMContentLoaded", Hien_thi_danh_sach_nhan_vien);

// --- QUẢN LÝ ĐƠN NGHỈ PHÉP ---
let leaveRequests = [];
function taiDanhSachNghiPhep(){
    const jsonString = localStorage.getItem('danhSachNghiPhep');
    return jsonString ? JSON.parse(jsonString) : [
        { requestId: 1, empId: 102, name: "Huỳnh Văn Quyền", from: "2025-01-05", to: "2025-01-07", reason: "Khám bệnh", status: "Pending" },
        { requestId: 2, empId: 101, name: "Trần Thị Kiều Ly", from: "2025-01-10", to: "2025-01-11", reason: "Việc cá nhân", status: "Pending" }
    ];
}
function luuDanhSachNghiPhep(list){
    localStorage.setItem('danhSachNghiPhep', JSON.stringify(list));
}
let danh_sach_nghi_phep = taiDanhSachNghiPhep();

// Hàm chung để cập nhật trạng thái đơn nghỉ phép
function capNhatTrangThaiNghiPhep(requestID, status){
    const index = danh_sach_nghi_phep.findIndex(req => req.requestId === requestID);
    if(index !== -1){
        danh_sach_nghi_phep[index].status = status;
        luuDanhSachNghiPhep(danh_sach_nghi_phep);
        Hien_thi_don_xin_phep();
        alert(`Đã cập nhật đơn nghỉ phép #${requestID} thành: ${status}`);
    }
}

// Thay thế hàm pheDuyetNghiPhep cũ bằng hàm chung để linh hoạt hơn
function pheDuyetNghiPhep(requestID){
    capNhatTrangThaiNghiPhep(requestID, "Approved");
}

function tuChoiNghiPhep(requestID){
    capNhatTrangThaiNghiPhep(requestID, "Rejected");
}


/** HÀM HIỂN THỊ ĐƠN XIN NGHỈ PHÉP **/
function Hien_thi_don_xin_phep() {
    var tableBody = document.getElementById("leave_requests_body"); // ID của tbody cho đơn nghỉ phép

    if (!tableBody) {
        console.warn("Không tìm thấy ID 'leave_requests_body'.");
        return;
    }

    tableBody.innerHTML = "";

    // Sắp xếp: Ưu tiên đơn đang chờ duyệt lên đầu
    const danh_sach_moi = danh_sach_nghi_phep.slice().sort((a, b) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return a.requestId - b.requestId;
    });

    for (let req of danh_sach_moi) {
        const row = tableBody.insertRow();

        // 1. Hiển thị thông tin
        row.insertCell().textContent = req.requestId;
        row.insertCell().textContent = req.empId;
        row.insertCell().textContent = req.name;
        row.insertCell().textContent = `${req.from} đến ${req.to}`;
        row.insertCell().textContent = req.reason;

        // 2. Hiển thị Trạng thái (Tô màu trạng thái)
        const statusCell = row.insertCell();
        statusCell.textContent = req.status;
        if (req.status === 'Pending') {
            statusCell.style.color = 'orange';
        } else if (req.status === 'Approved') {
            statusCell.style.color = 'green';
        } else {
            statusCell.style.color = 'red';
        }

        // 3. Hiển thị Thao tác
        const actionCell = row.insertCell();

        if (req.status === 'Pending') {
            // Nút Phê duyệt
            const approveButton = document.createElement("button");
            approveButton.textContent = "✅ Phê duyệt";
            approveButton.classList.add("action-btn", 'approve-btn');
            approveButton.onclick = () => {
                pheDuyetNghiPhep(req.requestId);
            };

            // Nút Từ chối
            const rejectButton = document.createElement("button");
            rejectButton.textContent = "❌ Từ chối";
            rejectButton.classList.add("action-btn", 'reject-btn');
            rejectButton.onclick = () => {
                tuChoiNghiPhep(req.requestId);
            };

            actionCell.append(approveButton);
            actionCell.append(rejectButton);
        } else {
            actionCell.textContent = 'Đã hoàn tất';
        }
    }
}

// Thêm lệnh gọi hàm hiển thị đơn nghỉ phép khi tải trang
document.addEventListener("DOMContentLoaded", Hien_thi_don_xin_phep);