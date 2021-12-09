import {NmTreeTableSchema} from 'ng-more/common';
import {NmHttp, NmNotify, NmRegExp} from 'ng-more/core';
import {DICT_TYPE} from '../../../config/key';

export const RESOURCE_NETUNIT_SCHEMA: NmTreeTableSchema = {
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
      query: 'netunitSecobjectgroupTree',
      create: 'netunitSecobjectgroupCreate',
      update: 'netunitSecobjectgroupUpdate',
      delete: 'netunitSecobjectgroupDelete',
    },
    form: [
      {label: '父组', key: 'parentGroupName', require: true, readonly: true},
      {label: '组名称', key: 'groupName', require: true},
      {label: '描述', key: 'groupDescription', type: 'textarea'},
    ]
  },
  table: {
    name: '网元设备',
    key: 'astId',
    treekey: 'astGroup',
    treename: 'groupName',
    api: {
      query: 'netunitList',
      create: 'netunitCreate',
      update: 'netunitUpdate',
      delete: 'netunitDelete',
      enable: 'netunitEnable',
      disable: 'netunitDisable',
      // upload: 'netunitAstImportExcel',
      // export: 'netunitExport',
      // expttpl: 'netunitAstExportExcelTemplate',
    },
    body: {
      astType: DICT_TYPE.NETUNIT,
      type: 'netunit'
    },
    view: [
      {label: '设备名称', key: 'astName', search: true},
      {label: '设备IP', key: 'astIp', search: true},
      {label: '设备类型', key: 'drivertype', search: true},
      {label: '资产组', key: 'groupName', search: true},
      {label: '状态', key: 'astStatus', switch: {on: 1, off: 0}},
    ],
    actions: [
      {
        icon: 'wifi', tip: '连通性测试', api: 'netunitTestConnected',
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
      {label: '设备名称', key: 'astName', require: true},
      {label: '设备IP', key: 'astIp', require: true, pattern: NmRegExp.IPV46},
      {
        label: '生产厂商', key: 'astVendor', type: 'select', select: {
          api: 'netunitDicList',
          body: {dicTypeCode: DICT_TYPE.NETUNIT_VENDOR},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '主机类型', key: 'drivertype', require: true, type: 'select', select: {
          api: 'netunitDicList',
          body: {dicTypeCode: DICT_TYPE.NETUNIT_TYPE},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '设备类型', key: 'cmDeviceSubType', require: true, type: 'select',
        select: {
          api: 'netunitDeviceTypeList',
          body: {astType: DICT_TYPE.NETUNIT},
          key: 'id',
          name: 'deviceSubType'
        }
      },
      {
        label: '系统版本', key: 'version', type: 'select', select: {
          api: 'netunitDicList',
          body: {dicTypeCode: DICT_TYPE.NETUNIT_SYSTEM},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '业务系统', key: 'busId', require: true, type: 'select',
        select: {
          api: 'netunitAstFindBusiness',
          body: {},
          key: 'busId',
          name: 'busName'
        }
      },
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

      {label: '连接信息', key: '-', type: 'divider', span: 6},
      {
        label: '连接方式', key: 'connectType', span: 6, type: 'select', require: true,
        select: {
          api: 'netunitDicList',
          body: {dicTypeCode: DICT_TYPE.NETUNIT_CONNECT_MODE},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '访问端口', key: 'accessport', require: true, pattern: NmRegExp.PORT, span: 6, values: {
          link: 'connectType', data: [
            {case: '-10821', value: 22},
            {case: '-10822', value: 23},
          ]
        }
      },
      {label: '管理帐号', key: 'accountAdmin', require: true, span: 6},
      {label: '管理密码', key: 'adminPwd', encrypt: true, require: true, span: 6, type: 'password'},
      {label: '跳转机IP', key: 'jumpHostIp', span: 24},

      {label: '其它信息', key: '-', type: 'divider'},
      {
        label: '专业', key: 'progkey', require: true, type: 'select', span: 6, select: {
          api: 'netunitDicList',
          body: {dicTypeCode: DICT_TYPE.RESOURCE_SUBJECT},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '所在城市', key: 'areakey', type: 'select', span: 6, select: {
          api: 'netunitDicList',
          body: {dicTypeCode: DICT_TYPE.CITY},
          key: 'id',
          name: 'dicName'
        }
      },
      {label: '描述', key: 'astDesc', span: 12},

      {label: '资产类型', key: 'astType', value: DICT_TYPE.NETDEVICE, type: 'hide'},
    ]
  }
};
