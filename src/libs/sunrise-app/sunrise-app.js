/**
 * sunrise-app-config.js 必需先加载
 */

(function ($) {
    if (SunriseAppConfig == undefined) {
        //console.warn("未设置 SunriseApp 配置，将运行不正常");
        return;
    }
    //设置 base 标签
    //$(document.head).prepend($("<base>").attr("href", SunriseApp.app_base));
    // document.write("<base href='"+SunriseApp.app_base+"'>");
    var $ajax_orignal = $.ajax;

    var systemConfig = SunriseAppConfig.systems;
    var getSysHost = function (sys) {
        return systemConfig[sys] == undefined ? "" : systemConfig[sys]["server_base"];
    };

    $.ajax = function (settings) {
        var url = settings["url"];

        // http 或者 https 开头的 url 不进行处理
        if (!/^(([H|h][t|T]{2}[p|P][s|S]?:\/\/)).+/.test(url)) {
            var sys = settings["sys"];
            if (sys == undefined || $.trim(sys) == "") {
                //如果没有定义 sys 选项，则处理 url
                var idx = url.indexOf("/!");

                if (idx != -1) {
                    sys = url.substr(0, idx);
                    url = url.substr(idx + 1);
                }
            }
            var sysHost = getSysHost(sys);
            if (sysHost != undefined && $.trim(sysHost) != "") {
                if (sysHost.lastIndexOf('/') == sysHost.length - 1)
                    sysHost = sysHost.substr(0, sysHost.length - 1);

                if (url.indexOf('/') == 0)
                    url = sysHost + url;
                else
                    url = sysHost + '/' + url;

                settings["url"] = url;
            } else if (settings["sys"] != undefined) {
                //console.warn("没有在主机定义文件找到主机 " + settings["sys"] + " 的定义");
                settings["url"] = SunriseAppConfig.app_base + url;
            }
        }

        settings["type"] = settings["type"] || "POST";
        settings["crossDomain"] = true;
        settings["xhrFields"] = {
            withCredentials: true
        };
        if (settings["header"] == undefined)
            settings["header"] = {};
        settings["header"]["Content-Type"] = "application/json";

        var msg = "";
        if(settings["type"] =="get" || settings["type"] =="GET"){
            settings["data"]=$.extend(settings["data"]||{},{_t:new Date().getTime()});
        }

        settings["statusCode"] = {
            404: function () {
                //
                msg = "访问资源不存在";
                alert(msg);
            },
            403: function () {
                msg = "没有该资源的访问权限，请联系管理员进行授权";
                alert(msg);
            },
            402: function () {
                msg = "";
                alert(msg);
            },
            400: function () {
                msg = "请求不正确";
                alert(msg);
            },
            401: function () {
                msg = "未进行登陆，请登录后重试";
                alert(msg);
            },
            499: function () {
                msg = "发送的表单数据不合法";
                alert(msg);
            },
            500: function () {
                msg = "数据处理异常";
                alert(msg);
            },
            598: function () {
                msg = "数据查询异常";
                alert(msg);
            },
            599: function () {
                msg = "数据库更新异常";
                alert(msg);
            },
        };

        return $ajax_orignal.apply($, [settings]);
    };

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results == null ? "" : (results[1] || '');
    };
})(jQuery);

/**
 * 实现安全控制相关功能，此 js 必需放在业务逻辑代码前面
 *
 * 依赖：
 * jQuery
 *
 * 初始化逻辑：
 * 1. 获取功能定义信息，并存储到本地
 *
 * 运行逻辑：
 * 1. 检测当前页面的 URL 是否需要做授权控制，如果当前页面不需要授权或者不需要登录则不做任何事情
 * 2. 检测当前用户是否已经登录（从本地存储中获取登录信息），如果已经登录，则判断是否有权限，有权限则直接过
 * 3. 如果当前用户已登录，并且没有权限访问当前页面，则显式无权限信息（通过 404 返回）
 * 4. 如果当前用户未登录，则向后台请求登录信息，此时页面显式等待（通过 206 返回）
 * 5. 后台返回未登录，则跳转到 CAS 登录界面进行登录（此 CAS 登录界面中，也需要引入该 js，并且调用登录成功函数）
 * 6. CAS 登录成功后，302 重定向到登录前的页面，这时候重新走第一个逻辑
 *
 *
 * 接口：
 * 1. 状态事件接口
 * 2. 设置登录信息接口
 * 3. 获取权限信息接口
 * 4. 获取功能定义接口
 * 5. 获取用户信息接口
 *
 *
 * 状态编码：
 * 403  无权访问
 * 404  页面不存在
 * 206  等待
 * 500  系统错误
 * 302  系统正在重定向
 */

var SunriseApp = (function () {
    //console.log("init security.");
    var LOGIN_DATA_KEY = "login_info";
    var FUNC_DATA_KEY = "func_def";
    var PERMINSION_DATA_KEY = "permission_def";

    var STATUS_WAITTING = 206;
    var STATUS_NOT_FOUND = 404;
    var STATUS_DENY = 403;
    var STATUS_ERROR = 500;
    var STATUS_REDIRECT = 302;

    var config = SunriseAppConfig.security_params;

    /**
     * 数据保存接口
     * @param key
     * @param val
     */
    var saveData = function (key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    };

    /**
     * 数据获取接口
     * @param key
     */
    var getData = function (key) {
        var data = localStorage.getItem(key);
        if (data != undefined)
            return JSON.parse(data);

        return data;
    };

    /**
     * 显式指定状态的界面信息
     * @param status
     */
    var showStatusPage = function (status, params, success) {
        //console.log("display status page: ", status);

        var $div = $(".security_div");
        if ($div.length == 0) {

            $div = $("<div></div>").addClass("security_div").hide().css("height", document.body.scrollHeight +
                    "px").css("width", document.body.scrollWidth + "px").css("z-index", "2000").css("position",
                    "absolute").css("top", 0).css("left", 0);
            $(document.body).append($div);
        }

        $div.show();
        $div.load(config.status_pages[status], params, success);
    };

    /**
     * 隐藏所有的状态界面信息
     */
    var hideStatusPage = function () {
        //console.log("隐藏所有的临时界面");

        $(".security_div").remove();
    };

    /**
     * 将所有的功能定义集合到一个数组，不考虑重复
     * @param funcs
     */
    var processFuncs = function (funcs) {
        var allFuncs = {};
        $.each(funcs, function (k, v) {
            var modules = v["modules"];
            $.each(modules, function (k1, v1) {
                var fs = v1["functions"];
                $.each(fs, function (i, f) {
                    allFuncs[f["data"]] = f;
                });
            });
        });
        return allFuncs;
    };

    /**
     * Ajax 请求
     * @param url
     * @param param
     * @param success
     * @param fail
     */
    var ajax = function (url, param, success, fail) {
        //console.log("正在请求 ", url);
        $.ajax({
            url: url,
            type: "get",
            // dataType: "json",
            cache:'false',
            success: function (data, textStatus, jqXHR) {
                success(data);
            },
            complete: function () {
                //console.log("请求已完成");
            }
        });
    };

    /**
     * 权限检测
     * @param allow
     * @param deny
     * @param login
     */
    var checkPermission = function (funcs, allow, deny) {
        //先找到当前的 URL
        // var url = "";//todo: 获取当前的页面路径

        // var func = funcs[url];
        //功能不存在或者模式是不控制权限
        /*
        if (func == undefined || func["mode"] < 0) {
            allow();
            return;
        }
        */

        //获取授权数据

        var permissions = getData(PERMINSION_DATA_KEY);
        if (permissions == undefined) {
            //向后台请求权限数据
            ajax(config.urls.permissions, {}, function (data) {
                //保存权限数据，再次调用权限检测
                saveData(PERMINSION_DATA_KEY, data.body);
                //checkPermission(allow, deny);
            }, function () {
                showStatusPage(STATUS_ERROR);
            });

            return;
        }


        //登录校验，如果已经登录，则进行权限的校验

        checkLogin(function () {
            //判断是否有权限访问当前的 URL
            if (true) {
                //todo: 这里进行权限的校验
                allow();
            } else {
                deny();
            }
        }, function () {

        });

    };

    //获取功能定义和授权信息
    var getFuncAndPermDatas = function (done) {
        $.ajax({
            url: config.urls.functions,
            type: "GET",
            dataType: "json",
            success: function (data) {
                //保存
                saveData(FUNC_DATA_KEY, processFuncs(data.body));

                $.ajax({
                    url: config.urls.permissions,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        saveData(PERMINSION_DATA_KEY, data.body);
                        if (done)
                            done();
                    }
                });
            }
        });
    };

    //定义要返回的结果
    var result = {
        /**
         * 获取登录的用户信息
         */
        getLoginInfo: function () {
            return getData(LOGIN_DATA_KEY);
        },

        /**
         * 设置登录的用户信息
         * @param userInfo
         */
        setLoginInfo: function (userInfo) {
        },

        /**
         * 获取所有的权限定义
         */
        getFuncs: function () {
            var funcs = getData(FUNC_DATA_KEY);
            return funcs;
        },

        /**
         * 获取有权限访问的权限数据
         */
        getPermissions: function () {
            var perm = getData(PERMINSION_DATA_KEY);
            return perm == undefined ? [] : perm;
        },

        /**
         * 执行注销操作，删除所有的本地缓存
         */
        logout: function () {
            localStorage.clear();
        },

        /**
         * 执行登录操作
         */
        checkLogin: function (success, fail) {
            var login_info = getData(LOGIN_DATA_KEY);
            if (login_info != undefined) {
                var lastCheckTime = login_info["check_time"];

                //如果是5分钟前进行过检查，并且登录信息还存在，先不用检查
                if (new Date().getTime() - lastCheckTime < 5 * 60 * 1000) {
                    if (success)
                        success();
                    return;
                }
            }

            if (fail)
                fail();
        },

        /**
         * 校验 ticket 是否合法
         */
        validateTicket: function (success, fail) {
            //console.log("进行登录校验");

            var login_info = getData(LOGIN_DATA_KEY);

            var ticket = $.urlParam("ticket");
            var ticketService = location.href;
            var idx = ticketService.indexOf('?');
            if (idx != -1)
                ticketService = ticketService.substring(0, idx);

            if (ticket == "") {
                //没有 ticket，需要跳转到 cas 检查是否已经登录
                location.href = config.urls.login_page + "?service=" + ticketService;
            } else {
                //有 ticket，向 cas 请求校验 ticket 是否有效
                $.ajax({
                    url: config.urls.login_check,
                    type: "get",
                    dataType: "text",
                    cache:'false',
                    data: {
                        service: ticketService,
                        ticket: ticket
                    },
                    success: function (xml, textStatus, jqXHR) {
                        //todo: 这里需要对 status 进行判断处理
                        var account = $(xml).find("cas\\:user").text();
                        if (account == "") {
                            //没有账号信息，表示没有登录，跳转到登录页面
                            location.href = config.urls.login_page + "?service=" + ticketService;
                        } else {
                            //已经登录了
                            //console.log(account + " 已经登录系统");

                            if (login_info == undefined || login_info.account != account) {
                                //两次登录的账号不相同，需要清空权限数据，并重新加载
                                window.localStorage.clear();

                            }

                            //保存登录信息
                            if (login_info == undefined) {
                                login_info = {account: account};
                            }
                            login_info["check_time"] = new Date().getTime();

                            saveData(LOGIN_DATA_KEY, login_info);

                            //success();
                            //登录完成后，获取功能定义、授权数据、用户的信息
                            $.ajax({
                                url: config.urls.login_info,
                                dataType: "json",
                                method: "GET",
                                header: {Origin: SunriseAppConfig.app_base},
                                success: function (data) {
                                    //console.log(JSON.stringify(data));
                                    login_info["name"] = data.body["name"];
                                    saveData(LOGIN_DATA_KEY, login_info);
                                    //获取功能定义和权限数据
                                    getFuncAndPermDatas(function () {
                                        if (success)
                                            success();
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    };

    return result;
}(jQuery));