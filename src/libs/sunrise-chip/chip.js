/**
 * @(#)chip.js 2016年10月20日
 * 版权所有 (c) 2008-2016 广州市森锐科技股份有限公司
 *
 * @depend
 *
 * @author 张金凌
 */

(function ($) {
    var updateInput = function (jq, options) {
        jq.addClass("input").attr("placeholder", options.placeHolder);

        jq.keyup(function (evt) {
            var state = $.data(jq[0], "@chip");
            var key = window.event ? event.keyCode : event.which;
            switch (key) {
                case 13://回车键
                    if (jq.val() != "" && state.options.manulInput && addChip(jq, jq.val()))
                        jq.val("");
                    return false;
                case 8://退格键
                    if (jq.val() == "") {
                        backSpaceTyped(jq);
                        return false;
                    } else {
                        return true;
                    }
                case 37://向左键，选择上一个chip
                    // case 38://向上键，选择上一个chip
                    //console.log("按下了向上键");
                    keyMove(jq, "up");
                    return false;
                case 39://向右键，选择下一个chip
                    // case 40://向下键，选择下一个chip
                    //console.log("按下了向下键");
                    keyMove(jq, "down");
                    return false;
                case 46:
                    delChip(jq);
                    return false;
                default:
                    //清空选择
                    jq.parents("ul").find(".chip.active").removeClass("active");
                    console.log(key);
                    return true;
            }
        });

        var _ul = null;
        if (options.autocomplete == null) {
            _ul = $("<ul class='chips'><li class='filter'></li></ul>").insertBefore(jq);
            //_ul;
            jq.appendTo(_ul.find("li").last());
        } else {
            _ul = jq.parents("ul").addClass("chips");
            jq.parent().addClass("filter");
        }

        _ul.click(function () {
            jq.focus();
        }).attr("title", options.placeHolder);
    };

    /**
     * 方向键移动事件
     * @param jq
     * @param direction
     */
    var keyMove = function (jq, direction) {
        var _ul = jq.parents("ul");
        //先找到当前高亮的选项
        var _curLi = _ul.find("li.active");
        var _nextLi = null;
        if (direction == "down") {
            _nextLi = _curLi.length == 0 ? _ul.find("li.chip").first(".chip") : (_curLi.next(".chip").length ==
            0 ? _ul.find("li.chip").first(".chip") : _curLi.next(".chip"));
        } else if (direction == "up") {
            _nextLi = _curLi.lngth == 0 ? _ul.find("li.chip").last(".chip") : (_curLi.prev(".chip").length ==
            0 ? _ul.find("li.chip").last() : _curLi.prev(".chip"));
        }
        if (_nextLi == null)
            return;
        _curLi.removeClass("active");
        _nextLi.addClass("active");
    };

    var backSpaceTyped = function (jq) {
        //检查有选中一个chip，如果有，则进行删除
        var $item = jq.parents("ul").find("li.active");
        if ($item.length == 0)
            jq.parent().prev().addClass("active");
        else {
            //进行删除
            delChip(jq);
        }
    };

    var delChip = function (jq, state) {
        state = state || $.data(jq[0], "@chip");

        var $chip = jq.parents("ul").find(".active");

        var _id = $chip.attr("chip-id");

        var _item;
        for (var i = 0; i < state.items.length; i++) {
            if (state.items[i].id == _id) {
                _item = state.items.splice(i, 1);
                break;
            }
        }

        $chip.remove();

        //看是否整合了autocomplete，如果整合了，则将选项从排除列表中删除
        if (_item != null && _item.length > 0 && state.options.autocomplete)
            jq.autocomplete("includeItems", _item[0]["data"]);
    };

    var addChip = function (jq, item, state) {
        state = state || $.data(jq[0], "@chip");

        if (!state.items)
            state.items = [];

        if (!state.counter)
            state.counter = 0;

        var _item = {data: item, id: state.counter++};
        state.items.push(_item);

        renderChip(jq, _item, state);


        //看是否整合了autocomplete，如果整合了，则将选项添加到排除列表
        if (state.options.autocomplete) {
            jq.autocomplete("excludeItems", item);
            jq.autocomplete("hide");
        }

        return true;
    };


    var renderChip = function (jq, item, state) {
        state = state || $.data(jq[0], "@chip");


        var $li = $('<li class="chip"></li>');

        var _html = null;
        if (typeof state.options.chipRenderer === "function")
            _html = state.options.chipRenderer(jq, item["data"]);
        else
            _html = $.fn.chps.defaults.chipRenderer(jq, item["data"]);


        $li.attr("chip-id", item["id"]).append(_html).append('<span  class="delete"></span><div class="clear"></div>');

        jq.parent().before($li);

        $li.click(function () {
            //点击选项的时候，输入框请求获取焦点
            jq.focus();
            var $this = $(this);

            if (!$this.is(".active")) {
                $this.parent().find(".active").removeClass("active");
                $this.addClass("active");
            } else {
                $this.removeClass("active");
            }
        });

        //点击删除按钮
        $li.find(".delete").click(function () {
            $(this).parents("ul").find(".active").removeClass("active");
            $(this).parent().addClass("active");
            delChip(jq, state);
            return false;
        });
    };


    $.fn.chips = function (options, params) {
        if (typeof options == 'string') {
            var method = $.fn.chips.methods[options];
            if (method) {
                return method($(this), params);
            } else {
                return;
            }
        }

        options = $.extend({}, $.fn.chips.defaults, options);

        return this.each(function () {
            var state = $.data(this, "@chip");
            if (!state) {
                state = {options: options, items: [], remoteFilter: false, dataSrc: ""};
                //设置参数
                $.data(this, "@chip", state);

                //看是否要整合自动完成
                if (state.options.autocomplete) {
                    state.options.autocomplete.onSelected = function (jq, item) {
                        if (item == undefined)
                            return;
                        jq.val("");
                        addChip(jq, item, state);
                    };
                    $(this).autocomplete(state.options.autocomplete);
                }

                updateInput($(this), state.options);
            }
        });
    };

    $.fn.chips.defaults = {
        chipRenderer: function (jq, item) {
            if (typeof item === "object" && item["name"])
                return '<span class="text">' + item["name"] + '</span>';
            else if ($.isArray(item))
                return '<span class="text">' + item.join(',') + '</span>';
            else
                return '<span class="text">' + item + '</span>';
        },
        placeHolder: '请在此输入，并按回车',
        manulInput: true
    };

    $.fn.chips.methods = {
        //获取数据
        getItems: function (jq, params) {
            var state = $.data(jq[0], "@chip");
            var _datas = [];
            if (state && state.items) {
                for (var i = 0; i < state.items.length; i++) {
                    _datas.push(state.items[i].data);
                }
            }
            return _datas;
        },
        //设置数据
        setItems: function (jq, datas) {
            if ($.isArray(datas)) {
                $.each(datas, function (idx, item) {
                    addChip(jq, item);
                });
            }else{
                addChip(jq, datas);
            }

            return jq;
        },
    };

    return $;
}(jQuery));