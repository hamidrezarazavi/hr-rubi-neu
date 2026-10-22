$(document).ready(function(){
    
    /*page attribute variables*/
    var pageURL = $(location).attr("href");
    var filename = pageURL.substring(pageURL.lastIndexOf('/')+1);
    
    var site_name = "روبی آپ پشتیبانی"
    var page_names = {login:"BOlogin.html",orders:"BOorders.html",agents:"BOAgents.html"};
    var page_titles = {login:"ورود",orders:"سفارشات",agents:"سرویس یاران"};
     
    document.title = site_name+" | "+page_titles.login;
    
    
    /*request variables - methods*/
    var ac_token;
    var url_domain = "http://116.203.42.11";
    var url_port ;
    var url_path ;
    var url;
    function setUrl(){
        url=url_domain+":"+url_port+"/"+url_path;
    }
    
    /*Coockie variables*/
    var ac_c_name= "ac_tkn";
    function clearCookie(){
        localStorage.removeItem(ac_c_name);
//        Cookies.remove(ac_c_name);
        window.location.assign("BOlogin.html");
    }
    
    /*login-details variables*/
    var username="admin";
    var pass="1234";

    
    /*function user pass check*/
    $("#ad-login").click(function(){
       checkUserPass($("#bo-username").val(),$("#bo-password").val())
    });
    function checkUserPass(entry_username,entry_password){
        if(entry_username==username&&entry_password==pass){
            $("#bo-wrong-msg").addClass("transparent");
            url_path = "roubi-guard/form/login"
            url_port = "9999";
            var auth="rO0ABXNyAB1jb20ucm91YmkuZ3VhcmQuZHRvLkxvZ2luRm9ybaDwpDh8axZiAgACTAAIcGFzc3dvcmR0ABJMamF2YS9sYW5nL1N0cmluZztMAAh1c2VybmFtZXEAfgABeHB0AAUxMjM0NXQABm1leXNhbQ==";
            setUrl();
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": url,
              "method": "GET",
              "headers": {
                "apikey": "Yn2kjibddFAWtnPJ2AFlL8WXmohJMCvigQggaEypa5E",
                "issuer": "SUPPORT_NODE",
                "authorization": auth,
                "subissuer": "WEB"
              },
              error:function(jqXHR, status, err){
                  console.log(jqXHR);
                  console.log(status);
                  console.log(err);
                if(jqXHR.status==406){
                    alert(jqXHR.responseJSON.response);
                }
                else{
                  alert("اشکال در سرور ها وجود دارد لطفا با فنی تماس بگیرید");
                }
              },
              success:function(response, status, xhr){
                  ac_token=xhr.getResponseHeader("Access-token");
                  //Cookies.set(ac_c_name, ac_token, { domain: 'your domain',expires: 7 }); //// If you Want the cookies be  secure use this line with your domain address
//                  Cookies.set(ac_c_name, ac_token, { expires: 1 });
                  localStorage.setItem(ac_c_name, ac_token);
                  location.assign("BOorders.html");
              }
            }

            $.ajax(settings).done();
        }
        else{
            $("#bo-wrong-msg").removeClass("transparent");
        }
    }
    
});