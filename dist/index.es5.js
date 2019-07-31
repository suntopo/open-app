/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var isZh = function () {
    return /zh/i.test(navigator.language);
};
var isimToken = function () {
    return typeof window.imToken !== 'undefined';
};
var isUnSupportScheme = function () {
    var ua = navigator.userAgent;
    var isWechat = /micromessenger\/([\d.]+)/i.test(ua);
    return isWechat;
};
var isAndroid = function () {
    var ua = navigator.userAgent;
    return /android/i.test(ua);
};
var openByLocation = function (url) {
    location.href = url;
};
var openByIframe = function (url) {
    var ifr = document.createElement('iframe');
    ifr.src = url;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
};
//# sourceMappingURL=utils.js.map

var buttonStyle = {
    position: 'fixed',
    zIndex: 999,
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#0890BE',
    boxShadow: '0px 6px 8px rgba(22, 21, 60, 0.2)',
    borderRadius: '50px',
    padding: '14px 28px',
    fontSize: '15px',
    color: '#fff',
    borderStyle: 'none',
};
var getDefaultProps = function () {
    return {
        schemeUrl: 'imtokenv2://navigate/DappView',
        fallbackUrl: 'https://token.im/download',
        buttonStyle: buttonStyle,
        buttonText: isZh ? '打开 imToken' : 'Open imToken',
        timeout: 2000,
    };
};
var OpenApp = /** @class */ (function () {
    function OpenApp(props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        this.showTip = function () {
            _this.tip.style.display = 'block';
        };
        this.hideTip = function () {
            _this.tip.style.display = 'none';
        };
        this.open = function () {
            // imToken
            if (isimToken()) {
                return;
            }
            // show tip
            if (isUnSupportScheme()) {
                _this.showTip();
                return;
            }
            // try to open app
            var schemeUrl = _this.props.schemeUrl;
            var url = schemeUrl + "?url=" + location.href;
            if (isAndroid()) {
                openByIframe(url);
            }
            else {
                openByLocation(url);
            }
            _this._checkOpen();
        };
        this.fallback = function () {
            var fallbackUrl = _this.props.fallbackUrl;
            location.href = fallbackUrl + "?from=open-app";
        };
        this._checkOpen = function () {
            var haveChange = false;
            var property = 'hidden';
            var eventName = 'visibilitychange';
            // Opera 12.10 and Firefox 18 and later support
            if (typeof document.hidden !== 'undefined') {
                property = 'hidden';
                eventName = 'visibilitychange';
            }
            else if (typeof document.msHidden !== 'undefined') {
                property = 'msHidden';
                eventName = 'msvisibilitychange';
            }
            else if (typeof document.webkitHidden !== 'undefined') {
                property = 'webkitHidden';
                eventName = 'webkitvisibilitychange';
            }
            var pageChange = function (e) {
                haveChange = true;
                if (document[property] || e.hidden || document.visibilityState === 'hidden') ;
                else {
                    _this.fallback();
                }
                removeEvents();
            };
            var removeEvents = function () {
                document.removeEventListener(eventName, pageChange);
                document.removeEventListener('baiduboxappvisibilitychange', pageChange);
            };
            var addEvents = function () {
                document.addEventListener(eventName, pageChange, false);
                document.addEventListener('baiduboxappvisibilitychange', pageChange, false);
            };
            addEvents();
            clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                if (haveChange) {
                    return;
                }
                removeEvents();
                _this.fallback();
                haveChange = true;
            }, _this.props.timeout);
        };
        var defaultProps = getDefaultProps();
        this.props = __assign({}, defaultProps, props);
        this.render();
    }
    OpenApp.prototype.render = function () {
        if (isimToken()) {
            return;
        }
        this.renderButton();
        this.renderTip();
    };
    OpenApp.prototype.renderButton = function () {
        var _a = this.props, buttonStyle = _a.buttonStyle, buttonText = _a.buttonText;
        var button = document.createElement('button');
        // apply btn text
        button.innerHTML = buttonText;
        // apply style
        Object.keys(buttonStyle).forEach(function (attr) {
            button.style[attr] = buttonStyle[attr];
        });
        // append to body
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(button);
        // add click event
        button.addEventListener('click', this.open);
    };
    OpenApp.prototype.renderTip = function () {
        this.tip = document.createElement('div');
        var step1Text = isZh ? '点击更多' : '1. Click More';
        var step2Text = isZh ? '选择在浏览器中打开' : '2. Choose “Open in Browser”';
        var styleContainner = "\n      position: fixed;\n      top: 0;\n      right: 0;\n      left: 0;\n      bottom: 0;\n      background-color: rgba(35, 33, 71, 0.8);\n    ";
        var styleArrow = "\n      position: absolute;\n      top: -16px;\n      right: 6px;\n    ";
        var styleMore = "\n      position: absolute;\n      top: 70px;\n      right: 130px;\n      text-align: center;\n    ";
        var styleText = "\n      font-size: 17px;\n      line-height: 17px;\n      text-align: center;\n      color: #fff;\n      margin-top: 16px;\n    ";
        var styleArrowOpen = "\n      position: absolute;\n      top: 94px;\n      right: 194px;\n    ";
        var styleOpen = "\n      position: absolute;\n      top: 195px;\n      right: 60px;\n      text-align: center;\n    ";
        this.tip.innerHTML = "\n      <div style=\"" + styleContainner + "\">\n        <img style=\"" + styleArrow + "\" src=\"https://cdn.whale.token.im/open-app/oa-arrow-click.svg\" alt=\"arrow\" />\n        <div style=\"" + styleMore + "\">\n          <img src=\"https://cdn.whale.token.im/open-app/oa-more.svg\" alt=\"more\" />\n          <div style=\"" + styleText + "\">" + step1Text + "</div>\n        </div>\n        <img style=\"" + styleArrowOpen + "\" src=\"https://cdn.whale.token.im/open-app/oa-arrow-open.svg\" alt=\"arrow\" />\n        <div style=\"" + styleOpen + "\">\n          <img src=\"https://cdn.whale.token.im/open-app/oa-browser.svg\" alt=\"arrow\" />\n          <div style=\"" + styleText + "\">" + step2Text + "</div>\n        </div>\n      </div>\n    ";
        // hide
        this.tip.style.display = 'none';
        // append to body
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(this.tip);
        // add click event
        this.tip.addEventListener('click', this.hideTip);
    };
    return OpenApp;
}());
//# sourceMappingURL=index.js.map

export default OpenApp;
//# sourceMappingURL=index.es5.js.map
