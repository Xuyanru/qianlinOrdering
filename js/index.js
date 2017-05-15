$(function(){

//	主页check图标点击切换图标
	$("#main .login form  ul li:last-child img").click(function(){
		if(!($(this).hasClass("active"))){
			this.src="img/00-xin-s_08.png";
			$(this).addClass("active");
		}else{
			this.src="img/00-xin-s_08-06.png";
			$(this).removeClass("active");
		}
	});
	
//	登录页面

	function getUers(){
		var users=[];
		for(var i=0;i<10;i++){
			users.push("Admin"+(i+1));
		}
		var usersfrag=document.createDocumentFragment();
		$.each(users, function(i,item) {
			$(usersfrag).append("<li class='lf txtcenter'><span>"+item+"</span></li>");
		});
		$("#logIn .unamedialog ul.w940").html("").append(usersfrag);
	}

//	点击输入用户名时弹出用户名选择框
	$("#username").focus(function(){
		getUers();
		$("#logIn .unamedialog").fadeIn();
	});
	
	$("#logIn .unamedialog").on("click","ul li span",function(){
		var uname=$(this).html();
		$("#username").val(uname);
		if(window.localStorage.getItem(uname)){
			$("#check").addClass("active").attr("src","img/00-xin-s_08.png");
			$("#userpass").val(window.localStorage.getItem(uname));
		}else{
			$("#check").removeClass("active").attr("src","img/00-xin-s_08-06.png");
			$("#userpass").val("");
		}
		$("#logIn .unamedialog").fadeOut();
	});

	$("#logIn .enterbtns").on("click","ul li",function(){
		if($("#username").val()){
			if(!isNaN($(this).html())){
				$("#userpass").val($("#userpass").val()+$(this).html());
			}else if($(this).hasClass("correct")){
				$("#userpass").val("");
			}
		}
		
	})
	
	
		
//	获取菜品详细内容
	function foodInfo(urlstr){
		$.ajax({
			type:"get",
			url:urlstr,
			dataType:"json",
			async:true,
			success: function(data){
	  			var data=JSON.parse(data).foodinfos;	
				var infofrag1=document.createDocumentFragment();
				var infofrag2=document.createDocumentFragment();
				//菜单列表显示
						$.each(data, function(i,item){
							if(i<Math.ceil(data.length/2)){
								$(infofrag1).append("<li id="+item.ID+" class='lf'><dl><dt><img src='img/01-xin_09.png' alt='' /></dt><dd><p class='foodname'>"+item.FoodName+"</p class='foodprice'><p>￥<span>"+item.Price.toFixed(2)+"</span></p></dd></dl></li>");
							}else{
								$(infofrag2).append("<li id="+item.ID+" class='lf'><dl><dt><img src='img/01-xin_09.png' alt='' /></dt><dd><p class='foodname'>"+item.FoodName+"</p><p class='foodprice'>￥<span>"+item.Price.toFixed(2)+"</span></p></dd></dl></li>");
							}
						});
				$("#dishlist>ul.lineone").css("width",Math.ceil(data.length/2)*188.5+"px");
				$("#dishlist>ul.linetwo").css("width",Math.floor(data.length/2)*188.5+"px");
				$("#dishlist").scrollLeft(0);
				$("#dishlist .lineone").html("").append(infofrag1);
				$("#dishlist .linetwo").html("").append(infofrag2);	
				$("#list-left>div.lists").each(function(i,item){
					var count=$(this).children().children("li.count").html();
					var iD=$(this).attr("id").substring(0,$(this).attr("id").length-1);
					$("#"+iD).addClass("active").append("<p class='selectIcon'>"+count+"</p>");
					console.log(iD);
				});
				$("#loading").hide();
				setTimeout(function(){
					$("#wellcome").hide();
				},500);
  			}

		});


	}
	
	
	//菜品推荐显示
	function recommend(urlstr){
		$.ajax({
			type:"get",
			dataType:"json",
			url:urlstr,
			async:true,
			success:function(data){
				var data=JSON.parse(data).foodinfos;
				var recofrag=document.createDocumentFragment();
				$("#order .dptj ul").css("width",data.length*226+36+"px");
						$.each(data, function(i,item){
								$(recofrag).append("<li id="+item.ID+"l class='lf'><dl><dt><img src='img/01-xin_07.png' alt='' /></dt><dd><span class='lf'>【"+item.FoodName+"】</span><p class='rt'>￥<span>"+item.Price.toFixed(2)+"</span></p></dd></dl></li>");
								
					});
				$("#order .dptj ul").html("").append(recofrag);	
			}
		});
	}
	
//	获取菜品菜单
	function  getFood(){
		$.ajax({
			type:"get",
			dataType:"json",
			url:"http://xjucan.com/api/api/WebDinner/GetMenuInfo?shopid=29",
			async:true,
			success:function(data){
				var data=JSON.parse(data).reverse();
				var menufrag=document.createDocumentFragment();
				$.each(data, function(i,item){
					$(menufrag).append("<li id="+item.ID+" class='rt txtcenter tang'>"+item.FoodName+"</li>");
				});
				$(".menu ul").html("").append(menufrag);
			}
		});
		$(".cdbtn li.active").removeClass("active");
		$(".cdbtn li:first-child").addClass("active");
//		获取菜单列表
		foodInfo("http://xjucan.com/api/api/WebDinner/GetFoodInfo?typeid=68c1767e-fd6d-4cba-919b-095c2d3f4c28&shopid=29");	
//		获取推荐列表
		recommend("http://xjucan.com/api/api/WebDinner/GetFoodInfo?typeid=68c1767e-fd6d-4cba-919b-095c2d3f4c28&shopid=29");
	}
	
	
	//登录页点击登录按钮页面跳转
	$("#loginBtn a").click(function(){
//		从后台获取用户名与密码是否匹配的返回信息
//	var message=$("#myForm").serialize();
//	$.ajax({
//		type:"post",
//		url:"",
//		async:true,
//		data:message
//	});
	var msg="success";
	if(msg=="success"){
		$("#wellcome").show();
		$("#main .main-container").css("left","-100%");
		//		判断用户是否记住密码
		if($("#check").hasClass("active")){
			window.localStorage.setItem($("#username").val(),$("#userpass").val());
		}else if(!($("#check").hasClass("active"))){
			window.localStorage.clear($("#username").val());
		}
		
		$("#username").val("");
		$("#userpass").val("");
		getFood();
	}
	
	});
	
	
	//点击菜单按钮切换菜单内容
	$(".cdbtn").on("click","li",function(){
		if(!($(this).hasClass("active"))){
			$("#loading").show();
			$(".cdbtn li.active").removeClass("active");
			$(this).addClass("active");	
			foodInfo("http://xjucan.com/api/api/WebDinner/GetFoodInfo?typeid=68c1767e-fd6d-4cba-919b-095c2d3f4c28&shopid=29");
		}
	});
	

	
	
	function cartlist(str){
		if(!($(str).hasClass("active"))){
			$(str).addClass("active").append("<p class='selectIcon'>1</p>");
			$("#list-left").append('<div id="'+$(str).attr("id")+'s" class="lists"><ul class="lists-item"><li class="down lf"><img src="img/01-xin-s_72.png" alt="" /></li><li class="lf list-number">'+($("#list-left>div").length+1)+'</li><li class="lf dishname">'+$(str).find("p.foodname").html()+'</li><li class="lf price">'+$(str).find("span").html()+'</li><li class="lf count">'+$(str).children("p").html()+'</li><li class="lf delete"><img src="img/01-xin-s_65.png" alt="" /></li></ul></div>');
			
		}else{
			$(str).children("p").html(parseInt($(str).children("p").html())+1);
			$(str+"s li.count").html($(str).children("p").html());
		}
		totlePrice();
	}
function addCart(me,str,imgSrc,e){
	var imgidx=$("#order>img.u-img").length;
	var toP=710;
		var ht=0;
		$("#list-left>div").each(function(){
			ht+=$(this).height();
		});
		if(ht>=250){
			toP=940;
		}else{
			toP+=ht;
		}
		var hty=0;
		if($(window).width()==1280){
			hty=0;
		}else{
			hty=894;
		}
		$("#order").append("<img class='u-img "+imgidx+"' src='"+imgSrc+"'/>");
			$("#order>img.u-img."+imgidx).css({"left":e.pageX-70+"px","top":e.pageY-hty-53+"px"});
			$("#order>img.u-img."+imgidx).animate({
			"left":"300px",
			"top":toP+"px",
			"width":"50px",
		},800,function(){
			$($("#order>img.u-img")[0]).fadeOut();
			$($("#order>img.u-img")[0]).remove();
			cartlist(str);
			$("#list-left").scrollTop(ht);
		});
		
		$(me).addClass("animated pulse");
		$(me).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(me).removeClass("animated pulse");
		});

}
	//	点击菜品购物车出现相应菜品
	$("#dishlist").on("click","ul li",function(e){
		var str="#"+$(this).attr("id");
		var imgSrc=$(this).children("dl").children("dt").children("img").attr("src");		
		var me=this;
		addCart(me,str,imgSrc,e);
			

	});
//	点击推荐菜品放入购物车
$("#order").on("click",".dptj ul li",function(e){
	var str="#"+$(this).attr("id").substring(0,$(this).attr("id").length-1);
	var imgSrc=$(this).children("dl").children("dt").children("img").attr("src");
	var me=this;
	addCart(me,str,imgSrc,e);
});
//  活动专区
	$("#order .youhui").click(function(){
		$("#yhdialog").show();
		$("#yhdialog .youhuiinner").addClass("animated rollIn");
		$("#yhdialog .youhuiinner").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).removeClass("animated rollIn");
			});
	});
	$("#yhdialog .youhuiinner span").click(function(){
		$("#yhdialog .youhuiinner").addClass("animated rollOut");
		$("#yhdialog").fadeOut(1200);
		$("#yhdialog .youhuiinner").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).removeClass("animated rollOut");
		});
	});
	
//	通过购物车计算总价
	function totlePrice(){
		var totle=0;
		$("#list-left div.lists").each(function(){
			var price=parseFloat($(this).find("li.price").html());
			var count=parseFloat($(this).find("li.count").html());
			totle+=price*count;
			
		});
		$(".cart-price").addClass("active");
		setTimeout(function(){
			$(".cart-price").removeClass("active");
		},1000);
		$(".cart-price>a>span").html("￥"+totle.toFixed(2));
	}
//点击购物车菜品前的下拉按钮弹出备注框
$("#list-left").on("click","div.lists ul.lists-item li.down",function(){
	$(".bzdialog").addClass("animated fadeInRightBig").show();
	$(".bzdialog").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(".bzdialog").removeClass("animated fadeInRightBig");
		});
	var iD=$(this).parent("ul").parent("div").attr("id");
//	点击确定按钮
	$(".bzdialoginner .bzbtn li").click(function(){ 
		if(($(this).hasClass("bzconfirm"))&&$("#bzitem input:checked").length){
			if(!($("#"+iD).children("div.bz").length)){
				$("#"+iD).append("<div class='bz'><p class='lf'><span>备注</span></p><ul class='bzlidt lf'></ul></div>");
				$("#bzitem input:checked").each(function(i,item){
					$("#"+iD+" div.bz ul.bzlidt").append("<li class='lf txtcenter'>"+$(item).parent("label").text().trim()+"</li>")
				});
			}else{
				$("#"+iD+" div.bz ul.bzlidt").html("");
			$("#bzitem input:checked").each(function(i,item){
				$("#"+iD+" div.bz ul.bzlidt").append("<li class='lf txtcenter'>"+$(item).parent("label").text().trim()+"</li>")
			});
			}
		}
			$(".bzdialog").addClass("animated fadeOutLeftBig");
	$(".bzdialog").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(".bzdialog").removeClass("animated fadeOutLeftBig").hide();
		});

	});
});

//点击购物车列表删除按钮删除该菜品
$("#list-left").on("click","div.lists ul.lists-item li.delete",function(){
	var iD=$(this).parent("ul").parent("div.lists").attr("id");
	iD=$(this).parent("ul").parent("div.lists").attr("id").substring(0,iD.length-1);
	$("#"+iD).removeClass("active").children("p").remove();
	$(this).parent("ul").parent("div.lists").remove();
	$("#list-left div.lists ul.lists-item li.list-number").each(function(i,item){
		$(this).html($(this).parent("ul.lists-item").parent("div.lists").index()+1);
	});
	totlePrice();
});

//点击返回或清空按钮清空购物车

function deletedishs(){
	$("#dishlist li.active").removeClass("active").children("p").remove();
	$("#list-left").html("");
	totlePrice();
}

$("#cart-btn ul.rt").on("click","li",function(){
	if($(this).hasClass("fanhui")){
		deletedishs();
		$("#main .main-container").animate({"left":"0"},500);
	}else{
		deletedishs();
	}
	
});
//堂食外带按钮切换
$("#list-right .czimg").on("click","p.change",function(){
	if(!($(this).hasClass("active"))){
		$("#list-right .czimg p.active").removeClass("active");
		$(this).addClass("active");
	}
});

//点击购物车按钮跳转到订单列表页面
$("#cart-btn .cart-price").click(function(e){
	e.preventDefault();
	if(!($(this).children("a").children("span").html()=="￥0.00")){
		$("#main .main-container").animate({"left":"-200%"},500);
	}
	var listfrag=document.createDocumentFragment();
	var ordertotle=0.00;
	$("#list-left div.lists").each(function(){
		var iD=$(this).attr("id");
		iD=iD.substring(0,iD.length-1);
		var img=$("#"+iD+" dl dt img").attr("src");
		var name=$(this).find("li.dishname").html();
		var orderprice=parseFloat($(this).find("li.price").html());
		var ordercount=parseFloat($(this).find("li.count").html());
		ordertotle+=orderprice*ordercount;
		$(listfrag).append('<li><p class="picicon lf"><img src="'+img+'" alt="" /></p><span class="orderCount lf txtcenter">'+ordercount+'</span><span class="orderName lf txtcenter">'+name+'</span><p class="lf txtcenter"><span class="orderPriceicon">￥</span><span class="orderPrice">'+orderprice.toFixed(2)+'</span></p><span class="orderDelete lf txtcenter"><img src="img/01-xin-s_65.png" alt="" /></span></li>');
	});
	$("#myOrder .myOrder-list").append(listfrag);
	$(".priceTotle span.totleNumber").html(ordertotle.toFixed(2));
	
});

//点击我的订单中的删除按钮删除本菜品
$("#myOrder .myOrder-list").on("click","li span.orderDelete",function(){
	$(this).parents("li").remove();
	var ordertotle=0.00;
	$("#myOrder .myOrder-list li").each(function(){
		var price=$(this).find("span.orderPrice").html();
		var count=$(this).find("span.orderCount").html();
		ordertotle+=price*count;
	});
	$(".priceTotle span.totleNumber").html(ordertotle.toFixed(2));
});
//点击确认订单后弹出优惠框
$("#myOrder .confirm-order .confirm-btn").click(function(){
	if($("#myOrder .myOrder-list li").length){
//		如果有优惠进入优惠界面,没有直接进入支付界面
	var youhui=true;
	var totle=$(".priceTotle span.totleNumber").html();
		if(youhui){
			$(".favdialog-inner ul li.ddze p.rt span").html(totle);
			var wnyh=$(".favdialog-inner ul li.wnyh p.rt span").html();
			var gxzf=parseFloat(totle)-parseFloat(wnyh);
			if(gxzf<0){
				gxzf=0;
			}
			$(".favdialog-inner ul li.gxzf p.rt span").html(gxzf.toFixed(2));
			window.sessionStorage.setItem("gxzf",gxzf.toFixed(2));
			$(".favdialog-outer").addClass("animated bounceIn").show();
		}else{
			window.sessionStorage.setItem("gxzf",totle);
			$("#main .main-container").animate({"left":"-300%"},500);
		}
		
	}
});
//优惠信息确定按钮点击跳转
$(".favdialog-inner>p").click(function(){
	$("#main .main-container").animate({"left":"-300%"},500,function(){
		orderWay();
		$(".favdialog-outer").hide();
	});
	
});

//点击取消订单后跳转到点餐页

$("#myOrder .confirm-order .concel-btn").click(function(e){
	if(!($(this).hasClass("active"))&&e.target.nodeName!="SPAN"&&e.target.nodeName!="BUTTON"){
		$(this).addClass("active");
		$("#myOrder .confirm-order .concel-btn>div").show();
	}
});
$("#myOrder .confirm-order .concel-btn>div button").click(function(){	
	$("#myOrder .myOrder-list").html("");
	deletedishs();
	$("#dishlist").scrollLeft(0);
	$(".dptj>.w940>.940").scrollLeft(0)
	getFood();
	$("#main .main-container").animate({"left":"-100%"},500);
	$("#myOrder .confirm-order .concel-btn").removeClass("normal").removeClass("active");
	$("#myOrder .confirm-order .concel-btn>div").hide();
});
$("#myOrder .confirm-order li.concel-btn div.cancel-inner span").click(function(e){
	if($("#myOrder .confirm-order .concel-btn").hasClass("active")){
		$("#myOrder .confirm-order .concel-btn").addClass("normal");
		setTimeout(function(){
			$("#myOrder .confirm-order .concel-btn").removeClass("normal").removeClass("active");
			$("#myOrder .confirm-order .concel-btn>div").hide();
		},1000);
	}
});

function orderWay(){
	console.log("111");
	$("#orderWay ul.payIcons li.hyk").addClass("animated rotateInDownLeft").show();
	$("#orderWay ul.payIcons li.yhk").addClass("animated rotateInDownRight").show();
	$("#orderWay ul.payIcons li.wx").addClass("animated rotateInUpLeft").show();
	$("#orderWay ul.payIcons li.zfb").addClass("animated rotateInUpRight").show();
	$("#orderWay ul.payIcons li").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateInDownLeft");
	});
	$("#orderWay ul.payIcons li.hyk").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateInDownRight");
	});
	$("#orderWay ul.payIcons li.wx").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateInUpLeft");
	});
	$("#orderWay ul.payIcons li.zfb").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateInUpRight");
	});
}

//点击所选择的支付方式
$("#orderWay .payIcons").on("click","li",function(){
	if($(this).hasClass("yhk")){
		$(".payMain .payImg").html("").append("<div class='onorder'><img src='img/06-xin_09.png' alt='' /></div>");
//		添加虚拟按钮
		$("#payPage").append("<div class='w940 dtbtns'><button class='cryhk rt'>已插入银行卡</button></div>");
	}else{
		if($(this).hasClass("wx")){
			$(".payMain .payImg").html("").append("<div class='onorder'><div><img src='img/09-xin_03.png' alt='' /></div><img class='erweima' src='img/erweima.png' alt='' /><img src='img/08-xin_06.png' alt='' /></div>");	
		}else if($(this).hasClass("zfb")){
			$(".payMain .payImg").html("").append("<div class='onorder'><img src='img/08-xin_03.png' alt='' /><img class='erweima' src='img/erweima.png' alt='' /><img src='img/08-xin_06.png' alt='' /></div>");
		}else if($(this).hasClass("hyk")){
			return false;
		}
		//		添加虚拟按钮
		$("#payPage").append("<div class='w940 dtbtns'><button class='zzcl rt'>正在处理</button></div>");
	}
	$("#orderWay ul.payIcons li.hyk").addClass("animated rotateOutUpLeft").show();
	$("#orderWay ul.payIcons li.yhk").addClass("animated rotateOutUpRight").show();
	$("#orderWay ul.payIcons li.wx").addClass("animated rotateOutDownLeft").show();
	$("#orderWay ul.payIcons li.zfb").addClass("animated rotateOutDownRight").show();
	$("#orderWay ul.payIcons li").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateOutUpLeft").hide();
	});
	$("#orderWay ul.payIcons li.hyk").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateOutUpRight").hide();
	});
	$("#orderWay ul.payIcons li.wx").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateOutDownLeft").hide();
	});
	$("#orderWay ul.payIcons li.zfb").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$("#orderWay ul.payIcons li").removeClass("animated rotateOutDownRight").hide();
	});
	$(".payMain .payImg").css("background","none");
	$(".paywarn").css("background","none").html("").append("<div class='paywarnCount'><span class='payNum'>"+window.sessionStorage.getItem("gxzf")+"</span><span>元</span></div><div class='paywarnText'><img src='img/06-xin_03.png' alt='' /></div>");
	$("#main .main-container").animate({"left":"-400%"},500,function(){
		payImgIn();
	});
		
});
function payImgOut(){
	$("#payPage .payMain .payContent .payImg>div").addClass("animated bounceOutUp");
}
function payImgIn(){
	$("#payPage .payMain .payContent .payImg>div").show().addClass("animated bounceInUp");
}
//已插入银行卡虚拟操作
$("#payPage").on("click","button.cryhk",function(){
	payImgOut();
	setTimeout(function(){
		$(".payMain .payImg").html("").append("<div><img src='img/07-xin_03.png' alt='' /></div>");
		payImgIn();
		$("#payPage .dtbtns").remove();
		$("#payPage").append("<div class='w940 dtbtns'><button class='zzcl rt'>正在处理</button></div>");
	},500);
	
});

//正在处理,成功,失败按钮点击
$("#payPage").on("click","button",function(){
	if($(this).hasClass("zfcg")){
		payImgOut();
		setTimeout(function(){
			$(".payMain .payImg").html("").append("<div class='paysolut'><img src='img/10-xin_03.png' alt='' /></div>");
			payImgIn();
			$(".payMain .paywarn").html("").css("background","url('img/10-xin_06.png') no-repeat center center");
			$(".backbtn").show();
		},500);
		
		
	}else if($(this).hasClass("zfsb")){
		payImgOut();
		setTimeout(function(){
			$(".payMain .payImg").html("").append("<div class='paysolut'><img src='img/11-xin_03.png' alt='' /></div>");
			payImgIn();
			$(".payMain .paywarn").html("").css("background","url('img/11-xin_06.png') no-repeat center center");
			$(".backbtn").show();
		},500);
		
		
	}else if($(this).hasClass("zzcl")){
		payImgOut();
		setTimeout(function(){
		$(".backbtn").hide();
		$(".payMain .payImg").html("").append("<div><img src='img/mianbao.gif' alt='' /><img src='img/12-xin-s_07.png' alt='' /></div>");
			payImgIn();
		},500);
		
		$(".payMain .paywarn").html("").css("background","url('img/12-xin_03.png') no-repeat center center");
	$("#payPage .dtbtns").remove();	
	$("#payPage").append("<div class='w940 dtbtns'><button class='zfcg rt'>支付成功</button><button class='zfsb rt'>支付失败</button></div>");	
		
	}
});

//支付页面返回按钮事件
$(".backbtn button").click(function(){
	if($(this).parent().parent().attr("id")=="orderWay"){
		$(".favdialog-outer").hide();
		$("#orderWay ul.payIcons li").fadeOut(1000);
		$("#main .main-container").animate({"left":"-200%"},500);
	}else if($(this).parent().parent().attr("id")=="payPage"){
		if($("#payPage .payImg>div.paysolut").length){
			deletedishs();
			getFood();
			$("#main .main-container").css("left","-100%");
		}else{
			$("#main .main-container").animate({"left":"-300%"},500,function(){
				orderWay();
			});
			
		}
		$("#payPage .dtbtns").remove();
	}
	
	
});


});
 	