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
        // window.location.assign("../index.html");
    }



    document.title = site_name+" | "+page_titles.req_det_prep_serach;



//    sel_req_id = Cookies.get(selected_req_c_name);
    var sel_req_id = localStorage.getItem(selected_req_c_name);

    /* Check Access-Token*/
    function tokenCheck(cookiename){
        var token= localStorage.getItem(cookiename);
//        var token= Cookies.get(cookiename)
        if (token==null){
                // window.location.assign("../index.html");
        }
        else{
                return token;
        }
    }
    ac_token = tokenCheck(ac_c_name);




    /*Load Request Details */


    url_path="roubi-customer/order/"+sel_req_id;
    url_port="9999";
    setUrl();


    var settings = {
      "async": true,
      "crossDomain": true,
      "url":  url,
      "method": "GET",
      "headers": {
        "access-token": ac_token,
        "subissuer": "WEB",
        "issuer": "CUSTOMER_NODE",
        "apikey": " 8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL"
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
          loadRequestDetails(response.response);
      }
    }

    $.ajax(settings).done();



    var $un_request_details_addons_item = $('#un_request_details_addons_item').clone();
    $("#un_request_details_addons_item").remove();

    function loadRequestDetails(response){
        console.log(response);
        $.each(response.data.addonsName,function(i,key){
            var new_un_request_details_addons_item = $un_request_details_addons_item.clone();
            new_un_request_details_addons_item.text(key);
            $('#un_request_details_addons_area').append(new_un_request_details_addons_item);
            $('#un_request_details_addons_area').append('</br>');
        })
        $("#un_request_details_code").text(sel_req_id);
        $("#un_request_details_title").text(response.data.serviceName);
        $("#un_request_details_address_name").text(response.data.address.name);
        $("#un_request_details_address").text(response.data.address.details);
        $("#un_request_details_date").text(response.data.orderSchedule.date);
        $("#un_request_details_time").text(response.data.orderSchedule.time);
        $("#un_request_details_duration").text(response.data.conditions["مدت زمان"] + "  ساعت");
        $("#un_request_details_description").text(response.data.description);
        $("#un_request_details_reg_date").text("خوانده نمی شود.");
    }

    $("#cancel-req").click(function(){

        url_path="roubi-customer/order/"+sel_req_id+"/cancel";
        url_port="9999";
        setUrl();
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "PUT",
          "headers": {
            "access-token": ac_token,
            "subissuer": "WEB",
            "issuer": "CUSTOMER_NODE",
            "apikey": " 8WXmohJMCvigQggaEypa5EYn2kjibddFAWtnPJ2AFlL"
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
              alert("سفارش مورد نظر با موفقیت لغو شد ...");
              window.location.assign("request.html");
          }
        }

        $.ajax(settings).done();
    })
});
