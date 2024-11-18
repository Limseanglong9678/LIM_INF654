document.addEventListener("DOMContentLoaded",function(){
    const menus = document.querySelector(".sidenav");
    M.Sidenav.init(menus,{edge: "right"})

    const forms = document.querySelector(".side-forms");
    M.Sidenav.init(menus,{edge: "left"})
});