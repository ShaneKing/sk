import $ from 'jquery';
import _ from 'lodash';
import SK from './SK';
import Mesgs from './Mesgs';

export default class Codes {
  static code = {};
  static hash = {};//current language hash

  static PATH_PREFIX = '/json/codes';
  static SERVER_URL = '';

  static get(code, path = SK.getCurrentPath()) {
    const validPath = SK.getValidPath(path);
    const validPaths = Codes.getSubPaths(validPath, false);
    for (let i = 0; i < validPaths.length; i += 1) {
      const validPathsCode0 = Codes.code[validPaths[i]];
      if (validPathsCode0) {
        const validPathsCodes = SK.s4a(validPathsCode0.skVal(code));
        if (validPathsCodes.length !== 0) {
          return validPathsCodes;
        }
      }
    }
    return [];
  }

  static getSubPaths(path, justUnExisted) {
    return justUnExisted ? _.difference(SK.getSubPaths(path), Object.keys(Codes.code)) : SK.getSubPaths(path);
  }

  static load(path = SK.getCurrentPath(), async = true) {
    path = SK.getValidPath(path);
    if (Codes.code[path]) {
      return $.when(Codes.code[path]);
    } else if ($.isEmptyObject(Codes.hash)) {
      const deferred = $.Deferred();
      Codes.loadHash(async).done(() => {
        Codes.load(path, async).always(() => {
          deferred.resolve();
        });
      }).fail(() => {
        Codes.hash.env = SK.ENV_DEV;
        $.ajax({
          async: async,
          cache: false,
          dataType: SK.FILE_TYPE_JSON,
          method: SK.REQUEST_METHOD_GET,
          url: SK.CONTEXT_PATH + Codes.PATH_PREFIX + SK.CHAR_UNDERLINE + SK.getCurrentLanguage() + SK.FILE_TYPE_JSON_WITH_POINT,
        }).done($resp => {
          Mesgs.jsonNodeParser($resp, SK.EMPTY, Codes.code);
        }).always(() => {
          deferred.resolve();
        });
      });
      return deferred;
    } else {
      return $.when(...Codes.getSubPaths(path, true).filter(validPath => {
        return Codes.hash[validPath];
      }).map(validPath => {
        return $.ajax({
          async: async,
          cache: true,
          dataType: SK.FILE_TYPE_JSON,
          method: SK.REQUEST_METHOD_GET,
          url: SK.CONTEXT_PATH + Codes.PATH_PREFIX + validPath + Codes.hash[validPath] + SK.CHAR_UNDERLINE + SK.getCurrentLanguage() + SK.FILE_TYPE_JSON_WITH_POINT,
        }).done($resp => {
          Codes.code[validPath] = $resp;
        });
      }));
    }
  }

  static loadHash(async = true) {
    return $.ajax({
      async: async,
      cache: false,
      dataType: SK.FILE_TYPE_JSON,
      method: SK.REQUEST_METHOD_GET,
      url: Codes.SERVER_URL + Codes.PATH_PREFIX + Mesgs.PART_OF_HASH_PATH + SK.getCurrentLanguage() + SK.FILE_TYPE_JSON_WITH_POINT,
    }).done($resp => {
      Codes.hash = $resp;
    });
  }

  static unload(path) {
    Object.keys(Codes.code).filter($existPath => {
      return _.startsWith($existPath, path);
    }).forEach($existPath => {
      delete Codes.code[$existPath];
    });
  }
}
