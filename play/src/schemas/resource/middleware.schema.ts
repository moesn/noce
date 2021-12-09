import {NmTreeTableSchema} from 'ng-more/common';
import {NmHttp, NmNotify, NmRegExp} from 'ng-more/core';
import {DICT_TYPE} from '../../../config/key';

NmRegExp.hhhhp = {
  txt: '字符!@#$%^&*>_',
  reg: new RegExp(/^[!@#$%^&*_>]+$/)
}

export const RESOURCE_MIDDLEWARE_SCHEMA: NmTreeTableSchema = {
  tree: {
    name: '资产组',
    primarykey: 'groupId',
    primaryname: 'groupName',
    parentkey: 'parentGroupId',
    parentname: 'parentGroupName',
    body: {
      parentOrgId: 0,
      recursion: true,
    },
    api: {
      query: 'middlewareSecobjectgroupTree',
      create: 'middlewareSecobjectgroupCreate',
      update: 'middlewareSecobjectgroupUpdate',
      delete: 'middlewareSecobjectgroupDelete',
    },
    form: [
      {label: '父组', key: 'parentGroupName', require: true, readonly: true},
      {label: '组名称', key: 'groupName', require: true},
      {label: '描述', key: 'groupDescription', type: 'textarea'},
    ]
  },
  table: {
    name: '中间件',
    key: 'astId',
    treekey: 'astGroup',
    treename: 'groupName',
    api: {
      query: 'deviceMiddleList',
      create: 'deviceMiddleCreate',
      update: 'deviceMiddleUpdate',
      delete: 'middlewareDeviceDelete', // todo
      enable: 'middlewareDeviceEnable',
      disable: 'middlewareDeviceDisable',
      // upload: 'middlewareAstImportExcel',
      // export: 'middlewareDeviceExport',
      // expttpl: 'middlewareAstExportExcelTemplate',
    },
    body: {
      astType: DICT_TYPE.MIDDELWARE,
      type: 'middleware'
    },
    view: [
      {label: '中间件名称', key: 'astName', search: true},
      {label: '中间件IP', key: 'astIp', search: true},
      {label: '资产组', key: 'groupName', search: true},
      {label: '状态', key: 'astStatus', switch: {on: 1, off: 0}},
    ],
    actions: [
      {
        icon: 'wifi', tip: '连通性测试', api: 'middlewareTestConnected',
        click: (data, api): void => {
          if (api) {
            NmHttp.post(api, {id: data.astId}).subscribe((o: any) => {
              if (o.success) {
                NmNotify.success(o.msg);
              }
            });
          }
        }
      },
    ],
    cols: 3,
    // parse: d => {
    //   d.astImportanceLevel = d.astImportanceLevel?.lable;
    //   return d;
    // },
    form: [
      {label: '基础信息', key: '-', type: 'divider'},
      {label: '资产组', key: 'groupName', readonly: true},
      {label: '中间件名称', key: 'astName', require: true},
      {label: '中间件IP', key: 'astIp', require: true, pattern: NmRegExp.IPV46},
      {label: '中间件路径', key: 'middlewarepath', require: true},
      {label: '机房地址', key: 'serverRoomAddress'},
      {
        label: '生产厂商', key: 'astVendor', type: 'select', select: {
          api: 'middlewareDicList',
          body: {dicTypeCode: DICT_TYPE.MIDDLEWARE_VENDOR},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '主机类型', key: 'drivertype', type: 'select', select: {
          api: 'middlewareDicList',
          body: {dicTypeCode: DICT_TYPE.MIDDELWARE},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '设备类型', key: 'cmDeviceSubType', require: true, type: 'select',
        select: {
          api: 'middlewareDeviceTypeList',
          body: {astType: DICT_TYPE.MIDDELWARE},
          key: 'id',
          name: 'deviceSubType'
        }
      },
      {
        label: '系统版本', key: 'version', type: 'select', select: {
          api: 'middlewareDicList',
          body: {dicTypeCode: DICT_TYPE.MIDDLEWARE_SYSTEM},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '业务系统', key: 'busId', require: true, type: 'select',
        select: {
          api: 'middlewareAstFindBusiness',
          body: {},
          key: 'busId',
          name: 'busName'
        }
      },
      {
        label: '虚拟资产', key: 'isvirres', value: false, type: 'select',
        options: [
          {label: '是', value: true},
          {label: '否', value: false},
        ]
      },
      {label: '虚拟ID', key: 'virresid', show: {link: 'isvirres', value: true}},
      {label: '物理机IP', key: 'physicalmacip', show: {link: 'isvirres', value: true}, pattern: NmRegExp.IPV46},
      {
        label: '资产重要性', key: 'astImportanceLevel', type: 'select', span: 8,
        options: [
          {label: '可以忽略', value: 1},
          {label: '低', value: 2},
          {label: '中等', value: 3},
          {label: '高', value: 4},
          {label: '非常高', value: 5},
        ]
      },
      {label: '', key: '-', type: 'space', show: {link: 'isvirres', value: true}},
      {label: '', key: '-', type: 'space', show: {link: 'isvirres', value: true}},
      {label: '连接信息', key: '-', type: 'divider', span: 6},
      {
        label: '连接方式', key: 'connectType', span: 6, type: 'select', require: true,
        select: {
          api: 'middlewareDicList',
          body: {dicTypeCode: DICT_TYPE.MIDDLEWARE_CONNECT_MODE},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '访问端口', key: 'accessport', require: true, pattern: NmRegExp.PORT, span: 6, values: {
          link: 'connectType', data: [
            {case: '-10621', value: 22},
            {case: '-10622', value: 23},
          ]
        }
      },
      {label: '特权提示符', key: 'adminprompt', value: '$', require: true, pattern: NmRegExp.hhhhp, span: 6},
      {label: '特权切换', key: 'su', value: 'su', require: true, span: 6},
      {label: '特权密码', key: 'rootpwd', encrypt: true, require: true, span: 6, type: 'password'},
      {label: '管理帐号', key: 'accountAdmin', require: true, span: 6},
      {label: '管理密码', key: 'adminPwd', encrypt: true, span: 6, require: true, type: 'password'},
      {label: '管理提示符', key: 'conprompt', value: '$', span: 6, require: true, pattern: NmRegExp.hhhhp},
      {label: '跳转机IP', key: 'jumpHostIp', span: 24},

      {label: '其它信息', key: '-', type: 'divider'},
      {
        label: '专业', key: 'progkey', require: true, type: 'select', select: {
          api: 'middlewareDicList',
          body: {dicTypeCode: DICT_TYPE.RESOURCE_SUBJECT},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '所在城市', key: 'areakey', type: 'select', select: {
          api: 'middlewareDicList',
          body: {dicTypeCode: DICT_TYPE.CITY},
          key: 'id',
          name: 'dicName'
        }
      },
      {label: '描述', key: 'astDesc'},

      {label: '资产类型', key: 'astType', value: DICT_TYPE.MIDDELWARE, type: 'hide'},
    ]
  }
};
