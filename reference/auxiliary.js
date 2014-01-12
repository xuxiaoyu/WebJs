/*
 * 主要一些辅助性的操作 滚到顶部
 */

$(function() {
	
	/*
	 * 单击私信按钮出现私信对话框
	 */
	
	 $("#inbox").click(function(){
		   // 背景阴影出现
			$("#zy-inbox").css("display", "block");
			$("#fade").css("display", "block");
			
			// 清空里面的内容
			$(".zy-form-input").val("");
			$(".send-content").val("");
	 });
	 
	 /* 单击取消 */
	 $("#inbox-cancel").click(function(){
		 	$("#zy-inbox").css("display", "none");
			$("#fade").css("display", "none");
	 });
	 
	   /*
		* 单击消息按钮出现消息对话框 单击tab 可以切换
		*/
	   $("#notice").click(function(){
		   $(".zy-tip-container").toggle();
	   });
	   
	   /* 点击问题回复 显示哪些人回复了问题 */
	   $(".zy-tip-container").on("click",".z-icon-question",function(){
		         $(".zy-tip-container-question-item-wrap").show();
		         $(".zy-tip-container-inbox-item-wrap").hide();
		   
	   });
	   
	   //拼接 私信列表
	   function getMaiList(userid,username,number){
		   var mailist = $("<div class='zy-tip-container-inbox-item'>"+
			"<span class='author-list'>"+
			"<a class='zy-link' title="+username+" href=people?userid="+userid+">"
			+username+"</a> 给你发送了"+
		    "<a class='inbox-link' href=notice?senderId="+userid+"> "+number+"</a> 条私信" +
		    "</span></div>");  
		   return mailist;
	   }
	   
	   /* 单击关注和私信 显示哪些人关注了你*/
	   $(".zy-tip-container").on("click",".z-icon-follower",function(){
		   	 $(".zy-tip-container-question-item-wrap").hide();
	         $(".zy-tip-container-inbox-item-wrap").show();
	         //异步发送请求
	         $.post("receiveMail",{
	         },function(data,status){
	        	 $(".zy-tip-container-inbox-item-wrap .zy-tip-container-inbox-item").remove();
		         for(var i=0; i<data.length; i++){
		        	var mailist = getMaiList(data[i].userId,data[i].username,data[i].total);
		            $(".zy-tip-container-inbox-item-wrap").append(mailist);
		         }
	         });
	   });
	   
	 
	  /*
	   * 鼠标滑过头像出现tooltip 将用户的信息读出来
	   * 同时要判断当前用户是否关注  此用户
	   */ 
	   var username = null;
	   var userid = null;
	   $("body").on("mouseover","#smug",function(e){
		    	  //获取此用户的 id、用户名、头像、签名
		   		  userid =  $(this).next("#img_user").val();
		          username = $.trim($(this).closest("#pic").next("#user_info").find("a").html());
		          var sig =  $.trim($(this).closest("#pic").next("#user_info").find("strong").html());
		          var imgpath= $(this).attr("src");
		          
		          // 如果是自己 则隐藏加私信和 取消关注
		          if(username ==$.trim($("#info_username").html())  ) {
		        	  $(".zy-tooltip-command").hide();
		          }else{
		        	  $(".zy-tooltip-command").show();
		          }
		          //获取鼠标 hover的位置以便在 合适的地方显示出 tooltip
		          var x =e.pageX;
		          var y =e.pageY;
		          // 根据登陆者的ID 和 此用户的ID来构建tooltip
		          // 主要用于获取 此用户的回答问题数、关注好友数以及 与当前用户的关系
                $.post("friend",{
		        	  // 登陆者ID
		        	  userid:$("#currentUser").val(),
		        	  //此用户的ID
		        	  friendId:userid
		          },function(data,status){
		        	  $(".zu-button-more").hide();
                        // alert(data.followNum);
                          // alert(data.isFollowed);
		        	      // tooltip的头像
		        	   $(".zy-tooltip-content  .zy-list-avatar-medium").attr("src",imgpath);
		        	   // tooltip的姓名以及id
		        	   $(".zy-tooltip-content  .zy-tooltip-head-wrap a").html(username);
		        	   $(".zy-tooltip-content .zy-tooltip-head-wrap a").attr("href","people?id="+userid);
		        	   // tooltip的sig
		        	   $(".zy-tooltip-content .zy-tooltip-head-wrap").next("div").html(sig);
		        	   
		        	   // tooltip的 关注数 和 回答问题数
		        	   if( data.isFollowed != -1){
		        		   $(".zy-tooltip-content .zy-tooltip-head-wrap strong:eq(1)").html(data.followNum);
		        		   if(data.isFollowed == 0){
		        			   // 表示登陆者未关注此用户
		        			   $(".zy-tooltip-command  #unfollow-user").show();
		        			   $(".zy-tooltip-command  #follow-user").hide();
		        		   }else{
		        			   // 表示登陆者关注了此用户
		        			   $(".zy-tooltip-command  #follow-user").show();
		        			   $(".zy-tooltip-command  #unfollow-user").hide();
		        		   }
		        	   }
		          });  
		          $(".zy-tooltip-people").show();
		          $(".zy-tooltip-people").css("top",y);
		          $(".zy-tooltip-people").css("left",x);
	   });
	   
		   /*
			 * 如果tooltip mouseout的话在删除
			 */
	   $(".zy-tooltip-people").mouseleave(function(){
		      $(this).hide();
	   })
		   
	  /*
		 * 单击tooltip中的 私信按钮 弹出私信对话框 tooltip将名字 读到私信框的 名字 地方
		 */ 
	    $(".mail").click(function(){
	    		$(".zy-tooltip-people").hide();
	    		$("#zy-inbox").show();
	    		/*
				 * 名字读到上面 <input type="text" placeholder="搜索用户"
				 * class="zy-form-input" id="username" name="username"/> <input
				 * type="hidden" id="hiddenUserId" />
				 * 
				 */
	    		// 收件人的名称
	    		$(".zy-form-input").val(username);
	    		// 收件人的Id
	    		$("#hiddenUserId").val(userid);
	    });
	   
	   // 单击私信箱发送之后 要验证是否为空
	   $("#send-message").click(function(){
		   if($(".zy-form-input").val().length == 0){
		    	 $(".zy-form-input").val("您要发给谁呢？");
		   }
		   if($(".send-content").val().length == 0 ){
		    	 $(".send-content").val("内容也太短了！！");
		   }else{
			   	 // 发送私信
			   $.post("sendMail",{
				     "senderId":$("#currentUser").val(),
					 "receiverId":$("#hiddenUserId").val(),	
					  "content":$(".send-content").val(),	
					  "sendTime":getDate()
			   },function(data,status){
				   // 清空内容 隐藏私信框
				   $(".send-content").val("");
				   $(".zy-form-input").val("");
				   $("#zy-inbox").hide();
			   });
		   }
	   });
	   
  
	    /*
		 * 对他人的关注或是取消关注 由于tooltip的数据 会异步加载 所以要使用 delegate机制
		 * 
		 */
	   // 关注操作 出现取消关注的按钮
	   $("body").on("click","#unfollow-user",function(){
		   var that=$(this);
		    // 取消关注的数据库 操作
		    $.post("relation",{
		    	   // 主动关注用户的ID
		       "userid":$("#currentUser").val(),
		       // Tooltip中可以获得
		 	   "friendId":userid,
		 	   "followTime":getDate()
		    },function(data,status){
		    	that.prev("#follow-user").show();
		    	that.hide();
		    });
	   });
	   
	   // 取消关注操作 出现关注的按钮
	   $("body").on("click","#follow-user",function(){
		    var that=$(this);
		    // 关注的 数据操作
		    alert("inoinioniu");
		    $.post("relation",{
		    	   // 主动关注用户的ID
		       "userid":$("#currentUser").val(),
		       // Tooltip中可以获得
		 	   "friendId":userid,
		 	   "followTime":null
		    },function(data,status){
		    	that.next("#unfollow-user").show();
		    	that.hide();
		    });
		   
	   });

	   
	   
	/*
	 * 回滚到顶部
	 */
	 // 如果鼠标滚动的距离 顶部大于 400px 则显示回到顶部的图标
	// 滚动一下 出现回到顶部的图标
    $(document).scroll(function() {
		if ($(document).scrollTop() > 400) {
			$("#backtotop").css("display", "block");
		} else {
			$("#backtotop").css("display", "none");
		}
	});
	 // 500毫秒的速度滚上去
	  $("#backtotop").click(function() {
 		    // $(document)是不支持的
			$("html,body").animate( {scrollTop : 0}, 500);
	  });

	// 顶部 --- 点击知言logo 刷新页面
	$("#logo").click(function() {
		// 发送请求到getAllMessage action
			// 但是User确获取不到了 所以还是要 使用Session存储相关的登陆信息
			window.location.href = "feeds";
    });

	
	// 单击私信 话题等li 背景颜色改变
	// 单击话题
	$("#topic").click(function(){
		  $(this).find("a").toggleClass("click-bg");
	 });
	
	// 假如点击了私信的取消按钮或者是提交了则要 取消背景色
	$("#send-message,#inbox-cancel").click(function(){
		   var that = $("#searchbox ul a:eq(1)");
		   /* 默认就是inherit */
		   $("#searchbox ul a").css("backgroundColor","inherit");
	});
	
	// 点击消息框再点一下 就消失 toggleClass
	$("#notice").click(function(){
		  $(this).find("a").toggleClass("click-bg");
	});
	
	
	$.widget("custom.topiccomplete", $.ui.autocomplete, {
		// 生成 结果集菜单 item的就是数据源传过来的
		_renderMenu : function(div, items) {
			// this指定的是 _renderMenu
			var that = this, currentCategory = "";
			$.each(items, function(index, item) {
				// 如果取出的类别和当前的类别 不一样的话 就新建一个类别
					if (item.category != currentCategory) {
						div.append("<div class='ui-autocomplete-category'>"
								+ item.category + "</div>");
						currentCategory = item.category;
					}
					that._renderItemData(div, item.label + "  "
							+ "<span class='totalReply'>" + item.total
							+ "个回答</span>");
				});
		},
		// 生成结果集的数据
		_renderItemData : function(ul, item) {
			return this._renderItem(ul, item)
					.data("ui-autocomplete-item", item);
		},
		_renderItem : function(ul, item) {
			return $("<div>").append($("<a>").append(item)).appendTo(ul);
		}
	});
	// 这种是默认的写法 针对默认的进行优化
	$("#q").topiccomplete( {
		// source的第三种用法 是使用一个函数 传入
		source : function(request, response) {
			$.getJSON("search", {
				search : encodeURIComponent($("#q").val())
			}, response);
		},
		focus : function() {
			// 默认的操作 使用选中的Item的值 替换输入框中的值（只能通过键盘上下键来触发 鼠标滚动不行）
			// 设为false的话 输入框中的值不能在更新了 但是不能阻止 列表获得焦点
		return true;
	},
	select : function(event, ui) {
		// $("#test").submit();
		alert(event.currentTarget);
		// 选择之后使用参数
		// $("#test").submit();
		alert(ui.item.value);
		return false;
	},
	minLength : 1,
	delay : 500
	});
	
	//实现多个话题的添加
	$.widget("custom.autoAddTopic", $.ui.autocomplete, {
		// 生成 结果集菜单 item的就是数据源传过来的
		_renderMenu : function(div, items) {
			// this指定的是 _renderMenu
			var that = this;
			$.each(items, function(index, item) {
				//	that._renderItemData(div, item.topicName);
				that._renderItemData(div,"<input type='hidden' id='hiddenTopicId'  value="+item.topicId+" />"+ 
						item.topicName);
				// "<input type='hidden' id='hiddenTopicId'  value="+item.topicId+" />"+
			});
		},
		// 生成ItemData 的数据
		_renderItemData : function(ul, item) {
			return this._renderItem(ul, item).data("ui-autocomplete-item", item);
		},
		//生成 Item
		_renderItem : function(ul, item) {
			return $("<div>").append($("<a>").append(item)).appendTo(ul);
		}
	 });
	
	// 话题的 AutoComplete

	 //topicid的集合
	var topicIds =   new Array() ; 
	$(".topic-selected").autoAddTopic(// source的第三种用法 是使用一个函数 传入
			{
			source : function(request, response) {
				$.getJSON("autopic", {
					topicName : encodeURIComponent( extractLast(  $(".topic-selected").val()  ) )
				}, response);
			},
			focus : function() {
					 // 默认的操作 使用选中的Item的值 替换输入框中的值（只能通过键盘上下键来触发 鼠标滚动不行）
					// 设为true的话 输入框中的值不能在更新了 但是不能阻止 列表获得焦点
					return false;
			 },
		    //单击Item之后 操作
			select : function(event, ui) {
				 // this.value  代表输入的值
				 //split在第一个没有效果 只是为了获得terms
				 var terms = split( this.value );

				 //删除最后一次输入的内容  不是单击item显示的
				 terms.pop();
				 // 相当于add 元素
				 //进行处理
				  var  pos = ui.item.lastIndexOf(">");
				  terms.push( ui.item.substring(pos+1) );
				  topicIds.push(  $("#hiddenTopicId").val());
				  // add placeholder to get the comma-and-space at the end
				 //凑个数 至少两个才能join嘛
			     terms.push("");
			     //join是把数组中的元素 以,分割 放在字符串中
			     //ui.item, ""
				 this.value = terms.join(",");
                 				 
				 return false;
				 //	alert($("#hiddenTopicId").val());
			
		//		alert($("#hiddenTopicId").val());
		//		return false;
			},
			//最短的相应字符 也就是说至少输入一个字符以显示系统中的话题
			minLength : 1,
			delay : 500
	});
	
	

	 // 单击提问按钮 弹出留言的对话框 并且出现遮幕层
	   $("#question").click(function() {
			$("#question-box").css("display", "block");
			$("#fade").css("display", "block");
			// 默认的标题 和 主要内容都是空的
			$("#header").val("");
			$("#main_body").text("");
	   	});
	   
	   // 单击取消的话 遮罩层消失
		$("#question-cancel").click(function() {
					$("#question-box").css("display", "none");
					$("#fade").css("display", "none");
		});
	
	// 新添一条留言
	  // 新增一条记录
	$("#writeNote").click(function() {
		// 注意val()的使用类型 因为span可能不适合这类型
			$.post("addMsg", {
				userName:$.trim($("#info_username").html()),
               // 获取留言标题
				msgTitle:$.trim($("#header").val()),
				// 获取当前日期
				msgTime:getDate(),
				// 注意去掉首尾的内容 div中的内容用 text获得
				msgContent:$.trim($("#main_body").text()),
			}, function(returnedData, statusText) {
				var result = $.trim(returnedData);
				if (result == "") {
					// 遮罩层消失
					$("#light").css("display", "none");
					$("#fade").css("display", "none");
					// 更新的提示出现后立即消失
					$("#success-update").css("display", "block");
					$("#success-update").text("新增留言");
					// 动画效果为先上收拢 自动消失 渐变
					$("#success-update").fadeOut(2000);
				}
			});
		});
});



//按照 ,+空格多个的形式  拆分字符串
function split( val ) {
	return val.split( /,\s*/ );
}

//  NBA, 罗
//  split( term )  NBA 罗  pop() 取得最后一项
function extractLast( term ) {
	return split( term ).pop();
}

// 所有时间的插入
function getDate() {
	var date = new Date();
	var notedate = null;
	// 如果是1-10月的话 就要添加前面的0
	var month = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1))
			: (date.getMonth() + 1);
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hour = date.getHours() < 10 ? "0" + date.getHours() : date
			.getHours();
	var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date
			.getMinutes();
	var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date
			.getSeconds();
	notedate = (date.getYear() + 1900) + "-" + month + "-" + day + " "
			+ hour + ":" + minute + ":" + second;
	return notedate;
}

/*
 * 对从数据库中取出的图片路径 进行处理
 */
function splitPath(imgpath) {
	return imgpath.substring(imgpath.lastIndexOf("images"));
}


/*

<ul id="ui-id-1" class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all" 
           tabindex="0" style="display: none; width: 450.167px; top: 317.667px; left: 418.917px;">
			<div class="ui-menu-item" role="presentation">
				<a id="ui-id-2" class="ui-corner-all" tabindex="-1">
					<input id="hiddenTopicId" type="hidden" value="2">
					NBA
				</a>
		</div>
</ul>
	
	Cross-ref  JS split
	
	"2:3:4:5".split(":")	//将返回["2", "3", "4", "5"]
	 function split( val ) {
		return val.split( /,\s );

按照 ， \s 

\s 匹配的是空格符,制表符和其它空白符

			push()方法可以接收任意数量的参数，把它们逐个添加到数组的末尾，并返回修改后的数组长度。
			而pop()方法则从数组末尾移除最后一项，减少数组的length值，然后返回移除的项。
			
			var colors = new Array();                 //创建一个数组
			var count = colors.push("red", "green");  //推入两项
			alert(count);                             //2
			
			count = colors.push("black");             //推入另一项
			alert(count);                             //3
			
			var item = colors.pop();                  //取得最后一项
			alert(item);                              //black
			alert(colors.length);                     //2

          join() 方法用于把数组中的所有元素放入一个字符串。
          	var colors = new Array();                 //创建一个数组
	var count = colors.push("red", "green"); 
	alert(count);
	var t =colors.join(",");
	alert(t);

*/
	