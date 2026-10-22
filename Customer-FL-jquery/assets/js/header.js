$(document).ready(function(){
    
    /*Coockie variables*/
    var ac_c_name= "ac_tkn";
    function clearCookie(){
        localStorage.removeItem(ac_c_name);
//        Cookies.remove(ac_c_name);
        window.location.assign("index.html");
    }
    
    $("#log-out").click(function(){
        clearCookie();
    })
})