<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>知言-知无不言 言无不尽</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="description" content="与世界分享你的心声">

		<link rel="stylesheet" type="text/css" href="style/mainpage.css">
		<link rel="stylesheet" type="text/css" href="style/jquery-ui-1.10.3.custom.css" />

		<script src="script/jquery-2.0.2.js" type="text/javascript"></script>
		<!-- 首先jquery.然后是jquery.validate.js -->
		<script src="script/jquery.validate.js" type="text/javascript"></script>
		
		
		<script type="text/javascript">
		
	$(document).ready(function() {
		   
       $("#registration").click(function(){
	             //利用widow的重定向到登陆页面
	    	      window.location.href="registration.jsp";
        }); 
       
       //一旦获得焦点 立即失去焦点 消除虚线方框
       $("#registration").focus(function(){
            this.blur(function(){
           });
       });


       /*
   	 * 首页单击文本框  改变背景色
   	 * */
   	$(".right input[type='text'],input[type='password']").focus(function(){
   			$(this).css("backgroundColor","#FFFFFF");
   	});
  	$(".right input[type='text'],input[type='password']").blur(function(){
			$(this).css("backgroundColor","#E7F1F8");
	});

       var timer = 0;
       //每个10秒自动获得焦点
       function automove(times){
           times = timer;
           //  trigger() 方法触发被选元素的指定事件类型。
    	   $(".hot-list .rep img:eq("+times+")").trigger("mouseover");
    	   timer++;
    	   //如果到最后 则回到第一个
    	   if(timer ==8){
				timer =0;
           }
    	  // $(".hot-list .rep img:eq("+times+")").trigger("mouseout");
       }
       //定时器id
       var timerid = 0;
       var loop =0;
       function startTimer(){
    	  id =setInterval(function(){
  			automove(timer);
          },1000*10);
    	  //将最新的id 赋给timerid;
    	  timerid = id;
       }
      
       //图片获得焦点的时候 消除边框的白色
       $(".hot-list .rep img").mouseover(function(){
              //改变样式
              $(this).css("border","none");
              $(this).css("height","65px");
              $(this).css("width","65px");
              //右边的动态显示头像以及相关的信息
              //小箭头滑动 $(this).position().top  直接取出top不行 回来再研究
           	//Get the current coordinates of the first element in the set of matched elements,
           		//  relative to the offset parent.   
              $(".single-list .icon-sign-spike").css("top",$(this).position().top+32.5);
              //头像更改
              $(".single-list img").attr("src",$(this).attr("src"));
              //相关信息
              
        });
       $(".hot-list .rep img").mouseout(function(){
           $(this).css("border","7px solid #FFFFFF");
           $(this).css("height","50px");
           $(this).css("width","50px");
      });

       //single-list content  a hover 显示下划线
       $(".single-list a").mouseover(function(){
				$(this).css("text-decoration","underline");
         });

       $(".single-list a").mouseout(function(){
			$(this).css("text-decoration","none");
        });



       //输入用户名和密码的文本框 获得焦点之后 warning置为空
       $("#username, #password").focus(function(){
    	      $("#warning").html("");
        });
		$("#myForm").validate( {
			rules : {
				username : {
					required : true,
					minlength : 3
				},
				password : {
					required : true,
				}
			},
			messages : {
				username : {
					required : "用户名不能为空",
					minlength : "用户名长度不小于3位"
				},
				password : {
					required : "密码不能为空",
				}
			},
			errorElement : "label",
			submitHandler:function(form){
                 //Validation插件 表单验证通过后会自动提交
                 //可以在這裡改成用$.ajax()送出。
                //$.post(url,data,successCallback);
               // return false; //回傳false會阻止原本的form submit。
                $.post("/LogValidationAction",
                        { username:$("#username").val(),
                         password:$("#password").val()},
                         function(data,statusText){
                              //reponseText返回的有空格
                               var result =;
                               if  ($.trim(data) == "成功匹配") {
                                          $("#myForm").attr("action","/feeds");
                                          document.getElementById("myForm").submit();
                               } else {
                                         $("#warning").html(data);
                               }
                         }
                );  
		    }
		});  	
	});
	
</script>

	</head>
	<body>
		<div class="top">
			<div class="left">
				<!--  
				<h1>
					知言
				</h1>
				<img alt="share" src="images/myspace.png" />
			-->
				<img alt="share" src="images/logo.png" />
			</div>
			<div class="right">
				<form id="myForm" method="POST">
					<table>
						<tr>
							<td colspan="2" align="left" style="height: 50px">
								<input type="text" placeholder="邮箱" id="username"
									name="username" size="22px" style="height: 80%" />
							</td>
						</tr>
						<tr>
							<td colspan="2" align="left" style="height: 50px">
								<input type="password" placeholder="密码" id="password"
									name="password" size="22px" style="height: 80%" />
							</td>
						</tr>

						<tr>
							<td colspan="2" height="20px">
								<label id="warning"></label>
							</td>
						</tr>

						<tr>
							<td width="100" align="left" style="height: 50px;">
								<input id="login" type="submit" style="margin-left: 28px;"
									value="登陆">
							</td>
							<td width="150" align="left">
								<input id="registration" type="button" value="注册" style="">
							</td>
						</tr>
					</table>
				</form>
			</div>

		</div>
		<div class="bottom">
			<!-- 显示hot-list的div -->
			<div class="hot-list">
				<!-- 循环遍历生成的 -->
				<a class="rep" href=""> <span class="list-card">房地产</span> <img
						src="images/dingxiang.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Jacoffee,Persistence
						is victory</span> <img src="images/design.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/real_state.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/hi-id.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/nba.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/jiawei.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/marketing.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/maggie.jpg" /> </a>
				<a class="rep" href=""> <span class="list-card">Forever
						Young</span> <img src="images/jiaohu.jpg" /> </a>
			</div>
			<!-- 单个列表框 -->
			<div class="single-list">
				<i class="icon-sign-spike"></i>
				<div class="single-list-inner">
					<img alt="头像" src="images/maggie.jpg" />
					<div class="list-title">
						<div>
							<a class="name" target="_blank" href="/people/daguo">大果</a>
							<span>大爱音乐</span>
						</div>
						<div>
							在知乎回答了 575 个问题，39093 人关注他。
						</div>
					</div>
					<div class="sep"></div>
					<div class="list-content">
						<div class="list-content-answer">
							<span class="vote">100</span>
							<p>
								<a class="question_link"
									href="/question/21259831#answer-2268313" target="_blank">如何评价电影《小时代》？</a>
							</p>
						</div>
						<div class="list-content-answer">
							<span class="vote">100</span>
							<p>
								<a class="question_link"
									href="/question/21259831#answer-2268313" target="_blank">如何评价电影《小时代》？</a>
							</p>
						</div>
						<div class="list-content-answer">
							<span class="vote">100</span>
							<p>
								<a class="question_link"
									href="/question/21259831#answer-2268313" target="_blank">
									如何评价电影《小时代》？如何评价电影《小时代》？如何评价电影《小时代》？ </a>
							</p>
						</div>
					</div>
					<div class="sep"></div>
					<div class="list-content-end">
						周梦林在
						<a href="" target="_blank">NBA</a> 、
						<a href="" target="_blank">设计</a> 等话题下获得了3000个赞同
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
