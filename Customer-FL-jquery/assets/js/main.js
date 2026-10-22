
$(window).ready(function(){
    
    /*page attribute variables*/
    var pageURL = $(location).attr("href");
    var filename = pageURL.substring(pageURL.lastIndexOf('/')+1);
    
    var site_name = "روبی آپ"
     var page_names = {index:"index.html",my:"my.html",order_wizard:"orderWizard.html",request:"request.html",req_det_prep_serach:"requestDetailsPreparationSearch.html"};
    var page_titles = {index:"صفحه اصلی",my:"داشبورد",order_wizard:"ثبت سفارش جدید",request:"سفارش ها",req_det_prep_serach:"در جستجوی سرویس یار"};
    
    
    /*selected service variables*/
    var selected_service_name;
    var selected_service_description;
    var selected_service_id;
    var selected_service_type;
    var selected_service_duty_name;
    var selected_service_duty_description;
    var selected_service_duty_type;
    var $ser_inf;
    
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
        window.location.assign("index.html");
    }
    
    var can_order;
    
    
    /*load service section method*/
    function serviceSectionLoad(){
    var $ser_item = $("#ser-item").clone();
    $("#ser-item").remove();
    var $ser_du_item = $("#ser-du-item").clone();
    $("#ser-du-item").remove();
        
        
    url_path = "roubi-domain/serve/"
    url_port = "9999";
    setUrl();     
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": url,
      "method": "GET",
      "headers": {
        "subissuer": "WEB",
        "issuer": "CUSTOMER_NODE",
        "apikey": "Yn2kjibddFAWtnPJ2AFlL8WXmohJMCvigQggaEypa5E"
      },
      error:function(jqXHR, status, err){
          console.log(jqXHR);
          console.log(status);
          console.log(err);
          alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
      },
      success:function(response){
        var html='';
        $('#main-menu-container').append('<div class="clearfix"></div>');
        if(response.response==null){
            $('#main-menu-container').append('<b><p style="font-size: 0.9rem; text-align: center; color: #160d31 ">هم اکنون خدمتی ارائه نمی شود ...</p></b>');
        }
        else{
        $.each(response.response,function(i,key){
            var item_count = (response.response).length;
            var item_count_index = item_count-1;
            $ser_item.removeClass("dispNone");
            var new_ser_item = $ser_item.clone();
            new_ser_item.find("#ser-item-title").text(key.persianName);
            new_ser_item.find("#ser-item-subtitle").text(key.description);
            new_ser_item.find("#ser-item-go").attr("id",i);
            if(key.type=="CLEANING_SERVICE"){
                    new_ser_item.find("#ser-item-bg").addClass("greenBg");
                    new_ser_item.find("#ser-item-logo-show").attr("src","assets/image/logoGreen.svg");
                }
            else if(key.type=="CATERING_SERVICE"){
                    new_ser_item.find("#ser-item-bg").addClass("PurpleBg");
                    new_ser_item.find("#ser-item-logo-show").attr("src","assets/image/logoPurple.svg"); 
                }
            else if(key.type=="MAINTENANCE_SERVICE"){
                    new_ser_item.find("#ser-item-bg").addClass("OrangeBg");
                    new_ser_item.find("#ser-item-logo-show").attr("src","assets/image/logoOrange.svg");
                }
            
            
            if (i%3==0){
                   html += '<div class="clearfix"></div><div class="col-12 d-flex text-center">'; 
                }
            if(item_count%3==2){
                    if (item_count_index-i==1)
                        html+='<div class="col-2"></div>';
                }
            else if(item_count%3==1){
                    if (item_count_index-i==0)
                        html+='<div class="col-4"></div>';
                        
                }
            html +=new_ser_item.html();
            if (i%3==2){
                    html+='</div>';
                }
        });
        $('#main-menu-container').append(html);
        }
        
        
        
        
        $(".item-go").click(function(){
            var j = -1;
            $('#ser-du-container').empty();
            var html='';
            $('#sub-menu-container').append('<div class="clearfix"></div>');
            var res_index = parseInt($(this).attr("id"));
            selected_service_id=res_index;
            selected_service_name = response.response[res_index].persianName;
            selected_service_description = response.response[res_index].description;
            selected_service_type = response.response[res_index].type;
            $("#ser-du-title").text(selected_service_name);
            $.each(response.response[res_index].duties,function(i,key){
                var item_count = (response.response[res_index].duties).length;
                var item_count_index = item_count-1;
                var new_ser_du_item = $ser_du_item.clone();
                new_ser_du_item.find("#ser-du-item-title").text(key.persianName);
                new_ser_du_item.find("#ser-du-item-subtitle").text(key.description);
                if(response.response[res_index].type=="CLEANING_SERVICE"){
                        new_ser_du_item.find("#ser-du-item-bg").addClass("greenBg")
                        new_ser_du_item.find("#ser-du-item-logo-show").attr("src","assets/image/logoGreen.svg");
                        new_ser_du_item.find("#ser-du-item-go").attr("data-target","#clean-service-details");
                    
                        $("#ser-du-title").removeClass();
                        $("#ser-du-title").addClass("green"); 
                    
                        $("#back-item").removeClass("purple");
                        $("#back-item").removeClass("orange");
                        $("#back-item").addClass("green");
                    }
                else if(response.response[res_index].type=="CATERING_SERVICE"){
                        new_ser_du_item.find("#ser-du-item-bg").addClass("PurpleBg");
                        new_ser_du_item.find("#ser-du-item-logo-show").attr("src","assets/image/logoPurple.svg");
                        new_ser_du_item.find("#ser-du-item-go").attr("data-target","#catring-service-details");
                    
                        $("#ser-du-title").removeClass();
                        $("#ser-du-title").addClass("purple");
                    
                        $("#back-item").removeClass("orange");
                        $("#back-item").removeClass("green");
                        $("#back-item").addClass("purple");
                    }
                else if(response.response[res_index].type=="MAINTENANCE_SERVICE"){
                        new_ser_du_item.find("#ser-du-item-bg").addClass("OrangeBg");
                        new_ser_du_item.find("#ser-du-item-logo-show").attr("src","assets/image/logoOrange.svg");
                        new_ser_du_item.find("#ser-du-item-go").attr("data-target","#maintenance-service-details");
                    
                        $("#ser-du-title").removeClass();
                        $("#ser-du-title").addClass("orange");
                    
                        $("#back-item").removeClass("purple");
                        $("#back-item").removeClass("green");
                        $("#back-item").addClass("orange");
                    }
                
                
                if (i%3==0){
                       html += '<div class="clearfix"></div><div class="col-12 d-flex text-center">'; 
                    }
                if(item_count%3==2){
                        if (item_count_index-i==1)
                            html+='<div class="col-2"></div>';
                    }
                else if(item_count%3==1){
                        if (item_count_index-i==0)
                            html+='<div class="col-4"></div>';

                    }
                html += new_ser_du_item.html();
                if (i%3==2){
                        html+='</div>';
                    }
            });
            
            $('#ser-du-container').append(html);
            $("#main-menu-container").addClass("dispNone");
            $("#sub-menu-container").removeClass("dispNone");
            
            $(".du-item-go").click(function(e){
                selected_service_duty_name = $(this).find("#ser-du-item-title").text()
                $.each(response.response[res_index].duties,function(i,key){
                    if (key.persianName==selected_service_duty_name){
                        selected_service_duty_type = key.type;
                        selected_service_duty_description = key.description;
                    }
                });
            })
        });
        }
    }
   
    $.ajax(settings).done();
        
    function loadOrederWizard(){
        if(can_order){
            $ser_inf ={"selected_service_name":selected_service_name,"selected_service_description":selected_service_description, "selected_service_id":selected_service_id,"selected_service_type":selected_service_type,"selected_service_duty_name":selected_service_duty_name,"selected_service_duty_description":selected_service_duty_description,"selected_service_duty_type":selected_service_duty_type};
            
            //Cookies.set('ser_inf', $ser_inf, { domain: 'your domain',expires: 7 }); //// If you Want the cookies be  secure use this line with your domain address
//            Cookies.set('ser_inf', JSON.stringify($ser_inf), { expires: 1 });
            localStorage.setItem('ser_inf', JSON.stringify($ser_inf));
            window.location.assign("Dashboard/orderWizard.html");
        }
        else{
            alert("ابتدا وارد شوید...");
        }
    }
        
    $("#clean-service-details").on('show.bs.modal',function(){
        $("#c-service-title").text(selected_service_name);
        $("#c-service-du-tips").text("نکته ای درباره این خدمت وجود ندارد ...");
        $("#c-service-du-pricing").text("جدول قیمت این خدمت موجود نیست ...");
        if(selected_service_duty_description=="")
            $("#c-service-du-description").text("توضیحی درباره این خدمت وجود ندارد ...");
        else
            $("#c-service-du-description").text(selected_service_duty_description);
    });
    $("#c-go-order").click(function(){ loadOrederWizard();  });
    $("#c-ser-du-des-tab").click(function(){
        $("#c-ser-du-des-tab").addClass("active");
        $("#c-ser-du-tips-tab").removeClass("active");
        $("#c-ser-du-pri-tab").removeClass("active");
        
        $("#c-service-du-description-area").removeClass("dispNone");
        $("#c-service-du-tips-area").addClass("dispNone");
        $("#c-service-du-pricing-area").addClass("dispNone");
    });
    $("#c-ser-du-tips-tab").click(function(){
        $("#c-ser-du-des-tab").removeClass("active");
        $("#c-ser-du-tips-tab").addClass("active");
        $("#c-ser-du-pri-tab").removeClass("active");
        
        $("#c-service-du-description-area").addClass("dispNone");
        $("#c-service-du-tips-area").removeClass("dispNone");
        $("#c-service-du-pricing-area").addClass("dispNone");
    });
    $("#c-ser-du-pri-tab").click(function(){
        $("#c-ser-du-des-tab").removeClass("active");
        $("#c-ser-du-tips-tab").removeClass("active");
        $("#c-ser-du-pri-tab").addClass("active");
        
        $("#c-service-du-description-area").addClass("dispNone");
        $("#c-service-du-tips-area").addClass("dispNone");
        $("#c-service-du-pricing-area").removeClass("dispNone");
    });
       
    $("#catring-service-details").on('show.bs.modal',function(){
        $("#ca-service-title").text(selected_service_name);
        $("#ca-service-du-tips").text("نکته ای درباره این خدمت وجود ندارد ...");
        $("#ca-service-du-pricing").text("جدول قیمت این خدمت موجود نیست ...");
        if(selected_service_duty_description=="")
            $("#ca-service-du-description").text("توضیحی درباره این خدمت وجود ندارد ...");
        else
            $("#ca-service-du-description").text(selected_service_duty_description);
    });
    $("#ca-go-order").click(function(){ loadOrederWizard(); });
    $("#ca-ser-du-des-tab").click(function(){
        $("#ca-ser-du-des-tab").addClass("active");
        $("#ca-ser-du-tips-tab").removeClass("active");
        $("#ca-ser-du-pri-tab").removeClass("active");
        
        $("#ca-service-du-description-area").removeClass("dispNone");
        $("#ca-service-du-tips-area").addClass("dispNone");
        $("#ca-service-du-pricing-area").addClass("dispNone");
    });
    $("#ca-ser-du-tips-tab").click(function(){
        $("#ca-ser-du-des-tab").removeClass("active");
        $("#ca-ser-du-tips-tab").addClass("active");
        $("#ca-ser-du-pri-tab").removeClass("active");
        
        $("#ca-service-du-description-area").addClass("dispNone");
        $("#ca-service-du-tips-area").removeClass("dispNone");
        $("#ca-service-du-pricing-area").addClass("dispNone");
    });
    $("#ca-ser-du-pri-tab").click(function(){
        $("#ca-ser-du-des-tab").removeClass("active");
        $("#ca-ser-du-tips-tab").removeClass("active");
        $("#ca-ser-du-pri-tab").addClass("active");
        
        $("#ca-service-du-description-area").addClass("dispNone");
        $("#ca-service-du-tips-area").addClass("dispNone");
        $("#ca-service-du-pricing-area").removeClass("dispNone");
    });
        
    $("#maintenance-service-details").on('show.bs.modal',function(){
        $("#m-service-title").text(selected_service_name);
        $("#m-service-du-tips").text("نکته ای درباره این خدمت وجود ندارد ...");
        $("#m-service-du-pricing").text("جدول قیمت این خدمت موجود نیست ...");
        if(selected_service_duty_description=="")
            $("#m-service-du-description").text("توضیحی درباره این خدمت وجود ندارد ...");
        else
            $("#m-service-du-description").text(selected_service_duty_description);
    });
    $("#m-go-order").click(function(){ loadOrederWizard(); });
    $("#m-ser-du-des-tab").click(function(){
        $("#m-ser-du-des-tab").addClass("active");
        $("#m-ser-du-tips-tab").removeClass("active");
        $("#m-ser-du-pri-tab").removeClass("active");
        
        $("#m-service-du-description-area").removeClass("dispNone");
        $("#m-service-du-tips-area").addClass("dispNone");
        $("#m-service-du-pricing-area").addClass("dispNone");
    });
    $("#m-ser-du-tips-tab").click(function(){
        $("#m-ser-du-des-tab").removeClass("active");
        $("#m-ser-du-tips-tab").addClass("active");
        $("#m-ser-du-pri-tab").removeClass("active");
        
        $("#m-service-du-description-area").addClass("dispNone");
        $("#m-service-du-tips-area").removeClass("dispNone");
        $("#m-service-du-pricing-area").addClass("dispNone");
    });
    $("#m-ser-du-pri-tab").click(function(){
        $("#m-ser-du-des-tab").removeClass("active");
        $("#m-ser-du-tips-tab").removeClass("active");
        $("#m-ser-du-pri-tab").addClass("active");
        
        $("#m-service-du-description-area").addClass("dispNone");
        $("#m-service-du-tips-area").addClass("dispNone");
        $("#m-service-du-pricing-area").removeClass("dispNone");
    });
    
    $("#back-item").click(function(){
        $("#sub-menu-container").addClass("dispNone");
        $("#main-menu-container").removeClass("dispNone");
    })
    }
    
    function tokenCheck(cookiename){
        var token= localStorage.getItem(cookiename);
//        var token= Cookies.get(cookiename)
        if (token==null){
                window.location.assign("index.html");
        }
        else{
                return token;
        }
    }
    
      
    serviceSectionLoad();
    /*My*/
    if(filename==page_names.my){
        document.title = site_name+" | "+page_titles.my;
        ac_token = tokenCheck(ac_c_name);
        can_order=true;
    }
    else{
        document.title = site_name+" | "+page_titles.index;
//        if (Cookies.get(ac_c_name)!=null){
        if (localStorage.getItem(ac_c_name)!=null){
            window.location.assign("my.html");
        }
    }
    
        
    ////start Login-section
    var phone="";
    var val_code;
    //var pregx=/(09)(12|19|35|36|37|38|39|32)\d{7}/;
    var pregx=/(09)\d{9}/;
    var counter;
    function setSendAgainTimer(){
        $("#login-send-again").addClass("display-none");
        $("#login-cd-timer").removeClass("display-none");
        var min_count=2;
        var sec_count=0;
        sec_count+=1;
        counter =setInterval(timer, 1000);
        function timer(){
            sec_count-=1;
            
            if((min_count+"").length==1)
                cd_min="0"+min_count;
            else
                cd_min=min_count;
            
            
            if((sec_count+"").length==1)
                cd_sec="0"+sec_count;
            else
                cd_sec=sec_count;
            
            
            $("#login-cd").text(cd_min+":"+cd_sec);
            
            if(sec_count==0 &&min_count==0){
                clearInterval(counter);
                $("#login-cd").text("02:00");
                $("#login-cd-timer").addClass("display-none");
                $("#login-send-again").removeClass("display-none");
            }
            if (sec_count <= 0)
            {
                sec_count=60;
                min_count-=1;
                return;
            }
        }
    }
    function phoneReg(a){
        phone = a;
        if(pregx.test(phone)){
            $("#login-phone-entry").text(phone);
            
            url_path = "roubi-guard/otp/phone"
            url_port = "9999";
            setUrl();
            
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": url,
              "method": "POST",
              "headers": {
                "subissuer": "WEB",
                "issuer": "CUSTOMER_NODE",
                "apikey": "Yn2kjibddFAWtnPJ2AFlL8WXmohJMCvigQggaEypa5E",
                "content-type": "application/json"
              },
              "processData": false,
              "data": JSON.stringify({"phone":phone}),
              error:function(jqXHR, status, err){
                  console.log(jqXHR);
                  console.log(status);
                  console.log(err);
                  alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
              },
              success:function(response, status, xhr){
                  $("#login-1").modal("hide");
                  
                  
                  $("#login-2").modal("show");
                  
              }
            }

            $.ajax(settings).done();
        }
        else{
            alert("شماره تلفن وارد شده معتبر نمی باشد.");
            var phone="";
            $(a).val("");
        }
    }
        
    $("#login-phone-reg").click(function(){
        phoneReg($("#login-phonenumber1").val());
    });
    $("#login-phone-reg2").click(function(){
        phoneReg($("#login-phonenumber2").val());
    });
    $("#login-send-again").click(function(){
        phoneReg($("#login-phone-entry").text());
        setSendAgainTimer();
    });
    
    
    var isUser;
    function checkIsUser(){
        
        url_path = "roubi-customer/profile/"
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
            "issuer": "CUSTOMER_NODE",
            "apikey": "8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL",
            "content-type": "application/json"
          },
            error:function(jqXHR, status, err){
              console.log(jqXHR);
              console.log(status);
              console.log(err);
              if (jqXHR.status == 403){
                  isUser = false;
                  $("#login-2").modal("hide");
                  $("#user-reg").modal("show");
              }
          },
          success:function(response, status, xhr){
              window.location.assign("my.html");
          }
        }

        $.ajax(settings).done();
    }
    function userRegisteration(){
        var u_name = $("#user-name").val();
        var u_family_name = $("#user-family-name").val();
        var u_email = $("#user-email").val();
        var u_phone = phone;
        var u_sex = $("#user-sex").children("option:selected").val();
        var pp_check = $('#user-pp-check').is(':checked');
        if(u_name=="" && u_family_name=="" && u_email=="" ){
            alert("لطفا تمام موارد خواسته شده را پر کنید.");
        }
        else{
            if(!pp_check){
                alert("شما قوانین را نپذیرفته اید.");
            }
            else{
                  url_path = "roubi-customer/register/form"
                  url_port = "9999";
                  setUrl();
                  var settings = {
                      "async": true,
                      "crossDomain": true,
                      "url": url,
                      "method": "POST",
                      "headers": {
                        "access-token":ac_token,
                        "subissuer": "WEB",
                        "issuer": "CUSTOMER_NODE",
                        "apikey": "8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL",
                        "content-type": "application/json"
                      },
                      "processData": false,
                      "data": JSON.stringify({"firstName":u_name,"lastName":u_family_name,"mobileNumber":u_phone,"email":u_email,"sex":u_sex}),
                      error:function(jqXHR, status, err){
                          console.log(jqXHR);
                          console.log(status);
                          console.log(err);
                        if(jqXHR.status==406){
                            alert(jqXHR.responseJSON.response);
                        }
                        else{
                          alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
                        }
                      },
                      success:function(response, status, xhr){
                          alert(response.response.data);
                          location.reload();
                      }
                }
                $.ajax(settings).done();
            }
        }
        
    }
    $("#login-phone-reg-send").click(function(){
        val_code = $("#login-validation-code").val();
        
        url_path = "roubi-guard/otp/code"
        url_port = "9999";
        setUrl();
        
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "POST",
          "headers": {
            "subissuer": "WEB",
            "issuer": "CUSTOMER_NODE",
            "apikey": "Yn2kjibddFAWtnPJ2AFlL8WXmohJMCvigQggaEypa5E",
            "content-type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify({"code":val_code,"phone":phone}),
          error:function(jqXHR, status, err){
              console.log(jqXHR);
              console.log(status);
              console.log(err);
              $("#login-validation-code").val("");
              if (jqXHR.status == 406){
                  alert(jqXHR.responseJSON.response);
              }
              else 
                  alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
          },
          success:function(response, status, xhr){
            ac_token=xhr.getResponseHeader("Access-token");
            $("#login-validation-code").val("");
            //Cookies.set(ac_c_name, ac_token, { domain: 'your domain',expires: 7 }); //// If you Want the cookies be  secure use this line with your domain address
//            Cookies.set(ac_c_name, ac_token, { expires: 1 });
            localStorage.setItem(ac_c_name, ac_token);
            checkIsUser();
          }
        }

        $.ajax(settings).done();
    });
    $("#user-register").click(function(){
       userRegisteration();
    });
    
    $("#user-reg").on('hide.bs.modal',function(){
        $("#user-name").val("");
        $("#user-family-name").val("");
        $("#user-email").val("");
        $("#user-pp-check"). prop("checked", false);
        
    });
    $("#login-2").on('show.bs.modal',function(){
        phone=$("#login-phone-entry").text();
        setSendAgainTimer();
        
    });
    $("#login-2").on('hide.bs.modal',function(){
        $("#login-phonenumber1").val("");
        $("#login-phonenumber2").val("");
        $("#login-cd").text("02:00");
        $("#login-validation-code").val("");
        clearInterval(counter);
        $("#login-send-again").addClass("display-none");
        $("#login-cd-timer").removeClass("display-none");
    });
        
    $("#login-1").on('hide.bs.modal',function(){
        $("#login-phonenumber1").val("");
        $("#login-phonenumber2").val("");
    });

})


