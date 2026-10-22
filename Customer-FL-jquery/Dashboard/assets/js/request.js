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


    /*Clear ac Cookie method*/
    function clearCookie(){
        localStorage.removeItem(ac_c_name);
//        Cookies.remove(ac_c_name);
        window.location.assign("../index.html");
    }


    document.title = site_name+" | "+page_titles.request;

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





    url_path="roubi-customer/order/list?pageNo=0&pageSize=100";
    url_port="9999";
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
        "apikey": "8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL"
      },
      error:function(jqXHR, status, err){
          console.log(jqXHR);
          console.log(status);
          console.log(err);
          if(jqXHR.status==403){
                alert("شما از سیستم خارج شده اید دوباره وارد شوید ...");
                clearCookie();
                window.location.assign("../index.html");
          }
           else{
                alert("اشکال در سرور ها وجود دارد لطفا با پشتیبانی تماس بگیرید");
           }
      },
      success:function(response, status, xhr){
          loadUnRequests(response.response);
      }
    }

    $.ajax(settings).done();


    /* Load Active Unaccepted Requests */





    var $un_request_item = $('#un-request-item').clone();
    var $ac_request_item = $('#ac-request-item').clone();
    var $n_request_item = $('#n-request-item').clone();
    $("#un-request-item").remove();
    $("#ac-request-item").remove();
    $("#n-request-item").remove();
    function loadUnRequests(response){
        console.log(response);
        var un_req_count=0;
        var ac_req_count=0;
        var n_req_p_count=0;
        var n_req_count=0;
        $.each(response.data.orders, function(i,key){

            if(key.statusKey == "COMPLETED" || key.statusKey == "CANCELED_BY_CUSTOMER" || key.statusKey == "CANCELED_BY_SUPPORT_TEAM"){
                n_req_p_count+=1;
            }
        });
        $.each(response.data.orders, function(i,key){
            if(key.statusKey == "ISSUED" || key.statusKey == "WAITING_FOR_ASSIGN" || key.statusKey == "CANCELED_BY_SERVICE_YAR"){
                un_req_count+=1;
                var name_address=(key.address.name + ' : '+key.address.details);
                if (name_address.length >45){
                    name_address = name_address.substr(0,45);
                    name_address+=" ...";
                }
                var new_un_request_item = $un_request_item.clone();
                new_un_request_item.find("#un-request-item-title").text(key.serviceName);
                new_un_request_item.find("#un-request-item-title").attr("value",key.rrn);
                new_un_request_item.find("#un-request-item-name-address").text(name_address);
                new_un_request_item.find("#un-request-item-date").text(key.orderSchedule.date);
                new_un_request_item.find("#un-request-item-time").text(key.orderSchedule.time);
                if (key.statusKey == "ISSUED")
                    {
                        new_un_request_item.find("#un-request-item-state").addClass("accept")
                        new_un_request_item.find("#un-request-item-state-description").html('<span>در جستجوی <span><b>سرویس یار</b></span> مناسب برای شما...</span>');
                        new_un_request_item.find("#un-request-item-state-icon").html('<img src="assets/image/avatarHourglass.svg" alt="">');
                        new_un_request_item.find("#un-request-item-link").attr("href","requestDetailsPreparationSearch.html")
                    }


                else if (key.statusKey == "WAITING_FOR_ASSIGN")
                    {
                        new_un_request_item.find("#un-request-item-state").addClass("accept")
                        new_un_request_item.find("#un-request-item-state-description").html('<span>در انتظار قبول درخواست شما توسط <span><b>'+key.operators+'</b></span> ...</span>');
                        new_un_request_item.find("#un-request-item-state-icon").html('<img src="assets/image/avatar.svg" alt="">');
                        new_un_request_item.find("#un-request-item-link").attr("href","requestDetailsPreparationRequest.html")
                    }
                else if (key.statusKey == "CANCELED_BY_SERVICE_YAR")
                    {
                        new_un_request_item.find("#un-request-item-state-description").addClass("deniedText")
                        new_un_request_item.find("#un-request-item-state").addClass("denied")
                        new_un_request_item.find("#un-request-item-state-description").html('<span>متاسفانه<span><b>'+key.operators+'</b></span>نمی تواند سفارش شما را بر عهده بگیرد.</span>');
                        new_un_request_item.find("#un-request-item-state-icon").html('<img src="assets/image/avatarMultiply.svg" alt="">');
                        new_un_request_item.find("#un-request-item-link").attr("href","requestDetailsPreparationFail.html")
                    }
                $('#un-requests-area').append('<div class="clearfix"></div>');
                $('#un-requests-area').append(new_un_request_item);
                $('#un-requests-area').append('<div class="clearfix"></div>');
            }
            else if(key.statusKey == "ASSIGNED_AND_SCHEDULED" || key.statusKey == "SERVICE_YAK_IS_ARRIVED" || key.statusKey == "SERVICE_YAR_PRICE_ISSUED" || key.statusKey == "SERVICE_YAR_IS_STARTING"){
                ac_req_count+=1;
                console.log(key);
                var name_address=(key.address.name + ' : '+key.address.details);
                if (name_address.length >45){
                    name_address = name_address.substr(0,45);
                    name_address+=" ...";
                }
                var new_ac_request_item = $ac_request_item.clone();
                new_ac_request_item.find("#ac-request-item-title").text(key.serviceName);
                new_ac_request_item.find("#ac-request-item-title").attr("value",key.rrn);
                new_ac_request_item.find("#ac-request-item-name-address").text(name_address);
                new_ac_request_item.find("#ac-request-item-op-name").text(key.operators);
                new_ac_request_item.find("#ac-request-item-date").text(key.orderSchedule.date);
                new_ac_request_item.find("#ac-request-item-time").text(key.orderSchedule.time);
                if (key.serviceName == "نظافت")
                    {
                        new_ac_request_item.find("#ac-request-item-state").addClass("clean");
                        new_ac_request_item.find("#ac-request-item-link").attr("href","requestDetailsPreparationAccept.html");
                    }


                else if (key.serviceName == "پذیرایی")
                    {
                        new_ac_request_item.find("#ac-request-item-state").addClass("catring");
                        new_ac_request_item.find("#ac-request-item-link").attr("href","requestDetailsPreparationAccept.html");
                    }
                else
                    {
                        new_ac_request_item.find("#ac-request-item-state").addClass("maintenance")
                        new_ac_request_item.find("#ac-request-item-link").attr("href","requestDetailsPreparationAccept.html");
                    }
                $('#ac-requests-area').append('<div class="clearfix"></div>');
                $('#ac-requests-area').append(new_ac_request_item);
                $('#ac-requests-area').append('<div class="clearfix"></div>');
            }
            else if(key.statusKey == "COMPLETED" || key.statusKey == "CANCELED_BY_CUSTOMER" || key.statusKey == "CANCELED_BY_SUPPORT_TEAM"){
                n_req_count+=1;
                console.log(key);
                var isCanceled=false;
                var new_n_request_item = $n_request_item.clone();
                new_n_request_item.find("#n-request-item-title").text(key.serviceName);
                new_n_request_item.find("#n-request-item-title").attr("value",key.rrn);
                new_n_request_item.find("#n-request-item-name-address").text(key.address.name);
                new_n_request_item.find("#n-request-item-date").text(key.orderSchedule.date);
                if(key.statusKey == "CANCELED_BY_CUSTOMER" || key.statusKey == "CANCELED_BY_SUPPORT_TEAM"){
                    isCanceled=true;
                    new_n_request_item.find("#n-request-item-price").text("لغو شده");
                    new_n_request_item.find("#n-request-item-price").addClass("red");
                }
                else{
                    isCanceled=false;
                    new_n_request_item.find("#n-request-item-price").text(key.preReceipt.totalAmount+" تومان");
                }
                if(n_req_count==n_req_p_count)
                    {
                        new_n_request_item.addClass("end");
                    }
                if (key.serviceName == "نظافت")
                    {
                        new_n_request_item.find("#n-request-item-state-icon").html('<img src="assets/image/logoGreen.svg" alt="">');
                        if(isCanceled){
                            new_n_request_item.find("#n-request-item-link").attr("href","requestDetailsFail.html");
                        }
                        else{
                            new_n_request_item.find("#n-request-item-link").attr("href","requestDetailsSuccess.html");
                        }
                        new_n_request_item.find("#n-request-item-r-link").attr("href","orderWizard.html");
                    }


                else if (key.serviceName == "پذیرایی")
                    {
                        new_n_request_item.find("#n-request-item-state-icon").html('<img src="assets/image/logoPurple.svg" alt="">');
                        if(isCanceled){
                            new_n_request_item.find("#n-request-item-link").attr("href","requestDetailsFail.html");
                        }
                        else{
                            new_n_request_item.find("#n-request-item-link").attr("href","requestDetailsSuccess.html");
                        }
                        new_n_request_item.find("#n-request-item-r-link").attr("href","orderWizard.html");
                    }
                else
                    {
                        new_n_request_item.find("#n-request-item-state-icon").html('<img src="assets/image/logoOrange.svg" alt="">');
                        if(isCanceled){
                            new_n_request_item.find("#n-request-item-link").attr("href","requestDetailsFail.html");
                        }
                        else{
                            new_n_request_item.find("#n-request-item-link").attr("href","requestDetailsSuccess.html");
                        }
                        new_n_request_item.find("#n-request-item-r-link").attr("href","orderWizard.html");
                    }
                $('#n-requests-item-area').append('<div class="clearfix"></div>');
                $('#n-requests-item-area').append(new_n_request_item);
                $('#n-requests-item-area').append('<div class="clearfix"></div>');
            }

        });
        if(un_req_count==0){
                $('#un-requests-area').append('<div class="request-item d-flex"><div class="clearfix"></div><div class="col-2"></div><div class="col-8 d-flex "><p style="color: #6A6486">درخواست سرویسی ندارید ...</p></div><div class="col-2"></div></div>');
         }
        if(ac_req_count==0){
                $('#ac-requests-area').append('<div class="request-item d-flex"><div class="clearfix"></div><div class="col-2"></div><div class="col-8 d-flex "><p style="color: #6A6486">سفارش پیش رویی ندارید ...</p></div><div class="col-2"></div></div>');
         }
        if(n_req_count==0){
                $('#n-requests-area').append('<div class="request-item d-flex"><div class="clearfix"></div><div class="col-2"></div><div class="col-8 d-flex "><p style="color: #6A6486">سفارش پایان یافته ای ندارید ...</p></div><div class="col-2"></div></div>');
                $('#n-requests-item-area-back').remove();
         }
        $(".un-request-item-link-go").click(function(){
            //Cookies.set('ac_tkn', ac_token, { domain: 'your domain',expires: 7 }); //// If you Want the cookies be  secure use this line with your domain address
            var sel_req_id=$(this).find("#un-request-item-title").attr("value");
//            Cookies.set(selected_req_c_name, sel_req_id, { expires: 1 });
            localStorage.setItem(selected_req_c_name, sel_req_id);
        });
    }







});
