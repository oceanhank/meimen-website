function show_day(getdate, pushday) {
    var WeekDay = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    if (getdate.value != '') {
        pushday.value = WeekDay[parseInt(new Date(getdate.value).getDay())];
    }
}

function eval_int_number(fieldname, defaultValue) {
    if (fieldname.value.match(/[^0-9]/g)) {
        alert('欄位值必須為數字!!');
        fieldname.value = defaultValue || '';
        fieldname.focus();
    }
}

function eval_float_number(fieldname, defaultValue) {
    if (fieldname.value.match(/[^.|^0-9]/g)) {
        alert('欄位值必須為數字!!');
        fieldname.value = defaultValue || '';
        fieldname.focus();
    }
}

//取得歲數 birth eg.2000-01-01 or 2000.01.01
function getAge(birth) {
    var birth = Date.parse(birth.replace('/-/g', "/").replace('/./g', "/"));
    var year = 1000 * 60 * 60 * 24 * 365;
    var now = new Date();
    var birthday = new Date(birth);
    var age = parseInt((now - birthday) / year);

    return age;
}

const randomMethod = {
    shuffle: function (string) {//打亂字串，同php str_shuffle 函數
        var parts = string.split('');
        for (var i = parts.length; i > 0;) {
            var random = parseInt(Math.random() * i);
            var temp = parts[--i];
            parts[i] = parts[random];
            parts[random] = temp;
        }
        return parts.join('');
    },
    generateString: function (length) {//產生亂碼
        length = length || 15;
        var result = '';
        var characters = this.shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

//cookie
const cookieMethod = {
    //設定cookie
    set: function (name, value, second) {
        if (second) {
            var date = new Date();
            date.setTime(date.getTime() + (second * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/; Samesite=Lax";
    },
    //取得cookie
    get: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    //刪除cookie
    delete: function (name) {
        cookieMethod.set(name, "", -1);
    }
}

//檢查各類欄位物件
const verifyMethod = {
    mobile: function (value, type) {
        if (value != '') {
            let regex = '';
            switch (type) {
                case 1:
                    regex = /^[09]{2}[0-9]{8}$/;
                    break;
                case 2:
                    regex = /^09[0-9]{2}-[0-9]{3}-[0-9]{3}$|^09[0-9]{2}-[0-9]{6}$|^09[0-9]{8}$/;
                    break;
            }

            return regex.test(value);
        }
    },
    number: function (value) {
        const regex = /[^0-9]/g;
        return regex.test(value);
    },
    iD(value) {
        const regex = /^[AFC][0-9]{9}$/;
        return regex.test(value);
    },
    invoice(value) {//發票號碼
        const regex = /^[A-Za-z]{2}[0-9]{8}$/;
        return regex.test(value);
    },
    creditCard(value) {
        const regex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        return regex.test(value);
    },
    email(value) {
        if (value == '') return true;
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    }
}

//產生token
const CSRFTokenJs = new function () {
    this.generate = function (timeout) {
        timeout = timeout || 5;
        const name = 'CSRFToken_' + randomMethod.generateString(15);
        const value = randomMethod.generateString(50);
        cookieMethod.set(name, value, timeout);

        return {
            name: name,
            value: value
        }
    }
}

//訊息提示框
class ibestToasts {
    constructor(options = {}) {
        this.container = null;
        if (options.position) {
            const positionX = ['left', 'right'];
            const positionY = ['top', 'bottom'];
            this.position = [...new Set(options.position)].filter(item => [...positionX, ...positionY].includes(item));
            !this.position.some(item => positionX.includes(item)) && this.position.push('right');
            !this.position.some(item => positionY.includes(item)) && this.position.push('bottom');
        } else {
            this.position = ['right', 'bottom'];
        }
        this.autoCloseDelay = options.closeDelay || 3000;
        this.template = `<div class="toastMessageText"><div class="toastText"></div></div>`;
        this.background = {
            'success': '#20bb89',
            'error': '#ec3535',
            'warning': '#f0c64e',
            'normal': '#323232',
        }
        this.icon = {
            'success': 'fa-check-circle-o',
            'error': 'fa-times',
            'warning': 'fa-exclamation-triangle',
        }
        this.init();
    }

    init() {
        const container = document.createElement('div');
        container.classList.add('toastMessageBox');
        this.position.forEach(item => container.classList.add(item));
        const outerWrap = document.querySelector('.outerWrap');
        outerWrap.appendChild(container);
        this.container = container;
        const outerWrapPaddingTop = window.getComputedStyle(outerWrap).paddingTop || '0px';
        this.container.style.paddingTop = outerWrapPaddingTop;
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const fixedQuickLink = document.querySelector('.fixedQuickLink');
        if (fixedQuickLink && this.position.includes('bottom'))
            this.container.style.paddingBottom = fixedQuickLink.clientHeight + 'px';
    }

    create(type = 'normal') {
        const toast = document.createElement('div');
        toast.classList.add('toastMessage');
        toast.style.backgroundColor = this.background[type] || this.background['normal'];
        toast.innerHTML = this.template;
        const icon = this.icon[type];
        if (icon) {
            const iconDom = document.createElement('i');
            iconDom.classList.add('fa', icon);
            const textBoxDom = toast.querySelector('.toastMessageText');
            textBoxDom.insertBefore(iconDom, textBoxDom.firstChild);
        }
        this.container.appendChild(toast);
        return toast;
    }

    show(message, type = 'normal', autoClose = true) {
        if (!message) return false;
        const toast = this.create(type);
        const textDom = toast.querySelector('.toastText');
        textDom.textContent = message;
        toast.addEventListener('click', () => this.hide(toast));
        setTimeout(() => toast.classList.add('show'), 200);
        autoClose && setTimeout(() => this.hide(toast), this.autoCloseDelay);
    }

    hide(dom) {
        dom.classList.remove('show');
        setTimeout(() => dom.remove(), 1000);
    }
}

// encode
if (typeof 'safeQueryEncode' !== 'function') {
    function safeQueryEncode(paramValue) {
        return encodeURIComponent(btoa(encodeURIComponent(paramValue)));
    }
}

// encode
if (typeof 'safeQueryDecode' !== 'function') {
    function safeQueryDecode(paramValue) {
        if (isBase64(paramValue)) {
            return decodeURIComponent(atob(paramValue));
        }

        return decodeURIComponent(atob(decodeURIComponent(paramValue)));
    }
}

// 判斷是否為 base64
if (typeof 'isBase64' !== 'function') {
    function isBase64(str) {
        if (typeof str !== 'string') {
            return false;
        }
        if (str.length % 4 !== 0) {
            return false;
        }
        const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
        if (!base64Regex.test(str)) {
            return false;
        }
        try {
            atob(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}