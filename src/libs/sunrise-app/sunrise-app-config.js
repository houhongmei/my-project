var SunriseAppConfig = {
    app_base: "http://business.esaleb.co/",
    systems: {
        "esaleb-core-member": {
            //前端 URL 地址
            "ui_base": "http://business.esaleb.co/esaleb-core-member/",
            //后端 接口 地址
            "server_base": "http://crm.demo.esaleb.com/member-server",
            //系统编码
            "code": "esaleb-core-member",
            //系统名称
            "name": "会员",
            //系统标题
            "title": "会员中心",
            //系统图标
            "icon": "../../../static/images/member.png"
        },
        "esaleb-business-crm": {
            "ui_base": "http://business.esaleb.co/esaleb-business-crm-pc/",
            "server_base": "http://crm.server.esaleb.co",
            "code": "esaleb-business-crm",
            "name": "商机",
            "title": "商机管理",
            "icon": "../../../static/images/crm.png"
        },
        // "esaleb-core-capability": {
        //     "ui_base": "http://cap.esaleb.co/",
        //     "server_base": "http://cap.esaleb.co",
        //     "code": "esaleb-core-capability",
        //     "name": "能力",
        //     "title": "能力接入",
        //     "icon": ""
        // },
        // "esaleb-core-pay": {
        //     "ui_base": "http://pay.esaleb.co",
        //     "server_base": "http://crm.server.esaleb.co",
        //     "code": "esaleb-core-pay",
        //     "name": "支付",
        //     "title": "支付管理",
        //     "icon": ""
        // },
        "esaleb-business-dev": {
            "ui_base": "http://dev.server.esaleb.co/",
            "server_base": "http://dev.server.esaleb.co/",
            "code": "esaleb-business-dev",
            "name": "设备",
            "title": "设备管控",
            "icon": "../../../static/images/dev.png"
        }
    },
    security_params: {
        urls: {
            login_check: "http://passport.esaleb.co/p3/serviceValidate",
            login_info: "http://member.server.esaleb.co/!sys/security/~java/LoginState.get",
            login_page: "http://passport.esaleb.co/login",
            logout_page: "http://passport.esaleb.co/logout",
            functions: "http://member.server.esaleb.co/!member/permit/~java/Permit.tree",
            permissions: "http://member.server.esaleb.co/!member/employee/~java/Employee.getAuthority"
        },
        status_pages: {
            206: "src/libs/sunrise-app/206.html",
            302: "src/libs/sunrise-app/302.html",
            403: "",
            404: "",
            500: ""
        }
    }
};