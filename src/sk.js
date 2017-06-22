import _ from 'lodash';
import Cookies from 'js-cookie';

/**
 * default of key function
 *
 * @private
 * @param key index of array or property name of object
 * @param item value of array by index or value of object by property name
 * @param context array or object
 * @returns {*}
 */
function _skKeyFunc(key, item, context) {
  return _.isPlainObject(context) ? _.startsWith(key, 'skIdx') : ('skIdx' + key);
}
/**
 * @example
 * [2,{skIdx0:3,skIdx1:[4,{skIdx0:5,skIdx1:[]}]}] -> [2,[3,[4,[5,[]]]]]
 */
if (!Array.prototype.skArr) {
  Object.defineProperty(Array.prototype, 'skArr', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (recursive, keyFunc = _skKeyFunc) {
      let rtn = [];
      this.forEach(($item) => {
        rtn.push((recursive && (_.isArray($item) || _.isPlainObject($item))) ? $item.skArr(recursive, keyFunc) : $item);
      });
      return rtn;
    }
  });
}
if (!Array.prototype.skFilter) {
  Object.defineProperty(Array.prototype, 'skFilter', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (recursive, filterFunc) {
      let rtn = [];
      this.forEach(($item, $index) => {
        if (_.isFunction(filterFunc) && filterFunc($index, $item, this)) {
          rtn.push((recursive && (_.isArray($item) || _.isPlainObject($item))) ? $item.skFilter(recursive, filterFunc) : $item)
        }
      });
      return rtn;
    }
  });
}
/**
 * @example
 * [1,{a:2,b:[3,{c:4,d:[5,{}]}]}] -> {skIdx0:1,skIdx1:{a:2,b:{skIdx0:3,skIdx1:{c:4,d:{skIdx0:5,skIdx1:{}}}}}}
 */
if (!Array.prototype.skObj) {
  Object.defineProperty(Array.prototype, 'skObj', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (recursive, keyFunc = _skKeyFunc) {
      let rtn = {};
      this.forEach(($item, $index) => {
        rtn[_.isFunction(keyFunc) ? keyFunc($index, $item, this) : $index] = (recursive && (_.isArray($item) || _.isPlainObject($item))) ? $item.skObj(recursive, keyFunc) : $item;
      });
      return rtn;
    }
  });
}
/**
 * @example
 * [1,2,3].skRmv(2) -> [1,3]
 */
if (!Array.prototype.skRmv) {
  Object.defineProperty(Array.prototype, 'skRmv', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (item) {
      let tmpIdx = this.indexOf(item);
      if (tmpIdx > -1) {
        this.splice(tmpIdx, 1);
      }
      return this;
    }
  });
}
/**
 * @example
 * [1,2,3].skToggle(2) -> [1,3]
 * [1,3].skToggle(2) -> [1,3,2]
 */
if (!Array.prototype.skToggle) {
  Object.defineProperty(Array.prototype, 'skToggle', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (item) {
      let tmpIdx = this.indexOf(item);
      if (tmpIdx > -1) {
        this.splice(tmpIdx, 1);
      } else {
        this.push(item);
      }
      return this;
    }
  });
}
/**
 * @example
 * (987654.321).skCurrencyFmt(2) -> 987,654.32
 */
if (!Number.prototype.skCurrencyFmt) {
  Number.prototype.skCurrencyFmt = function (fraction) {
    return String(this).skCurrencyFmt(fraction);
  };
}
/**
 * @example
 * {skIdx0:1,skIdx1:[2,{skIdx0:3,skIdx1:[4,{skIdx0:5,skIdx1:[]}]}]} -> [1,[2,[3,[4,[5,[]]]]]]
 */
if (!Object.prototype.skArr) {
  Object.defineProperty(Object.prototype, 'skArr', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (recursive, keyFunc = _skKeyFunc) {
      let rtnArr = [];
      let rtnObj = {};
      Object.keys(this).forEach(($key) => {
        let tmpVal = this[$key];
        let rtn = (recursive && (_.isPlainObject(tmpVal) || _.isArray(tmpVal))) ? tmpVal.skArr(recursive, keyFunc) : tmpVal;

        rtnObj[$key] = rtn;
        if (_.isFunction(keyFunc) && keyFunc($key, tmpVal, this)) {
          rtnArr.push(rtn);
        }
      });
      return Object.keys(rtnObj).length === rtnArr.length ? rtnArr : rtnObj;
    }
  });
}
if (!Object.prototype.skAssign) {
  Object.defineProperty(Object.prototype, 'skAssign', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (...objects) {
      return SK.assign.apply(this, _.concat(this, objects));
    }
  });
}
if (!Object.prototype.skFilter) {
  Object.defineProperty(Object.prototype, 'skFilter', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (recursive, filterFunc) {
      let rtn = {};
      Object.keys(this).forEach(($key) => {
        let tmpVal = this[$key];
        if (_.isFunction(filterFunc) && filterFunc($key, tmpVal, this)) {
          rtn[$key] = (recursive && (_.isArray(tmpVal) || _.isPlainObject(tmpVal))) ? tmpVal.skFilter(recursive, filterFunc) : tmpVal;
        }
      });
      return rtn;
    }
  });
}
/**
 * @example
 * {a:2,b:[3,{c:4,d:[5,{}]}]} -> {a:2,b:{skIdx0:3,skIdx1:{c:4,d:{skIdx0:5,skIdx1:{}}}}}
 */
if (!Object.prototype.skObj) {
  Object.defineProperty(Object.prototype, 'skObj', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (recursive, keyFunc = _skKeyFunc) {
      let rtn = {};
      Object.keys(this).forEach(($key) => {
        let tmpVal = this[$key];
        rtn[$key] = (recursive && (_.isArray(tmpVal) || _.isPlainObject(tmpVal))) ? tmpVal.skObj(recursive, keyFunc) : tmpVal;
      });
      return rtn;
    }
  });
}
if (!Object.prototype.skVal) {
  Object.defineProperty(Object.prototype, 'skVal', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function (str, val) {
      let rtn = this;
      let tmpArr = str.split('.');
      let tmpIdx = 0;
      if (arguments.length > 1) {
        for (; tmpIdx < tmpArr.length - 1; tmpIdx++) {
          if (rtn[tmpArr[tmpIdx]] === undefined) {
            rtn[tmpArr[tmpIdx]] = {};
          }
          rtn = rtn[tmpArr[tmpIdx]];
        }
        if (rtn) {
          rtn[tmpArr[tmpIdx]] = val;
        }
      } else {
        for (; tmpIdx < tmpArr.length; tmpIdx++) {
          rtn = rtn[tmpArr[tmpIdx]];
          if (rtn === undefined) {
            break;
          }
        }
      }
      return rtn;
    }
  });
}
if (!Object.prototype.skVals) {
  Object.defineProperty(Object.prototype, 'skVals', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: function () {
      return Object.keys(this).map(($key) => {
        return this[$key];
      });
    }
  });
}
if (!String.prototype.skBlank) {
  String.prototype.skBlank = function () {
    return this.trim().length === 0;
  };
}
if (!String.prototype.skCurrencyFmt) {
  String.prototype.skCurrencyFmt = function (fraction) {
    fraction = fraction > 0 && fraction <= 20 ? fraction : 2;
    let tmpArr = (parseFloat(this.replace(/[^\d\.-]/g, '')).toFixed(fraction) + '').split('.');
    return tmpArr[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '.' + tmpArr[1];
  };
}
if (!String.prototype.skEmpty) {
  String.prototype.skEmpty = function () {
    return this.length === 0;
  };
}
if (!String.prototype.skFmt) {
  String.prototype.skFmt = function (o) {
    return this.replace(/(\$\{\w+(\.\w+)*\})/g, ($matched) => {///(\{\w+\.\})/g
      return o.skVal($matched.replace('${', '').replace('}', ''));
    });
  };
}
if (!String.prototype.skFmtArr) {
  String.prototype.skFmtArr = function (a) {
    return this.replace(/\$(\d+)/g, ($_, $m) => {
      return a[--$m];
    });
  };
}

export default class SK {
  static CHAR_AMPERSAND = '&';
  static CHAR_ANGLE = '∠';
  static CHAR_APPROXIMATELY = '≈';
  static CHAR_ARROW = '→';
  static CHAR_ASTERISK = '*';
  static CHAR_BACKSLASH = '\\';
  static CHAR_CELSIUS = '℃';
  static CHAR_CIRCLE = '⊙';
  static CHAR_CIRCUMFERENCE = '○';
  static CHAR_CLOSE_BRACE = '}';
  static CHAR_CLOSE_BRACKET = ']';
  static CHAR_CLOSE_PARENTHESIS = ')';
  static CHAR_COLON = ':';
  static CHAR_COMMA = ',';
  static CHAR_DASH = '-';
  static CHAR_DEGREE = '°';
  static CHAR_DIVIDE = '÷';
  static CHAR_DOT = '.';
  static CHAR_DOUBLE_QUOTATION = '"';
  static CHAR_EQUAL = '=';
  static CHAR_EQUAL_APPROXIMATELY = '≌';
  static CHAR_EQUIVALENT = '≡';
  static CHAR_EXCLAMATION = '!';
  static CHAR_HENCE = '∴';
  static CHAR_INFINITY = '∞';
  static CHAR_INTEGRAL = '∫';
  static CHAR_INTERSECTION = '∩';
  static CHAR_LESS = '<';
  static CHAR_LESS_EQUAL = '≤';
  static CHAR_MINUS = '-';
  static CHAR_MINUTE = '′';
  static CHAR_MULTIPLY = '×';
  static CHAR_MORE = '>';
  static CHAR_MORE_EQUAL = '≥';
  static CHAR_NOT_EQUAL = '≠';
  static CHAR_NOT_LESS = '≮';
  static CHAR_NOT_MORE = '≯';
  static CHAR_OPEN_BRACE = '{';
  static CHAR_OPEN_BRACKET = '[';
  static CHAR_OPEN_PARENTHESIS = '(';
  static CHAR_PARALLEL = '‖';
  static CHAR_PERCENT = '%';
  static CHAR_PERMILL = '‰';
  static CHAR_PERPENDICULAR = '⊥';
  static CHAR_PI = 'π';
  static CHAR_PLUS = '+';
  static CHAR_PLUS_MINUS = '±';
  static CHAR_POUND = '#';
  static CHAR_PROPORTION = '∷';
  static CHAR_QUESTION = '?';
  static CHAR_SECOND = '〃';
  static CHAR_SECTION = '§';
  static CHAR_SEMICIRCLE = '⌒';
  static CHAR_SEMICOLON = ';';
  static CHAR_SIGMA = '∑';
  static CHAR_SINCE = '∵';
  static CHAR_SINGLE_QUOTATION = '\'';
  static CHAR_SLASH = '/';
  static CHAR_SQUARE = '√';
  static CHAR_TRIANGLE = '△';
  static CHAR_UNDERLINE = '_';
  static CHAR_UNION = '∪';
  static CHAR_VARIES = '∝';
  static CHAR_VERTICAL = '|';

  static CONTEXT_PATH = '';
  static COOKIE_LANGUAGE = 'language';

  static DEFAULT_DOMAIN = '$sk';
  static DEFAULT_ENV = {};
  static DEFAULT_LANGUAGE = 'en_US';
  static DEFAULT_MOMENT_DATE = 'YYYY-MM-DD';
  static DEFAULT_MOMENT_DATETIME = 'YYYY-MM-DD HH:mm:ss';
  static DEFAULT_MOMENT_TIME = 'HH:mm:ss';

  /**
   * New or get namespace object.
   *
   * @param {string} $ namespace
   * @param {Object} initVal init value
   * @param {Object} env window(browser) or global(nodejs) etc.
   * @returns {*} Returns the new assigner function.
   */
  static $($ = SK.DEFAULT_DOMAIN, initVal = {}, env = SK.DEFAULT_ENV) {
    if (!env[$]) {
      env[$] = initVal;
    } else if (!_.isEmpty(initVal)) {
      env[$] = initVal;
    }
    return env[$];
  }

  /**
   * default of assignWith's customizer
   *
   * @private
   * @returns {*|undefined}
   * @see _.assignWith
   */
  static _skAssignCustomizer(objValue, srcValue, key, object, source) {
    return SK.arePlainObject(objValue, srcValue, object, source) ? SK.assign(objValue, srcValue) : undefined;
  }

  /**
   * xxx.com,a,b => xxx.com?a=b
   * xxx.com?a=b,a,c => xxx.com?a=c
   * xxx.com?a=b,c,d => xxx.com?a=b&c=d
   *
   * @param url
   * @param param
   * @param value
   * @returns {string}
   */
  static appendParameter(url, param, value) {
    if(url.indexOf(SK.CHAR_QUESTION) == -1){
      return url + SK.CHAR_QUESTION + param + SK.CHAR_EQUAL + value;
    }else{
      let existParamValue = SK.getRequestParameter(param, url.split(SK.CHAR_QUESTION)[1]);
      if(existParamValue){
        return url.replace(existParamValue, value);
      }else{
        return url + SK.CHAR_AMPERSAND + param + SK.CHAR_EQUAL + value;
      }
    }
  }

  /**
   * Checks if values are plain object.
   *
   * @returns {boolean}
   * @see _.isPlainObject
   */
  static arePlainObject(...values) {
    let rtn = true;
    values.forEach(($item) => {
      rtn = rtn && _.isPlainObject($item);
    });
    return rtn;
  }

  /**
   * let o1 = {a:[{'b':1},'c',2], d:{e:3}};
   * let o2 = {a:[{'x':10},'y',20], d:{z:30}};
   * let o3 = $.extend(true,o1,o2);
   * JSON.stringify(o3);//{"a":[{"b":1,"x":10},"y",20],"d":{"e":3,"z":30}}
   * o1 == o3;//true
   * o1 === o3;//true
   *
   * let o1 = {a:[{'b':1},'c',2], d:{e:3}};
   * let o2 = {a:[{'x':10},'y',20], d:{z:30}};
   * let o3 = _.assign(o1,o2);
   * JSON.stringify(o3);//{"a":[{"x":10},"y",20],"d":{"z":30}}
   * o1 == o3;//true
   * o1 === o3;//true
   *
   * @static
   * @param {Object} object The destination object.
   * @param {...Object} objects The source objects.
   * @example
   *
   * let o1 = {a:[{'b':1},'c',2], d:{e:3}};
   * let o2 = {a:[{'x':10},'y',20], d:{z:30}};
   * let o3 = SK.assign(o1,o2);
   * JSON.stringify(o3);//{"a":[{"x":10},"y",20],"d":{"e":3,"z":30}}
   * o1 == o3;//true
   * o1 === o3;//true
   */
  static assign(object, ...objects) {
    return _.assignWith.apply(this, _.concat(object, objects, SK._skAssignCustomizer));
  }

  /**
   *
   * @param key
   * @param value
   * @returns {*}
   */
  static cookies(key, value) {
    if (arguments.length > 1) {
      Cookies.remove(key);
      return Cookies.set(key, value);
    } else {
      return Cookies.get(key);
    }
  }

  /**
   * @param {Array|string} arr1
   * @param {Array|string} arr2
   * @param {string} concat
   * @returns {Array|string}
   * @example
   * descartes(['alert','btn'],['success','info']);//['alert-success','alert-info','btn-success','btn-info']
   * descartes('alert','link','-');//'alert-link'
   */
  static descartes(arr1 = [], arr2 = [], concat = SK.CHAR_DASH) {
    let tmpArr1 = Array.isArray(arr1) ? arr1 : [arr1];
    let tmpArr2 = Array.isArray(arr2) ? arr2 : [arr2];
    let rtn = [];
    tmpArr1.forEach(($ele1) => {
      tmpArr2.forEach(($ele2) => {
        rtn.push($ele1 + concat + $ele2);
      })
    });
    return rtn.length === 1 ? rtn[0] : rtn;
  }

  static emptyFunc(){

  }

  /**
   *
   * @returns {string}
   */
  static getCurrentHref() {
    return window.location.href;
  }

  static getCurrentLanguage() {
    let language = SK.cookies(SK.COOKIE_LANGUAGE);
    return language ? language : SK.DEFAULT_LANGUAGE;
  }

  /**
   *
   * @returns {string}
   */
  static getCurrentOrigin() {
    return window.location.origin;
  }

  /**
   *
   * @returns {string}
   */
  static getCurrentPath() {
    var path = window.location.pathname;
    path = path.substring(SK.CONTEXT_PATH.length, path.length);
    path = _.endsWith(path, '.html') ? path.substring(0, path.length - 5) : path;
    return path;
  }

  /**
   *
   * @returns {*}
   */
  static getCurrentSearch() {
    return window.location.search;
  }

  /**
   *
   * @param param
   * @param search
   * @returns {*}
   */
  static getRequestParameter(param, search) {
    search = search || SK.getCurrentSearch();
    search = _.startsWith(search, SK.CHAR_QUESTION) ? search.slice(1) : search;
    var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    return r ? decodeURIComponent(r[2]) : undefined;
  }

  /**
   *
   * @param path
   * @returns {string[]}
   */
  static getSubPaths(path) {
    let rtn = ['/'];
    path.split(SK.CHAR_SLASH).reduce((pre, cur) => {
      if (SK.s4s(cur) === '') {
        return pre;
      } else {
        let validPath = SK.getValidPath(pre + cur);
        rtn.push(validPath);
        return validPath;
      }
    }, '');
    return rtn;
  }

  /**
   *
   * @param path
   * @returns {string}
   */
  static getValidPath(path) {
    return (_.startsWith(path, SK.CHAR_SLASH) ? '' : SK.CHAR_SLASH) + path + (_.endsWith(path, SK.CHAR_SLASH) ? '' : SK.CHAR_SLASH);
  }

  /**
   *
   * @param key
   * @param value
   */
  static local(key, value) {
    if (arguments.length > 1) {
      return localStorage.setItem(key, value);
    } else {
      return localStorage.getItem(key);
    }
  }

  /**
   *
   * @param url
   */
  static redirect(url) {
    window.location.href = url;
  }

  /**
   * Safe array for value.
   * @param {*} value
   * @param {Array} defaultValue
   * @returns {Array}
   */
  static s4a(value, defaultValue = []) {
    return _.isArray(value) ? value : defaultValue;
  }

  /**
   * Safe boolean for value.
   * @param {*} value
   * @param {boolean} defaultValue
   * @returns {boolean}
   */
  static s4b(value, defaultValue = false) {
    return _.isBoolean(value) ? value : defaultValue;
  }

  /**
   * Safe date for value.
   * @param {*} value
   * @param {Date} defaultValue
   * @returns {Date}
   */
  static s4d(value, defaultValue = new Date()) {
    return _.isDate(value) ? value : defaultValue;
  }

  /**
   * Safe finite number for value.
   * @param {*} value
   * @param {number} defaultValue
   * @returns {number}
   */
  static s4n(value, defaultValue = 0) {
    return _.isFinite(_.toNumber(value)) ? _.toNumber(value) : defaultValue;
  }

  /**
   * Safe plain object for value.
   * @param {*} value
   * @param {Object} defaultValue
   * @returns {{}}
   */
  static s4o(value, defaultValue = {}) {
    return _.isPlainObject(value) ? value : defaultValue;
  }

  /**
   * Safe string for value.
   * @param {*} value
   * @param {string} defaultValue
   * @returns {string}
   */
  static s4s(value, defaultValue = '') {
    return (_.isBoolean(value) || _.isFinite(value) || _.isString(value)) ? String(value) : defaultValue;
  }

  /**
   *
   * @param key
   * @param value
   */
  static session(key, value) {
    if (arguments.length > 1) {
      return sessionStorage.setItem(key, value);
    } else {
      return sessionStorage.getItem(key);
    }
  }

  /**
   * @param word
   * @returns {string}
   * @example
   * upperWordFirstChar('path');//Path
   * upperWordFirstChar('list');//List
   */
  static upperWordFirstChar(word) {
    return _.toString(word).replace(/(\w)/, ($1) => {
      return $1.toUpperCase();
    });
  }

  /**
   * @param words
   * @returns {string}
   * @example
   * upperWordsFirstChar('xi nAn shi you xUe yuan china people');//Xi NAn Shi You XUe Yuan China People
   */
  static upperWordsFirstChar(words) {
    return _.toString(words).replace(/\s[a-z]/g, ($11) => {
      return $11.toUpperCase();
    }).replace(/^[a-z]/, ($21) => {
      return $21.toUpperCase();
    })
  }
}
