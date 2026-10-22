$(document).ready(function(){
    /*page attribute variables*/
    var pageURL = $(location).attr("href");
    var filename = pageURL.substring(pageURL.lastIndexOf('/')+1);
    
    var site_name = "روبی آپ"
     var page_names = {index:"index.html",my:"my.html",order_wizard:"orderWizard.html",request:"request.html",req_det_prep_serach:"requestDetailsPreparationSearch.html"};
    var page_titles = {index:"صفحه اصلی",my:"داشبورد",order_wizard:"ثبت سفارش جدید",request:"سفارش ها",req_det_prep_serach:"در جستجوی سرویس یار"};
    
    
    /*selected service variables*/
    var resp;
    var selected_service_id;
    var selected_service_type;
    var selected_service_name;
    var selected_service_description;
    
    var selected_service_duty_id;
    var selected_service_duty_type;
    var selected_service_duty_name;
    var selected_service_duty_description;
    
    var selected_service_duty_addon_name;
    var selected_service_duty_addon_type;
    var selected_service_duty_addon_id;
    
    var $ser_inf;
    
    /*selected duty condition variables*/
    var min_hour;
    var max_hour;
    
    var min_op;
    var max_op;
    
    
    /*Ordered Details Variables*/
    var selected_duration;
    var selected_op_count;
    var selected_op_sex;
    var order_description="";
    var selected_schedule_date;
    var selected_schedule_time;
    var selected_address_id;
    var selected_serviceyar_selector;
    var selected_addons={"addons": []};
    var selected_addons_ar=[];
    
    
    
    /*address Details Variables*/
    var address_name;
    var address_details;
    var address_latitude;
    var address_longitude;
    var address_phone;
    
    
    
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
    var selected_req_c_name= "slct_req";
    function clearCookie(){
        localStorage.removeItem(ac_c_name);
//        Cookies.remove(ac_c_name);
        window.location.assign("../index.html");
    }
    
    
    
    
    document.title = site_name+" | "+page_titles.order_wizard;
    
//    $ser_inf = JSON.parse(Cookies.get('ser_inf'));
    $ser_inf = JSON.parse(localStorage.getItem('ser_inf'));
    selected_service_name=$ser_inf.selected_service_name;
    selected_service_description=$ser_inf.selected_service_description;
    selected_service_id=$ser_inf.selected_service_id;
    selected_service_type=$ser_inf.selected_service_type;
    selected_service_duty_name=$ser_inf.selected_service_duty_name;
    selected_service_duty_description=$ser_inf.selected_service_duty_description;
    selected_service_duty_type=$ser_inf.selected_service_duty_type;
    
    
    
    
    
    /* Check Access-Token*/
    function tokenCheck(cookiename){
        var token= localStorage.getItem(cookiename);
//        var token= Cookies.get(cookiename)
        if (token==null){
                window.location.assign("../index.html");
        }
        else{
                return token;
        }
    }
    ac_token = tokenCheck(ac_c_name);
    
    
    /* Load Service Details*/
    $("#order-details-title").text("درخواست خدمات "+selected_service_name);
    if(selected_service_description=="")
        $("#order-details-description").text("توضیحی درباره این خدمت وجود ندارد ...");
    else
        $("#order-details-description").text(selected_service_description);
    
    
    
    /* Load Order Details Section */
    
    var $order_de_item = $("#order-details-duties-item").clone();
    var $order_de_addon_item = $("#order-details-duties-addon-item").clone();
    $("#order-details-duties-item").remove();
    $("#order-details-duties-addon-item").remove();
    
    url_path="roubi-domain/serve/"+selected_service_type;
    url_port="9999";
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
          if(jqXHR.status==403){
                alert("شما از سیستم خارج شده اید دوباره وارد شوید ...");
                clearCookie();
          }
           else{
                alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
           }
      },
      success:function(response, status, xhr){
          resp=response.response;
          orderDetailsSectionLoad(response.response);
          setPrice(response.response);
      }
    }

    $.ajax(settings).done();
    
    /*////Handle Details Buttons////*/
    
    function orderDetailsSectionLoad(response){
        $.each(response.duties ,function(i,key){
            var new_order_de_item = $order_de_item.clone();
            if (key.type==selected_service_duty_type){
                new_order_de_item.find("#order-details-duties-item-button").addClass("activeBtn");
                selected_service_duty_id = i;
            }
            new_order_de_item.find("#order-details-duties-item-button").text(key.persianName);
            if(key.description=="")
                $("#order-details-duties-description").text("توضیحاتی درباره این خدمت وجود ندارد ...");
            else
                $("#order-details-duties-description").text(key.description);
            $("#order-details-duties-area").append(new_order_de_item);
        });
        orderAddonsSectionLoad(response,selected_service_duty_id);
        setOrderDetailsCondtions(response,selected_service_duty_id);
        $(".order-duties-button").click(function(){
            $(".order-duties-button").removeClass("activeBtn");
            $(this).addClass("activeBtn");
            selected_service_duty_name = $(this).text()
            $.each(response.duties ,function(i,key){
                if (selected_service_duty_name==key.persianName){
                    selected_service_duty_id = i;
                    selected_service_duty_type=key.type;
                    selected_service_duty_description=key.description;
                }
            });
            orderAddonsSectionLoad(response,selected_service_duty_id);
            setOrderDetailsCondtions(response,selected_service_duty_id);
            setPrice(response);
        });
    }
    function orderAddonsSectionLoad(response, i){
        $("#order-details-duties-addon-area").empty();
        $.each(response.duties[i].addons ,function(i,key){
            var new_order_de_addon_item = $order_de_addon_item.clone();
            new_order_de_addon_item.find("#order-details-duties-addon-item-button").text(key.persianName);
            $("#order-details-duties-addon-description").text(key.description);
            $("#order-details-duties-addon-area").append(new_order_de_addon_item);
        });
        $(".order-duties-addon-button").click(function(){
            selected_service_duty_addon_name=$(this).text()
            $.each(response.duties[i].addons ,function(i,key){
                if (selected_service_duty_addon_name==key.persianName){
                    selected_service_duty_addon_id=i;
                    selected_service_duty_addon_type=key.type;
                }
            });
            if(!$(this).hasClass("activeBtn")){
                $(this).addClass("activeBtn");
                addToAddons(selected_service_duty_addon_type,selected_service_duty_addon_id);
            }
            else{
                $(this).removeClass("activeBtn");
                removeFromAddons(selected_service_duty_addon_type);
            }
            setPrice(response);
        });
    }
    
    function addToAddons(type,id){
        selected_addons.addons.push({"id":id,"type": type});
    }
    function removeFromAddons(type){
        $.each(selected_addons.addons,function(i,key){
       if(key.type==type)
           selected_addons.addons.splice(i,1);
       });
    }
    
    
    
    
    /*////Handle Details Conditions////*/
    
    
    var $order_de_conditions_op_count_item = $("#order-details-duties-conditions-op-count-item").clone();
    $("#order-details-duties-conditions-op-count-item").remove();
    
    var $order_de_conditions_op_sex_item = $("#order-details-duties-conditions-op-sex-item").clone();
    $("#order-details-duties-conditions-op-sex-item").remove();
    
    function setOrderDetailsCondtions(response,i){
        var duration_res;
        var op_count_res;
        $.each(response.duties[i].conditions ,function(i,key){
            if (key.type == "DURATION_CONDITION")
                duration_res=key;
            else if (key.type == "OPERATOR_COUNT_CONDITION")
                op_count_res=key;
        });
        
        min_hour = duration_res.minHours;
        max_hour = duration_res.maxHours;
        selected_duration=min_hour;
        $("#hours").text(selected_duration+"");
        
        min_op=parseInt(op_count_res.min);
        max_op=parseInt(op_count_res.max);
        
        $("#order-details-duties-conditions-op-count").empty();
        $("#order-details-duties-conditions-op-sex").empty();
        
        for (x=min_op;x<=max_op;x++){
            var new_order_de_conditions_op_count_item = $order_de_conditions_op_count_item.clone(); 
            new_order_de_conditions_op_count_item.text(x + "نفر");
            new_order_de_conditions_op_count_item.attr("value",x);
            if(x==min_op)
                selected_op_count =x;
            $("#order-details-duties-conditions-op-count").append(new_order_de_conditions_op_count_item);
        }
        
        $("#order-details-duties-conditions-op-count").change(function(){
            selected_op_count= $(this).children("option:selected").val();
            setPrice(response);
        });
        
        $.each(op_count_res.sexTypeItem, function(i,key){
            var new_order_de_conditions_op_sex_item = $order_de_conditions_op_sex_item.clone(); 
            new_order_de_conditions_op_sex_item.text(key.persianName);
            new_order_de_conditions_op_sex_item.attr("value",key.type);
            if(i==0)
                selected_op_sex=key.type;
            $("#order-details-duties-conditions-op-sex").append(new_order_de_conditions_op_sex_item);
        });
        
        $("#order-details-duties-conditions-op-sex").change(function(){
            selected_op_sex= $(this).children("option:selected").val();
            setPrice(response)
        });
        
    }
    
    
    
    
    
    
    
     /*////Handle Pricing////*/
    
    
    
   function setPrice(response , selected_duty = selected_service_duty_id, slctd_addons = selected_addons,slctd_op_count=selected_op_count,slctd_op_sex=selected_op_sex,slctd_duration=selected_duration){
        var basic_price = response.duties[selected_duty].basicPrice;
        
        var addons_price = findSelectedAddonsPrice(response.duties[selected_duty],slctd_addons.addons);
        
        
        var duration_res;
        var op_count_res;
        $.each(response.duties[selected_duty].conditions ,function(i,key){
            if (key.type == "DURATION_CONDITION")
                duration_res=key;
            else if (key.type == "OPERATOR_COUNT_CONDITION")
                opsex_opcount_res=key;
        });
        
     
        var minhour=duration_res.minHours;
        var duration_price = findSelectedDurationPrice(duration_res,slctd_duration,minhour);
//        var opsex_opcount_price = findSelectedOpSexOpCountPrice(opsex_opcount_res,slctd_op_sex,slctd_op_count);
       
        var opsex_price = findSelectedOpSexPrice(opsex_opcount_res,slctd_op_sex);
       
        var final_price = (basic_price+duration_price+opsex_price)*slctd_op_count+addons_price;
//        var final_price = basic_price+addons_price+opsex_opcount_price+duration_price;
        $("#order-price").text(final_price + " تومان");
    }
    
    function findSelectedAddonsPrice(response,selected_addons){
        var add_price=0;
        $.each(selected_addons,function(i,key1){
            $.each(response.addons,function(i,key2){
                if(key1.type==key2.type){
                    if(key2.priceChanger.operator == "SUM")
                        {
                           add_price+= key2.priceChanger.delta;
                        }
                }
            });
        });
        return(add_price);
    }
//    function findSelectedOpSexOpCountPrice(response,selected_op_sex,slctd_op_count){
//        var op_sex_price=0;
//        $.each(response.sexTypeItem,function(i,key){
//            if(key.type==selected_op_sex){
//                op_sex_price=key.changer.delta*slctd_op_count;
//            }
//        }); 
//        return op_sex_price;
//    }
    function findSelectedOpSexPrice(response,selected_op_sex){
        var op_sex_price=0;
        $.each(response.sexTypeItem,function(i,key){
            if(key.type==selected_op_sex){
                op_sex_price=key.changer.delta;
            }
        }); 
        return op_sex_price;
    }
    
    function findSelectedDurationPrice(response,selected_duration,minhour){
        var duration_price=0;
        if(response.priceChanger.operator=="SUM"){
            for (i =minhour+1 ; i<=selected_duration;i++){
                duration_price+=response.priceChanger.delta;
            }
        }
        return duration_price;
    }
    
    
    
    /*////Handle Durations////*/
    
    $("#min-hours").click(function(){
        selected_duration = parseInt($("#hours").text());
        if (selected_duration != min_hour){
            if(selected_duration==max_hour){
                $("#plus-hours").css("cursor","pointer");
                $("#plus-hours").removeClass("gray");
                $("#plus-hours").addClass("orange");
            }
            selected_duration-=1;
            $("#hours").text(selected_duration+"");
            setPrice(resp);
            if(selected_duration==min_hour){
                $("#min-hours").css("cursor","");
                $("#min-hours").removeClass("orange");
                $("#min-hours").addClass("gray");
            }
        } 
    });
    $("#plus-hours").click(function(){
        selected_duration = parseInt($("#hours").text());
        if (selected_duration != max_hour){
            if(selected_duration==min_hour){
                $("#min-hours").css("cursor","pointer");
                $("#min-hours").removeClass("gray");
                $("#min-hours").addClass("orange");
            }
            selected_duration+=1;
            $("#hours").text(selected_duration+"");
            setPrice(resp);
            if(selected_duration==max_hour){
                $("#plus-hours").css("cursor","");
                $("#plus-hours").removeClass("orange");
                $("#plus-hours").addClass("gray");
            }
        }
    });
    
    
     /* Order schedule Section */

    /*//// data time picker ////*/
    $("#order-schedule-date").datepicker({
        minDate: 0,
        maxDate: "+30D",
        isRTL: true,
        dateFormat: "yy-m-d"
    });
    
    $("#order-schedule-date").change(function(){
        selected_schedule_date=$("#order-schedule-date").val();
    });
    
    $('#order-schedule-time').datetimepicker({
        pickDate: false
    });
    

    /*//// add address ////*/
    
    $("#profile-add-address").click(function(){
        if ($("#address-name").val()!="" && $("#address-details").val() != "" && $("#address-phone").val() != ""){
            address_name = $("#address-name").val();
            address_details = $("#address-details").val();
            address_latitude = 0.02121212;
            address_longitude = 0.56989545;
            address_phone = $("#address-phone").val();
            url_path="roubi-customer/profile/address/register";
            url_port="9999";
            setUrl();
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": url,
              "method": "POST",
              "headers": {
                "access-token": ac_token,
                "subissuer": "WEB",
                "issuer": "CUSTOMER_NODE",
                "apikey": "8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL",
                "content-type": "application/json"
              },
              "processData": false,
              "data": JSON.stringify({
                "name":address_name,
                "details": address_details,
                "latitude":address_latitude,
                "longitude":address_longitude,
                "phone":address_phone
              }),
            error:function(jqXHR, status, err){
                  console.log(jqXHR);
                  console.log(status);
                  console.log(err);
                if(jqXHR.status==403){
                    alert("شما از سیستم خارج شده اید دوباره وارد شوید ...");
                    clearCookie();
                }
                else if(jqXHR.status==406){
                    alert(jqXHR.responseJSON.response);
                }
                else{
                  alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
                }
              },
              success:function(response, status, xhr){
                  loadAdresses();
                  $("#addAddress").modal("hide");
                  alert("آدرس مورد نظر وارد شد.");
              }
            }
            $.ajax(settings).done();
        }
        else{
            alert("لطفا تمامی موارد را وارد کنید.");
        }
    });
    
    /*//// get address's ////*/
    
    var $order_address_item = $("#order-address-choice-item").clone();
     $("#order-address-choice-item").remove();
    
    
    loadAdresses();
    
    function loadAdresses(){
        url_path="roubi-customer/profile/address";
        url_port="9999";
        setUrl();
        var settings = {
        "async": true,
          "crossDomain": true,
          "url": url,
          "method": "GET",
          "headers": {
            "access-token":ac_token,
            "subissuer": "WEB",
            "issuer": "CUSTOMER_NODE",
            "apikey": "8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL",
            "content-type": "application/json"
          },
        error:function(jqXHR, status, err){
          console.log(jqXHR);
          console.log(status);
          console.log(err);
          if(jqXHR.status==403){
                alert("شما از سیستم خارج شده اید دوباره وارد شوید ...");
                clearCookie();
          }
           else{
                alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
           }
          },
          success:function(response, status, xhr){
              getProfileAddresses(response.response);
          }
        }
    
    $.ajax(settings).done();
    }
      
    
    function getProfileAddresses(response){
        $("#order-address-choice-area").empty();
        if(response.data==null){
            $("#order-address-choice-area").append('<p style=" font-size:0.8rem;padding-right: 30px;color: #8A8F99 ">آدرسی در پروفایل شما موجود نیست ...</p>');
        }
        $.each(response.data ,function(i,key){
            var new_order_address_item = $order_address_item.clone();
            new_order_address_item.find("#order-address-choice-item-name").text(key.name);
            new_order_address_item.find("#order-address-choice-item-detais").text(key.details);
            new_order_address_item.find("#order-address-choice-item-id").val(key.id);
            new_order_address_item.find("#order-address-choice-item-id").attr("id","radio-add-"+i);
            new_order_address_item.find("#order-address-choice-item-id-sel").attr("for","radio-add-"+i);
            $("#order-address-choice-area").append(new_order_address_item);
        });
        $(".order-address-choice-item").click(function(){
            $(".order-address-choice-area").find(".order-address-choice-item").removeClass("item-selected");
            var $slctd_ad_radio = $(".order-address-choice-area").find("input[name='common-radio-address']:checked ").parent();
            $slctd_ad_radio .addClass("item-selected"); 
        });
    }
    
    
    $("#order-reg").click(function(){
        selected_address_id=$("input[name='common-radio-address']:checked").val();
        selected_serviceyar_selector=$("input[name='common-radio-ser-sel']:checked").val();
        selected_schedule_time=$("#order-schedule-time-txt").val();
        selected_schedule_date=$("#order-schedule-date").val();
        $.each(selected_addons.addons,function(i,key){
           selected_addons_ar.push(key.type);
        });
        if(selected_schedule_date=="" && selected_schedule_time==""){
            alert("لطفا تاریخ و زمان مد نظر خود را وارد کنید...");
            return;
        }
        if(selected_address_id==undefined){
            alert("لطفا آدرس مد نظر خود را انتخاب کنید");
            return;
        }
        if(selected_serviceyar_selector==undefined){
            alert("لطفا متد انتخاب سرویس یار را انتخاب کنید");
            return;
        }
        
        url_path="roubi-customer/order/register";
        url_port="9999";
        setUrl();
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "POST",
          "headers": {
            "access-token": ac_token,
            "subissuer": "WEB",
            "issuer": "CUSTOMER_NODE",
            "apikey": " 8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL",
            "content-type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify({
              "serviceType": selected_service_type,
              "dutyType": selected_service_duty_type,
              "addons": selected_addons_ar,
              "condition": {
                "OPERATOR_COUNT_CONDITION":[
                  {
                    "sex":selected_op_sex,
                    "count":selected_op_count
                  }
                ],
                "DURATION_CONDITION":selected_duration
              },
              "description": order_description,
              "addressId": selected_address_id,
              "schedule": {
                "date":selected_schedule_date,
                "time":selected_schedule_time
              },
              "serviceYarSelector": selected_serviceyar_selector
          }),
            error:function(jqXHR, status, err){
                  console.log(jqXHR);
                  console.log(status);
                  console.log(err);
                if(jqXHR.status==403){
                    alert("شما از سیستم خارج شده اید دوباره وارد شوید ...");
                    clearCookie();
                }
                else if(jqXHR.status==406){
                    alert(jqXHR.responseJSON.response);
                }
                else{
                  alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
                }
              },
              success:function(response, status, xhr){
                  alert("سفارش شما ثبت شد");
                  //Cookies.set('ac_tkn', ac_token, { domain: 'your domain',expires: 7 }); //// If you Want the cookies be  secure use this line with your domain address
                  var sel_req_id=response.response.data.rrn;
//                  Cookies.set(selected_req_c_name, sel_req_id, { expires: 1 });
                localStorage.setItem(selected_req_c_name, sel_req_id);
                  window.location.assign("requestDetailsPreparationSearch.html");
              }
            
        }
        $.ajax(settings).done();
        
    });
    

    $('#order-description').on('input', function(){
         order_description = $('#order-description').val();
    })
    $("#order-sub-1").click(function(){
        $('#tabs a[href="#menu1"]').tab('show');
    })
    $("#order-sub-2").click(function(){
        $('#tabs a[href="#menu2"]').tab('show');
    })
    
    $("#addAddress").on('hide.bs.modal',function(){
      $("#address-name").val("");
      $("#address-details").val("");
      $("#address-phone").val(""); 
    });
});
