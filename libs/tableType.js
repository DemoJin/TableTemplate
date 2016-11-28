/****************************************
 * 										*
 *                                      *
 *              tableType.js            *
 *                                      *
 *                                      *
 * **************************************/
if(typeof tableType=="undefined" || !tableType){
	var tableType = {};
};
(function(){
	tableType = function(options){
		this.options = {
		    parent : $('#id'),
			urlStart:'',
			url : '',
			dropUrl : '',
			async : true,
			requestData : {},
			requestChartData : {},
			downLoadStr : '',
			thead : [],
			hiddenName : '',
			linkName : '',
			operationBtn : ''
		};
		$.extend(this.options, options);
		this.options.parent = $(options.parent);
		this.options.parentStr = options.parent;
		this._init();
	};
	tableType.prototype = {
		_init : function(){
			var _this = this,
				tableType = _this.options.parent;
	
			_this.sendAjax(function(){
				tableType.append('<div class="loading"></div>');
			},function(datas){
				tableType.find('.loading').remove();
				var sData = datas.data.datas;

			    _this.creatTable(sData,_this.options.parent);

			    _this.creatThead(_this.options.parent,_this.options.thead);

			    var pageHtml = '<div class="paper">'
					        +'<div class="paper_num">总计<em></em>条</div>'
					        +'<div class="paper_select">'
					        +    '每页显示'
					        +    '<ul>'
					        +        '<span class="paper_val">20</span>'
					        +       '<li value="20">20</li>'
					        +        '<li value="50">50</li>'
					        +        '<li value="100">100</li>'
					        +    '</ul>'
					        +'</div>'
					        +'<div id="kkpager"></div>'
					    '</div>';
			    
					    _this.options.parent.addClass('tableType').after(pageHtml).prepend('<caption class="table_title">明细表<button class="export_card_btn">导出</button></caption>');

			    _this.getPage(datas.data.pageSize,datas.data.totalPage,datas.data.currPage);
			    _this.pageSelect(20);
			    $('.paper_num em').html(datas.data.currPage);

			    if (_this.options.hiddenName) _this.hiddenEle();
			    if (_this.options.linkName) _this.linkEle(tableType);
			    if (_this.options.operationBtn) _this.operationBtn();

			    _this.exportData();
			});
		},
		sendAjax : function(beforeSend,fn){
			var _this = this,
				tableType = _this.options.parent;
			$.ajax({
				url : _this.options.urlStart+_this.options.url,
				data : _this.options.requestData,
				type : "POST",
				async : _this.options.async,
				beforeSend:beforeSend,
				success : fn,
				error:function(){
					console.log('明细表数据加载有误！');
				},
				complete : function(){
					tableType.find('tbody').fadeIn(1000);
					tableType.scrollTop(tableType);
					_this.resizeOuterIframe();
				}
			});
		},
		getTableData : function(){
			var _this = this;
			_this.sendAjax(function(){
				tableType.empty().append('<div class="loading"></div>');
			},function(datas){
				tableType.find('.loading').remove();
				var sData = datas.data.datas;

			    _this.creatTable(sData,_this.options.parent);

			    _this.creatThead(_this.options.parent,_this.options.thead);
			    
			    _this.getPage(datas.data.pageSize,datas.data.totalPage,datas.data.currPage);
			    _this.pageSelect(20);
			    $('.paper_num em').html(datas.data.currPage);
			    if (_this.options.hiddenName) _this.hiddenEle();
			    if (_this.options.linkName) _this.linkEle(tableType);
			    if (_this.options.operationBtn) _this.operationBtn();
			});
		},
		getPage : function(pno,totalPage,totalRecords){
			var _this = this;
			kkpager.generPageHtml({
				pno : pno,
				//总页码
				total : totalPage,
				//总数据条数
				totalRecords : totalRecords,
				mode : 'click',
				click : function(n){

					_this.sendPage(n);

					this.selectPage(n);
					return false;
				},
				lang : {
					prePageText: '<',
					nextPageText: '>',
					gopageButtonOkText: '跳转'
				}
			},true);
			_this.resizeOuterIframe();

		},
		sendPage : function(n){
			var _this = this,
				tableType = _this.options.parent;
			_this.options.requestData.pageSize = n;	

			_this.sendAjax(function(){
				tableType.find('tbody').fadeOut(100).empty().append('<div class="loading"></div>');
			},function(datas){
				tableType.find('.loading').remove();
				var sData = datas.data.datas;

			    _this.creatTable(sData,_this.options.parent);

			    _this.creatThead(_this.options.parent,_this.options.thead);
			    
			    _this.getPage(n,datas.data.totalPage,datas.data.currPage);

			    if (_this.options.hiddenName) _this.hiddenEle();
			    if (_this.options.linkName) _this.linkEle(tableType);
			    // if (_this.options.operationBtn) _this.operationBtn();
			});
		},
		pageSelect(num) {
			var _this = this,
				tableType = _this.options.parent;
			var pageSel = $('.paper_select'),
			  	pageLi = pageSel.find('li'),
			  	pageSpan = pageLi.siblings('span');
			$(document).click(function(){
			    pageLi.css({'display':'none'});
			});
			pageSel.click(function(e) {
			   e.stopPropagation();
			   pageLi.slideDown();
			});
			pageLi.click(function(e) {
			   e.stopPropagation();
			   var num = $(this).val();
			   pageLi.slideUp(300);
			   pageSpan.text(num);
			   _this.options.requestData.pageSize = 1;	
			   _this.options.requestData.totalSize = num;	

			   _this.sendAjax(function(){
			   	tableType.find('tbody').hide().empty().append('<div class="loading"></div>');
			   },function(datas){
			   		tableType.find('.loading').remove();
			   		var sData = datas.data.datas;

			   	    _this.creatTable(sData,_this.options.parent);

			   	    _this.creatThead(_this.options.parent,_this.options.thead);
			   	    
			   	    _this.getPage(1,datas.data.totalPage,datas.data.currPage);
			   	    if (_this.options.hiddenName) _this.hiddenEle();
			   	    if (_this.options.linkName) _this.linkEle(tableType);
			   	    if (_this.options.operationBtn) _this.operationBtn();
			   });

			});
		},
		creatTable:function(datas,tableType,isDrop){
			var tbodyHtml = '';
			var _this = this,
			    colModel = isDrop?_this.options.dropColModel:_this.options.colModel;

			for (var j = 0; j < datas.length; j ++)　{
				var trHtml = '';
				for (var i = 0; i < colModel.length; i++) {
        		
        		   var name = colModel[i]['name'],
        		   	   hide = colModel[i]['hide'];
        		
        			trHtml += '<td data-value="' + name + '"' + (hide? 'hidden':'') +'>' + datas[j][name] + '</td>';
        		}
        		trHtml = isDrop||!_this.options.operationBtn? trHtml:(trHtml +'<td><a class="operation_btn" href="javascript:void(0)"></a></td>');
        		// trHtml = isDrop||!_this.options.operationBtn? trHtml:(trHtml +'<td><a class="operation_btn" href="javascript:void(0)"></a></td>');

        		tbodyHtml += '<tr>' + trHtml + '</tr>';
			}				   	

        	isDrop?(tableType.append(tbodyHtml).wrap('<div></div>').parent().addClass('dropTable').parents('tr').prev().addClass('bg_active')):tableType.fadeIn(200).append(tbodyHtml);

		},
		creatThead : function(tableType,thead,isDrop){
			var _this = this,
				theadHtml=[];
			$.each( thead,function(i,data){
				var hide = data.hide,
					theadTitle = !data.title?'':('<i title="'+data.title+'">?</i>');
				theadHtml.push('<th '+(hide? 'hidden':'')+'>' + data.value + theadTitle + '</th>');
			});

			theadHtml=isDrop||!_this.options.operationBtn?theadHtml:(theadHtml+'<th>操作</th>');
			tableType.prepend('<tr>' + theadHtml + '</tr>');
		},

		hiddenEle : function(){
			var _this = this;
			setTimeout(function(){
				$.each(_this.options.hiddenName,function(i){
					var hiddenCurrentName = _this.options.hiddenName[i];

					$(_this.options.parentStr + ' td[data-value="' + hiddenCurrentName + '"]').hide();
				});
				
			},200);
		},
		linkEle : function(){
			var _this = this;
			setTimeout(function(){
				$.each(_this.options.parent.find('td'),function(i,d){
					if ($(d).attr('data-value')==_this.options.linkName) {
						$(d).addClass('underline');
					}
				});

				_this.options.parent.find('td[data-value="'+_this.options.linkName+'"]').click(function(){			
					_this.resizeOuterIframe();
		
					if(!$(this).hasClass('dropShow')){
						var currentTd = $(this).parents('tr').find('[data-value="id"]').html();
						// var currentTd = $(this).html();
						var tdTength = $(this).parent('tr').find('td').length;						$(this).addClass('dropShow').parent('tr').after('<tr><td colspan="'+tdTength+'"><table id="'+currentTd+'"></table><span class="closeTd">X</span></td></tr>');
						_this.dropTable(currentTd);
					}else{
						return;
					}
				});
				_this.closeTd();
				
			},200);
		},
		dropTable: function(currentTd){
			var isDrop = true;
			var _this = this;
			$.ajax({
				url : _this.options.dropUrl,
				data : _this.options.requestDropData,
				type : "POST",
				async : _this.options.async,
				beforeSend:function(){
					// tableType.append('<div class="loading"></div>');
				},
				success : function(datas) {
					// tableType.find('.loading').remove();
					var sData = datas.data.datas;
					console.log(currentTd);
				    _this.creatTable(sData,$('#'+currentTd+''),isDrop);
				    _this.creatThead($('#'+currentTd+''),_this.options.dorpThead,isDrop);
			                  
				},
				complete: function (){
					_this.resizeOuterIframe();
				}
			});
		},
		closeTd : function(){
			var _this = this;
			_this.options.parent.delegate('.closeTd','click',function(){
				$(this).parents('tr').prev('tr').removeClass('bg_active').find('td,a').removeClass('dropShow').end().end().remove();
				_this.resizeOuterIframe();
			});
		},
		operationBtn : function(){
			var _this = this;
			_this.options.parent.delegate('.operation_btn','click',function(){
				var currentId=$(this).parents('tr').find('[data-value=id]').text();
				$(this).parents('tr').addClass('bg_active');
				_this.resizeOuterIframe();

				// if(!_this.options.parent.find('td').hasClass('dropShow')){
				if(!$(this).hasClass('dropShow')&&!$(this).parents('tr').find('td').hasClass('dropShow')){
					var tdTength = $(this).parents('tr').find('td').length;
					var timebar = _this.options.timebar?'<div class="table_timebar"><em name="day" class="active">日</em><em name="week">周</em><em name="mouth">月</em></div>':'';
					$(this).addClass('dropShow').parents('tr').after('<tr><td colspan="'+tdTength+'"><div class="dropChart" id="'+currentId+'"></div><span class="closeTd">X</span>'+timebar+'<button class="export_card_btn">导出</button></td></tr>');
					_this.creatChart(currentId);
					_this.exportData(currentId);
				}else{
					return;
				};
				// $(this).parents('tr').prev('tr').find('td').removeClass('dropShow').end().end().remove();

			});
			_this.closeTd();
			// _this.options.timebar?_this.timebar():'';
		},
		creatChart : function(id){
			var _this = this;
				var myChart = echarts.init(document.getElementById(''+id+''));
				 _this.setChart(myChart);
				_this.options.timebar? _this.timebar(myChart,id):_this.setChart(myChart);

		},
		timebar : function(myChart,id){
			var _this = this;
			
			_this.options.parent.delegate('.table_timebar em','click',function(){
			// _this.options.parent.on('click','.table_timebar em',function(){
				var chartId = $(this).parents('td').find('.dropChart').attr('id');
				// if (new Date().getTime() - _this.timeStr < 300) {
				// 	return;
				// } else {
				// 	_this.timeStr = new Date().getTime();
				// }
				var timeCur = $(this).attr('name');
				$(this).addClass('active').siblings().removeClass('active');
				_this.options.requestChartData.timebar=timeCur;
				_this.setChart(echarts.init(document.getElementById(''+chartId+'')));
			});

			// $('#'+id+'').next().find('[name="week"]').trigger('click');
		},
		setChart : function(chart){
			var _this = this;

			var option = {
			  tooltip: {
			    // trigger: 'axis',
			    trigger: 'axis',
			    x:'left',
			    padding:2
			  },
			  legend: {
			    data: [],
			    x:'center',
			    top: '2%'
			  },
			  dataZoom: [
			      {
			        show: true,
			        height:16
			      }
			  ],
			  grid: {
			    left: '3%',
			    right: '3%',
			    bottom: '12%',
			    top:'10%',
			    containLabel: true
			  },
			  xAxis: [
			    {
			      type: 'category',
			      boundaryGap: false,
			      axisLabel :{  
			          // interval:0   
			      },  
			      data: []
			    }
			  ],
			  yAxis: [
			    {
			      type: 'value'
			    }
			  ],
			  series: []
			};	

			$.ajax({
				url : _this.options.chartUrl,
				data : _this.options.requestChartData,
				type : "POST",
				async : _this.options.async,
				beforeSend:function(){
					chart.clear();
				},
				success : function(datas) {
					var arrColor = ['#0098eb','#dc5034','#7ab800','#f2af00','#a84dbe','#f8896c'];
					var sData = datas.datas[0];

					try{
						var series=[],
							names=[];
						$.each(sData.datas, function(i, n){
						    names.push(n["name"]);
					        series.push({
					          name:n["name"],
					          type:'line',
					          data:n["values"],
					          itemStyle:{
					            normal:{
					              color:arrColor[i]
					            }
					          }
					        });
						});
						option["legend"]["data"] = names;
						option["series"]= series;
						option["xAxis"]["data"] = sData.xAxis;
					}catch(e){
						sData = [];
					}
					chart.setOption(option);
			                  
				},
				complete: function (){
					_this.resizeOuterIframe();
				}

			});
			
		},
		exportData : function(data){
			var _this = this,
				exportUrl='';
			_this.options.parent.delegate('.export_card_btn','click',function(event){
				event.stopPropagation();
				$('.export_card').hide();
				var dropId= $(this).parents('td').find('.dropChart').attr('id');

				if (!$(this).next('.export_card').length>0) {
					var exportHtml='<div class="export_card" >'
				        +'<label for="">'
				        +    '文件名<input type="text" placeholder="请输入文件名">'
				        +    '<b>导出格式:csv格式</b>'
				        +'</label>'
				        +'<div class="share_radio">'
				        +'<label for="noShare'+dropId+'">不分享<input id="noShare'+dropId+'" type="radio" name="share'+dropId+'" value="noShare'+dropId+'" checked></label><label for="addShare'+dropId+'">添加分享人<input id="addShare'+dropId+'" type="radio" name="share'+dropId+'" value="addShare'+dropId+'"></label>'
				        +'</div>'
				        +'<ul class="share_list"><em>共享人</em><li class="current_li"><input type="text" /><i class="add">+</i></li></ul>'
				        +'<div class="btn_group">'
				        +    '<button class="sure_btn">确定</button>'
				        +    '<button class="cancle_btn bg_gray">取消</button>'
				        +'</div>'
				    '</div>';
					$(this).addClass('dropShow').after(exportHtml);
				}else if($(this).next('.export_card').length>0){
					$(this).next('.export_card').show();
				}else{
					return;
				}
			});

			_this.options.parent.find('td,caption').delegate('.btn_group button','click',function(event){
				event.stopPropagation();
				var boolDrop= $(this).parents('tr').find('div').hasClass('dropChart'),
					currentId= $(this).parents('td').find('.dropChart').attr('id');
				if ($(this).hasClass('sure_btn')) {
					var currentVal= $(this).parents('.export_card').find('label input').val();
					// var currentVal= $(this).parents('.export_card').find('.share_list input').val();
					var shareVal=[];
					$(this).parents('.export_card').find('.share_list input').each(function(){
						shareVal.push($(this).val());
					});
					_this.sureCard(boolDrop,currentId,currentVal,shareVal);

				}else{
					_this.cancleCard();
				}

			});	

			_this.options.parent.find('td,caption').delegate('.share_radio label','click',function(event){
				event.stopPropagation();
				var dropId= $(this).parents('td').find('.dropChart').attr('id');
		
				if ($(this).attr('for')=='addShare'+dropId+'') {
					$(this).parent().next('.share_list').show().addClass('show');
				}else{
					$(this).parent().next('.share_list').hide().removeClass('show');
				}

			});	

			_this.shareList();

			_this.hideCard();
		},
		shareList : function(){
			var _this = this;

			_this.options.parent.find('td,caption').delegate('.share_list .add','click',function(event){
				event.stopPropagation();
				var addHtml= '<li><input type="text" /><i class="del">-</i></li>';
				$(this).parents('.share_list').append(addHtml);
			});

			_this.options.parent.find('td,caption').delegate('.share_list .del','click',function(event){
				event.stopPropagation();
				$(this).parent('li').remove();
			});	
		},
		sureCard : function(boolDrop,currentId,currentVal,shareVal){
			var _this = this;
			console.log(shareVal);
			if (!currentVal) {
			   alert('请输入文件名！');
			}else if ($.inArray("",shareVal)!=(-1)&&$('.share_list').hasClass('show')) {
				alert('请输入共享人！');
			}else if(currentVal.length>13) {
			   alert('文件名不能超过12个字符，请重新输入！');
			}else{
			   // 下载
			   var downLoadHref=_this.urlStart+boolDrop?_this.options.dropDownLoadUrl:_this.options.downLoadUrl+_this.options.downLoadStr+'&id='+currentId+'&shareName='+shareVal.toString()+'&dfn='+currentVal;
			   window.open(downLoadHref); 
			   _this.cancleCard();

			}
		},
		cancleCard : function(){
			$('.export_card').fadeOut(100);
			$('.export_card_btn').removeClass('dropShow');
			$('.export_card input').val('');
			$('.share_list').removeClass('show');
			$('.share_list li').each(function(){
				if (!$(this).hasClass('current_li')) {
					$(this).remove();
				}
			});
		},
		hideCard : function(){
			var _this = this;
			$('body,document').click(function(){
				_this.cancleCard();
			});
			// setTimeout(function(){
			// 	_this.cancleCard();
			// },5000);
			$('body,document').on('click','.export_card',function(event){
			  event.stopPropagation();
			});
		},
		resizeOuterIframe : function(){
			var content_iframe = $('#myframe', window.parent.document);// 获取iframeID
			var content_sidebar = $('#sidebar', window.parent.document);
			if(content_iframe.length==0){
				var dataFlag = $('.tabs-header .tabs .tabs-selected', window.parent.document).attr('data-flag');
				content_iframe = $('.tabs-panels iframe[data-flag="'+dataFlag+'"]', window.parent.document);
			}
			var div_height = parseInt(content_iframe.contents().find(".r_content")
					.css("height"));// 使iframe高度等于子网页高度
			content_iframe.css({
				'height' : div_height + 60
			});
			content_sidebar.css({
				'height' : div_height + 105
			});
		}
	};
	
})();