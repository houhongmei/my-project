var navs = [
	{
		"title": "订单管理",
		"id": "",
		"parent_id": "47",
		"path": "/订单管理/",
		"order": 9999,
		"url": "",
		"icon": "fa-cogs",
		"spread": false,
		"children": [
			{
				"title": "订单列表",
				"icon": "fa-unlock-alt",
				"href": "!DevAdmin/Admin/Order/~view/orderList?type=list"
			}, {
				"title": "发货调整",
				"icon": "fa-cog",
				"href": "!DevAdmin/Admin/Order/~view/orderAdjust"
			}, {
				"title": "订单历史",
				"icon": "fa-hourglass-half",
				"href": "!DevAdmin/Admin/Order/~view/orderHistory?type=history"
			}
		]
	}, {
		"title": "商品管理",
		"id": "",
		"order": 20,
		"parent_id": "47",
		"path": "/商品管理/",
		"url": "",
		"icon": "fa-cubes",
		"spread": false,
		"children": [
			{
				"title": "商品管理",
				"icon": "&#xe641;",
				"href": "!Busi/Goods/~view/goodsManager"
			}
		]
	},{
		"title": "设备基础信息管理",
		"icon": "fa-dollar",
		"url": "",
		"spread": false,
		"children": [
			{
				"title": "设备基础信息",
				"icon": "fa-table",
				"href": "!DevAdmin/Admin/DevBase/~view/devBaseInfo"
			}
		]
	}, {
		"title": "售后管理",
		"icon": "fa-file-text-o",
		"url": "",
		"spread": false,
		"children": [
			{
				"title": "售后申请管理",
				"icon": "fa-check-square-o",
				"href": "!DevAdmin/Admin/DevSale/~view/afterList?type=apply"
			}, {
				"title": "退货单管理",
				"icon": "fa-history",
				"href": "!DevAdmin/Admin/DevSale/~view/afterList?type=return"
			}, {
				"title": "换货单管理",
				"icon": "fa-btc",
				"href": "!DevAdmin/Admin/DevSale/~view/afterList?type=exchange"
			}, {
                "title": "维修单管理",
                "icon": "fa-btc",
                "href": "!DevAdmin/Admin/DevSale/~view/afterList?type=repair"
            },{
                "title": "客户售后单管理",
                "icon": "fa-btc",
                "href": "!DevAdmin/Admin/DevSale/~view/WXAfterList?type=apply"
            }, {
                "title": "维修单管理",
                "icon": "fa-btc",
                "href": "!DevAdmin/Admin/DevSale/~view/WXAfterList?type=repair"
            }, {
                "title": "售后统计报表",
                "icon": "fa-btc",
                "href": "!DevAdmin/Admin/DevSale/~view/afterReport"
            }
		]
	}, {
		"title": "库存管理",
		"icon": "fa-thumbs-o-up",
		"url": "",
		"spread": false,
		"children": [
			{
				"title": "入库操作",
				"icon": "fa-share-square-o",
				"href": "!DevAdmin/Admin/Stock/~view/stockInManager"
			}, {
				"title": "出库操作",
				"icon": "fa-search",
				"href": "!DevAdmin/Admin/Stock/~view/stockOutManager"
			}, {
				"title": "序列号管理",
				"icon": "fa-bar-chart",
				"href": "!DevAdmin/Admin/Stock/~view/stockSnManager"
			}, {
				"title": "坏品管理",
				"icon": "fa-life-ring",
				"href": "!DevAdmin/Admin/Stock/~view/badProductManage"
			}, {
                "title": "历史出库",
                "icon": "fa-life-ring",
                "href": "!DevAdmin/Admin/Stock/~view/stockOutManagerHis?type=history"
            },{
                "title": "库存总览",
                "icon": "fa-mouse-pointer",
                "href": "!DevAdmin/Admin/Report/~view/stockOver"
            }, {
                "title": "入库报表",
                "icon": "fa-wrench",
                "href": "!DevAdmin/Admin/Report/~view/stockIn"
            }, {
                "title": "出库报表",
                "icon": "fa-file-text",
                "href": "!DevAdmin/Admin/Report/~view/stockOut"
            }, {
                "title": "退货报表",
                "icon": "fa-jpy",
                "href": "!DevAdmin/Admin/Report/~view/refund"
            }
		]
	}, {
		"title": "财务管理",
		"id": "",
		"parent_id": "47",
		"order": 80,
		"path": "/财务管理/",
		"icon": "fa-calculator",
		"url": "",
		"spread": false,
		"children": [
			{
				"title": "退款管理",
				"icon": "fa-file-word-o",
				"href": "!DevAdmin/Admin/Finance/~view/refund"
			}, {
				"title": "线下订单审核",
				"icon": "fa-file-powerpoint-o",
				"href": "!DevAdmin/Admin/Finance/~view/lineOrderList?type=finance"
			}, {
				"title": "回款管理",
				"icon": "fa-file-excel-o",
				"href": "!DevAdmin/Admin/Finance/~view/orderIncome.ftl"
			}, {
				"title": "发票管理",
				"icon": "fa-file-code-o",
				"href": "!DevAdmin/Admin/Finance/~view/invoiceManage.ftl"
			}, {
				"title": "提成管理",
				"icon": "fa-strikethrough",
				"href": "!DevAdmin/Admin/Finance/~view/commissionManage.ftl"
			}, {
                "title": "支付类型修改",
                "icon": "fa-strikethrough",
                "href": "!DevAdmin/Admin/Finance/~view/payTypeManage.ftl"
            }, {
                "title": "确认收入列表",
                "icon": "fa-strikethrough",
                "href": "!DevAdmin/Admin/Finance/~view/incomeConfirmManage.ftl"
            }, {
                "title": "费用统计",
                "icon": "fa-strikethrough",
                "href": "!DevAdmin/Admin/Finance/~view/CustReportOfSales.ftl"
            }
		]
	}, {
		"title": "设备申请管理",
		"icon": "fa-stop-circle",
		"url": "",
		"spread": false,
		"children": [
			{
				"title": "测试管理",
				"icon": "fa-shopping-cart",
				"href": "!DevAdmin/Admin/DevApply/~view/devApplyManage.ftl?type=2"
			},{
				"title": "租用管理",
				"icon": "fa-phone-square",
				"href": "!Custom/SzQh/RechargeManage/PrepaidRefill/~view/recharge"
			},{
				"title": "领用管理",
				"icon": "fa-try",
				"href": "!DevAdmin/Admin/DevApply/~view/devApplyManage.ftl?type=3"
			},{
				"title": "设备申请",
				"icon": "fa-outdent",
				"href": "!DevAdmin/Admin/DevApply/~view/devApplyEquipment.ftl"
			}
		]
	}, {
        "title": "数据报表",
        "icon": "fa-stop-circle",
        "url": "",
        "spread": false,
        "children": [
            {
                "title": "销售统计",
                "icon": "fa-shopping-cart",
                "href": "!DevAdmin/Admin/Report/~view/sales_report"
            },{
                "title": "商品统计分析",
                "icon": "fa-phone-square",
                "href": "!DevAdmin/Admin/Report/~view/sales_analyse"
            },{
                "title": "应收款统计报表",
                "icon": "fa-try",
                "href": "!DevAdmin/Admin/Report/~view/income_report"
            },{
                "title": "销售预测",
                "icon": "fa-outdent",
                "href": "!DevAdmin/Admin/Report/~view/sales_forecast.ftl"
            },{
                "title": "销售统计（新）",
                "icon": "fa-outdent",
                "href": "!DevAdmin/Admin/Report/~view/sales_report_new"
            },{
                "title": "商品统计分析（新）",
                "icon": "fa-outdent",
                "href": "!DevAdmin/Admin/Report/~view/sales_analyse_new"
            }
        ]
    }, {
        "title": "生产管理",
        "icon": "fa-stop-circle",
        "url": "",
        "spread": false,
        "children": [
            {
                "title": "采购订单",
                "icon": "fa-shopping-cart",
                "href": "!DevAdmin/Admin/Production/~view/productManage"
            },{
                "title": "配件管理",
                "icon": "fa-phone-square",
                "href": "!DevAdmin/Admin/Production/~view/productPartsManage"
            }
        ]
    }, {
        "title": "系统管理",
        "icon": "fa-stop-circle",
        "url": "",
        "spread": false,
        "children": [
            {
                "title": "修改密码",
                "icon": "fa-shopping-cart",
                "href": "!org/user/~/pages/userModifyPass.jsp?old"
            },{
                "title": "资源授权",
                "icon": "fa-phone-square",
                "href": "!sys/security/~/pages/resourceAccessManage.jsp?old"
            },{
                "title": "组织机构",
                "icon": "fa-phone-square",
                "href": "!DevAdmin/Admin/SaleUser/~view/SaleUser.ftl"
            },{
                "title": "销售区域经理",
                "icon": "fa-phone-square",
                "href": "!DevAdmin/Admin/SaleUser/~view/salesArea.ftl"
            },{
                "title": "业务规则配置",
                "icon": "fa-shopping-cart",
                "href": "!Core/BusiRule/~view/busiRuleList?old"
            },{
                "title": "业务规则授权",
                "icon": "fa-phone-square",
                "href": "!Core/BusiRule/~view/busiRuleGrant?old"
            }
        ]
    }
]
