class customer{
    constructor(id, name, sdt, address, email) {
        this.id = id;
        this.name = name;
        this.sdt = sdt;
        this.address = address;
        this.email = email;
    }
}

function taiDanhSach(){
    const jsonString = localStorage.getItem('danhSachKH');
    if(jsonString){
        return JSON.parse(jsonString);
    }
    return [
        { id: 1, name: "Trần Thị Kiều Ly", sdt: "0329773944", address: "Quảng Nam", email: "Kieuly017@gmail.com" },
        { id: 2, name: "Huynh Văn Quyền", sdt: "0905821752", address: "Quảng Nam", email: "hvq@gmail.com" }
    ];
}
function luu_danhSach(list){
    localStorage.setItem('danhSachKH', JSON.stringify(list))
}
var danh_sach_khach_hang = taiDanhSach();
function Hien_thi_danh_sach(){
    var tableBody = document.getElementById("customer_list_body");

    if(!tableBody){
        return;
    }
    tableBody.innerHTML = "";
    danh_sach_moi = danh_sach_khach_hang.slice().sort(function (a, b) {
        return a.id - b.id;
    });
    for(let cus of danh_sach_moi){
        const row = tableBody.insertRow(); //Tạo thẻ <tr> mới
        //Tạo thẻ <td>
        row.insertCell().textContent = cus.id;
        row.insertCell().textContent = cus.name;
        row.insertCell().textContent = cus.sdt;
        row.insertCell().textContent = cus.address;
        row.insertCell().textContent = cus.email;

        const actionCell = row.insertCell();
        const editButton = document.createElement("button");
        editButton.textContent = "Chỉnh sửa";
        editButton.classList.add("action-btn", 'edit-btn');
        editButton.onclick = function (){
            suaKhachHang(cus.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "xóa";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = ()=>{
            xoaKhachHang(cus.id);
        }
        actionCell.append(editButton);
        actionCell.append(deleteButton);
    }
}
function suaKhachHang(id){
    window.location.href = `edit_cus.html?id=${id}`;
}
function xoaKhachHang(id){
    let danhSach = taiDanhSach();
    const danhSachMoi = danhSach.filter(kh => kh.id != id);
    luu_danhSach(danhSachMoi);
    Hien_thi_danh_sach();
}
document.addEventListener("DOMContentLoaded", Hien_thi_danh_sach)
function them_khach_hang(id, name, sdt, address, email) {
    var cus = new customer(id, name, sdt, address, email);
    danh_sach_khach_hang.push(cus);
    luu_danhSach(danh_sach_khach_hang);
    console.log("Thêm khách hàng" + cus.name + " thành công");
    window.location.href = "xem_danh_sach.html";
}