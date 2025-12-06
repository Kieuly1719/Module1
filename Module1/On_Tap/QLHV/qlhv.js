class hoc_vien{
    constructor(id, name, Class, Email, birth, module) {
        this.id = id;
        this.name = name;
        this.Class = Class;
        this.Email = Email;
        this.birth = birth;
        this.module = module;
    }
}

function tai_danh_sach(){
    const jsonString = localStorage.getItem('danhSachHV');
    if(jsonString){
        return JSON.parse(jsonString);
    }
    return [
        {id: 1, name: "Trần Thị Kiều Ly", Class: "C0925L1 JV105", Email: "kieuly017@gmail.com", Module: 1},
        {id: 2, name: "Huỳnh Văn Quyền", Class: "C0925L1 JV105", Email: "vanquyen@gmail.com", Module: 1},
        {id: 3, name: "Đoàn Anh Kiệt", Class: "C0725L1 JV104", Email: "anhkiet@gmail.com", Module: 2},
    ];
}

function luuDanhSach(list){
    localStorage.setItem('danhSachHV', JSON.stringify(list))
}
