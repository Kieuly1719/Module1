class book{
    constructor(id, name, year, count, status) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.count = count;
        this.status = status;
    }
}

function TaiDanhSach(){
    const jsonString = localStorage.getItem('danhSachBook');
    if(jsonString){
        return JSON.parse(jsonString);
    }
    return [
        {id: 12345, name: "Toán", year: 2000, count: 3, status: "True"},
        {id: 23456, name: "Văn", year: 1998, count: 4, status: "True"},
        {id: 37456, name: "Tiếng Anh", year: 1999, count: 5, status: "False"},
    ];
}
function luu_danhSach_book(list){
    localStorage.setItem('danhSachBook', JSON.stringify(list))
}
var danh_sach_book = TaiDanhSach();
function Hien_thi_danh_sach_book(){
    var tableBody = document.getElementById("book_list_body");

    if(!tableBody){
        return;
    }
    tableBody.innerHTML = "";
    for(let book of danh_sach_book){
        const row = tableBody.insertRow(); //Tạo thẻ <tr> mới
        //Tạo thẻ <td>
        row.insertCell().textContent = book.id;
        row.insertCell().textContent = book.name;
        row.insertCell().textContent = book.year;
        row.insertCell().textContent = book.count;
        row.insertCell().textContent = book.status;
    }
}
document.addEventListener("DOMContentLoaded", Hien_thi_danh_sach_book)
function them_sach_moi(id, name, year, count, status) {
    const new_book = new book(id, name, year, count, status);
    danh_sach_book.push(new_book);
    luu_danhSach_book(danh_sach_book);

    window.location.href = "index.html";
}