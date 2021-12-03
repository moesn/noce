import {NmTreeTableSchema} from 'ng-more/common';
import {NmRegExp, NmHttp, NmNotify} from 'ng-more/core';
import {DICT_TYPE} from '../../../config/key';

export const RESOURCE_WEBAPP_SCHEMA: NmTreeTableSchema = {
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
      query: 'webappSecobjectgroupTree',
      create: 'webappSecobjectgroupCreate',
      update: 'webappSecobjectgroupUpdate',
      delete: 'webappSecobjectgroupDelete',
    },
    form: [
      {label: '父组', key: 'parentGroupName', require: true, readonly: true},
      {label: '组名称', key: 'groupName', require: true},
      {label: '描述', key: 'groupDescription', type: 'textarea'},
    ]
  },
  table: {
    name: 'Web应用',
    key: 'astId',
    treekey: 'astGroup',
    treename: 'groupName',
    api: {
      query: 'webAppList',
      create: 'webAppCreate',
      update: 'webAppUpdate',
      delete: 'webAppDelete',
      enable: 'webAppEnable',
      disable: 'webAppDisable',
      // upload: 'webappAstImportExcel',
      // export: 'webAppExport',
      // expttpl: 'webappAstExportExcelTemplate',
    },
    body: {
      astType: DICT_TYPE.WEBAPP,
      type: 'webapp'
    },
    view: [
      {label: '应用名称', key: 'astName', search: true},
      {label: 'URL地址', key: 'url', search: true},
      {label: '资产组', key: 'groupName', search: true},
      {label: '状态', key: 'astStatus', switch: {on: 1, off: 0}},
    ],
    actions: [
      {
        icon: 'wifi', tip: '连通性测试', api: 'webappTestConnected',
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
    cols: 2,
    // parse: d => {
    //   d.astImportanceLevel = d.astImportanceLevel?.lable;
    //   return d;
    // },
    form: [
      {label: '基础信息', key: '-', type: 'divider'},
      {label: '资产组', key: 'groupName', readonly: true},
      {label: '应用名称', key: 'astName', require: true},
      {label: 'URL地址', key: 'url', require: true, pattern: NmRegExp.URL},
      {
        label: '设备类型', key: 'cmDeviceSubType', require: true, type: 'select',
        select: {
          api: 'webappDeviceTypeList',
          body: {astType: DICT_TYPE.WEBAPP},
          key: 'id',
          name: 'deviceSubType'
        }
      },
      {
        label: '业务系统', key: 'busId', require: true, type: 'select',
        select: {
          api: 'webappAstFindBusiness',
          body: {},
          key: 'busId',
          name: 'busName'
        }
      },
      {
        label: '资产重要性', key: 'astImportanceLevel',type:'select',
        options:[
          {label: '可以忽略', value: 1},
          {label: '低', value: 2},
          {label: '中等', value: 3},
          {label: '高', value: 4},
          {label: '非常高', value: 5},
        ]
      },
      {label: '连接信息', key: '-', type: 'divider', help: '右键点击用户输入框，点击"检查"，查看输入框标签的id、name或class，密码和按钮同样操作。'},
      {label: '用户输入框属性', key: 'appHtmlNameProperty', require: true},
      {label: '用户名', key: 'accountAdmin', require: true},
      {label: '密码输入框属性', key: 'appHtmlPwdProperty', require: true},
      {label: '密码', key: 'adminPwd', require: true, type: 'password'},
      {label: '登录按钮属性', key: 'appHtmlButtonName', require: true},
      {label: '', key: '-', type: 'space'},

      {label: '其它信息', key: '-', type: 'divider'},
      {
        label: '专业', key: 'progkey', require: true, type: 'select', span: 12, select: {
          api: 'webappDicList',
          body: {dicTypeCode: DICT_TYPE.RESOURCE_SUBJECT},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '所在城市', key: 'areakey', type: 'select', span: 12, select: {
          api: 'webappDicList',
          body: {dicTypeCode: DICT_TYPE.CITY},
          key: 'id',
          name: 'dicName'
        }
      },
      {label: '描述', key: 'astDesc'},
      {label: '', key: '-', type: 'space'},

      {label: '资产类型', key: 'astType', value: DICT_TYPE.WEBAPP, type: 'hide'},
    ]
  }
};
