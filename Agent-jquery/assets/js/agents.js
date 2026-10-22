$(document).ready(function(){
    
    /*page attribute variables*/
    var pageURL = $(location).attr("href");
    var filename = pageURL.substring(pageURL.lastIndexOf('/')+1);
    
    var site_name = "روبی آپ پشتیبانی"
    var page_names = {login:"BOlogin.html",orders:"BOorders.html",agents:"BOAgents.html"};
    var page_titles = {login:"ورود",orders:"سفارشات",agents:"سرویس یاران"};
     
    document.title = site_name+" | "+page_titles.agents;
    
    
    /*paging variables*/
    var currentPage=1;
    var pageSize=20;
    
    
    
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
        window.location.assign(page_names.login);
    }
    
    /* Token Check and Token Get*/
    function tokenCheck(cookiename){
        var token= localStorage.getItem(cookiename);
//        var token= Cookies.get(cookiename)
        if (token==null){
                window.location.assign(page_names.login);
        }
        else{
                return token;
        }
    }
    
    ac_token = tokenCheck(ac_c_name);
    
    /* Load Agentes List*/
    
    var $agent_item = $("#agent-details-item").clone();
    $("#agent-details-item").remove();
    
    loadAgentsListRequest(currentPage-1);
    function loadAgentsListRequest(pageNo){
        url_path = "roubi-manager/operators/registered?pageNo="+pageNo+"&pageSize="+pageSize;
        url_port = "9999";
        setUrl();
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "GET",
          "headers": {
            "access-token": ac_token,
            "subissuer": "WEB",
            "issuer": "MANAGEMENT_NODE",
            "apikey": "8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL"
          },
          error:function(jqXHR, status, err){
              console.log(jqXHR);
              console.log(status);
              console.log(err);
            if(jqXHR.status==403){
                alert("شما از سیستم خارج شده اید لطفا دوباره وارد شوید...");
                location.assign(page_names.login);
            }
            else if(jqXHR.status==406){
                alert(jqXHR.responseJSON.response);
            }
            else{
              alert("اشکال در سرور ها وجود دارد لطفا با فنی تماس بگیرید");
            }
          },
          success:function(response, status, xhr){
              loadAgentsList(response.response.data);
              pagesNavLoad(currentPage,response.response.data.total,1,(response.response.data.list).length);
          }
        }

        $.ajax(settings).done();
    }
    
    function loadAgentsList(response){
        $("#agent-details-area").empty();
        $.each(response.list,function(i,key){
            $agent_item.removeClass("none");
            var new_agent_item = $agent_item.clone();
            new_agent_item.find("#agent-details-name").text(key.firstName +" " + key.lastName);
            new_agent_item.find("#agent-details-phonenumber").text(key.mobileNumber);
            $("#agent-details-area").append(new_agent_item);
        });
    }
    
    
    
    /*Paging*/
    
    function pagesNavLoad(currentPage,lastPage,firstPage,itemcount){
        var first_item_num=(currentPage-1)*pageSize;
        var last_item_num= first_item_num+itemcount;
        $("#first-item-num").text(first_item_num+1);
        $("#last-item-num").text(last_item_num);
        
        
        $("#first-page-btn").addClass("none");
        $("#current-page-btn").addClass("none");
        $("#next-page-btn").addClass("none");
        $("#prev-page-btn").addClass("none");
        $("#last-page-btn").addClass("none");
        $("#first-page-btn").addClass("none");
        $("#first-page-btn").find("a").removeClass("active");
        $("#current-page-btn").find("a").removeClass("active");
        $("#next-page-btn").find("a").removeClass("active");
        $("#prev-page-btn").find("a").removeClass("active");
        $("#last-page-btn").find("a").removeClass("active");
        $("#etc-page-btn1").addClass("none");
        $("#etc-page-btn2").addClass("none");
        
        
        $("#last-page-btn").find("a").text(lastPage);
        $("#first-page-btn").find("a").text("1");
        $("#current-page-btn").find("a").text(currentPage);
        $("#prev-page-btn").find("a").text(currentPage-1);
        $("#next-page-btn").find("a").text(currentPage+1);
        if(lastPage==firstPage){
            $("#first-page-btn").removeClass("none");
            $("#first-page-btn").find("a").addClass("active");
        }
        else if(lastPage==2){
            $("#first-page-btn").removeClass("none");
            $("#last-page-btn").removeClass("none");
            if(currentPage==firstPage){
                $("#first-page-btn").find("a").addClass("active");
            }
            else if(currentPage==lastPage){
                $("#last-page-btn").find("a").addClass("active")
            }
        }
        else if(lastPage==3){
            $("#next-page-btn").find("a").text(lastPage-1);
            $("#first-page-btn").removeClass("none");
            $("#last-page-btn").removeClass("none");
            $("#next-page-btn").removeClass("none");
            if(currentPage==firstPage){
                $("#first-page-btn").find("a").addClass("active");
            }
            else if(currentPage==2){
                $("#next-page-btn").find("a").addClass("active");
            }
            else if(currentPage==lastPage){

                $("#last-page-btn").find("a").addClass("active");
            }
        }
        else if(lastPage==4){
            $("#first-page-btn").removeClass("none");
            $("#last-page-btn").removeClass("none");
            if(currentPage==firstPage){
                $("#first-page-btn").find("a").addClass("active");
                $("#next-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
            }
            else if(currentPage==lastPage){
                $("#last-page-btn").find("a").addClass("active");
                $("#prev-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
            }
            else if(currentPage==2){
                $("#prev-page-btn").find("a").text(currentPage);
                $("#prev-page-btn").find("a").addClass("active");
                $("#next-page-btn").find("a").text(currentPage+1);
                $("#prev-page-btn").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
            else if(currentPage==3){
                $("#prev-page-btn").find("a").text(currentPage-1);
                $("#next-page-btn").find("a").addClass("active");
                $("#next-page-btn").find("a").text(currentPage);
                $("#prev-page-btn").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
        }
        else if(lastPage==5){
            $("#first-page-btn").removeClass("none");
            $("#last-page-btn").removeClass("none");
            if(currentPage==firstPage){
                $("#first-page-btn").find("a").addClass("active");
                $("#next-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
            }
            else if(currentPage==lastPage){
                $("#last-page-btn").find("a").addClass("active");
                $("#prev-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
            }
            else if(currentPage==firstPage+1){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
            else if(currentPage==lastPage-1){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
            else if(currentPage==3){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#next-page-btn").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
        }
        else if(lastPage==6){
            $("#first-page-btn").removeClass("none");
            $("#last-page-btn").removeClass("none");
            if(currentPage==firstPage){
                $("#first-page-btn").find("a").addClass("active");
                $("#next-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
            }
            else if(currentPage==lastPage){
                $("#last-page-btn").find("a").addClass("active");
                $("#prev-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
            }
            else if(currentPage==firstPage+1){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
            else if(currentPage==lastPage-1){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
            else if(currentPage==firstPage+2){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
                $("#prev-page-btn").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
            else if(currentPage==lastPage-2){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
                $("#next-page-btn").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
        }
        else if(lastPage>6){
            $("#first-page-btn").removeClass("none");
            $("#last-page-btn").removeClass("none");
            if(currentPage==firstPage){
                $("#first-page-btn").find("a").addClass("active");
                $("#next-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
            }
            else if(currentPage==lastPage){
                $("#last-page-btn").find("a").addClass("active");
                $("#prev-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
            }
            else if(currentPage==firstPage+1){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
            else if(currentPage==lastPage-1){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
            else if(currentPage==firstPage+2){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
                $("#prev-page-btn").removeClass("none");
                $("#next-page-btn").removeClass("none");
            }
            else if(currentPage==lastPage-2){
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
                $("#next-page-btn").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
            else{
                $("#current-page-btn").find("a").addClass("active");
                $("#current-page-btn").removeClass("none");
                $("#etc-page-btn1").removeClass("none");
                $("#etc-page-btn2").removeClass("none");
                $("#next-page-btn").removeClass("none");
                $("#prev-page-btn").removeClass("none");
            }
        } 
    }
     $(".page-go").click(function(){
         currentPage=parseInt($(this).text());
         loadAgentsListRequest(currentPage-1);
     });
});