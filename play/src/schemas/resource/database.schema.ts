import {NmTreeTableSchema} from 'ng-more/common';
import {NmHttp, NmNotify, NmRegExp} from 'ng-more/core';
import {DICT_TYPE} from '../../../config/key';

export const RESOURCE_DATABASE_SCHEMA: NmTreeTableSchema = {
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
      query: 'databaseSecobjectgroupTree',
      create: 'databaseSecobjectgroupCreate',
      update: 'databaseSecobjectgroupUpdate',
      delete: 'databaseSecobjectgroupDelete',
    },
    form: [
      {label: '父组', key: 'parentGroupName', require: true, readonly: true},
      {label: '组名称', key: 'groupName', require: true},
      {label: '描述', key: 'groupDescription', type: 'textarea'},
    ]
  },
  table: {
    name: '数据库',
    key: 'astId',
    treekey: 'astGroup',
    treename: 'groupName',
    api: {
      query: 'deviceDatabaseList',
      create: 'deviceDatabaseCreate',
      update: 'deviceDatabaseUpdate',
      delete: 'deviceDatabaseDelete',
      enable: 'deviceDatabaseEnable',
      disable: 'deviceDatabaseDisable',
      // upload: 'databaseAstImportExcel', // todo
      // export: 'deviceDatabaseExport',
      // expttpl: 'databaseAstExportExcelTemplate',
    },
    body: {
      astType: DICT_TYPE.DATABASE,
      type: 'database'
    },
    view: [
      {label: '资产名称', key: 'astName', search: true},
      {label: '数据库名称', key: 'databasename', search: true},
      {label: '数据库IP', key: 'astIp', search: true},
      {label: '数据库类型', key: 'databasetypename'},
      {label: '资产组', key: 'groupName', search: true},
      {label: '状态', key: 'astStatus', switch: {on: 1, off: 0}},
    ],
    actions: [
      {
        icon: 'wifi', tip: '连通性测试', api: 'databaseTestConnected',
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
      {label: '资产组', key: 'groupName', readonly: true, span: 8},
      {label: '数据库名称', key: 'astName', require: true, span: 8},
      {label: '数据库IP', key: 'astIp', require: true, pattern: NmRegExp.IPV46, span: 8},
      {
        label: '数据库类型', key: 'drivertype', require: true, type: 'select', span: 8, select: {
          api: 'databaseDicList',
          body: {dicTypeCode: DICT_TYPE.DATABASE_TYPE},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '设备类型', key: 'cmDeviceSubType', require: true, type: 'select', span: 8,
        select: {
          api: 'databaseDeviceTypeList',
          body: {astType: DICT_TYPE.DATABASE},
          key: 'id',
          name: 'deviceSubType'
        }
      },
      {
        label: '业务系统', key: 'busId', require: true, type: 'select',
        select: {
          api: 'databaseAstFindBusiness',
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
      {label: '', key: '-', type: 'space'},
      {label: '', key: '-', type: 'space'},


      {label: '连接信息', key: '-', type: 'divider', span: 6},
      {
        label: '端口', key: 'astPort', require: true, pattern: NmRegExp.PORT, span: 6,
        values: {
          link: 'drivertype', data: [
            {case: '-10301', value: 1521},
            {case: '-10302', value: 3306},
            {case: '-10303', value: 1433},
            {case: '-10304', value: 1433},
            {case: '-10305', value: 5000},
            {case: '-10306', value: 1025},
          ]
        }
      },
      {label: '帐号', key: 'accountAdmin', require: true, span: 6},
      {label: '密码', key: 'adminPwd', encrypt: true, span: 6, require: true, type: 'password'},
      {label: '数据库名', key: 'databasename', require: true, span: 6},
      {
        label: '驱动类', key: 'drivername', require: true, span: 24,
        values: {
          link: 'drivertype', data: [
            {case: '-10301', value: 'oracle.jdbc.driver.OracleDriver'},
            {case: '-10302', value: 'com.mysql.jdbc.Driver'},
            {case: '-10303', value: 'com.microsoft.jdbc.sqlserver.SQLServerDriver'},
            {case: '-10304', value: 'com.microsoft.sqlserver.jdbc.SQLServerDriver'},
            {case: '-10305', value: 'com.sybase.jdbc3.jdbc.SybDriver'},
            {case: '-10306', value: 'com.ncr.teradata.TeraDriver'},
          ]
        }
      }
      ,
      {
        label: 'URL', key: 'databaseurl', require: true, span: 24,
        values: {
          link: 'drivertype', data: [
            {case: '-10301', value: 'jdbc:oracle:thin:@:1521:'},
            {case: '-10302', value: 'jdbc:mysql://:3306/mysql'},
            {case: '-10303', value: 'jdbc:microsoft:sqlserver://:1433'},
            {case: '-10304', value: 'jdbc:sqlserver://:1433'},
            {case: '-10305', value: 'jdbc:sybase:Tds::5000'},
            {case: '-10306', value: 'jdbc:teradata:///TMODE=TERA,CHARSET=ASCII,CLIENT_CHARSET=cp936,DATABASE='},
          ]
        }
      },
      {label: 'SID', key: 'oraclesid', show: {link: 'drivertype', value: '-10301'}, span: 24},

      {label: '其它信息', key: '-', type: 'divider'},
      {
        label: '专业', key: 'progkey', require: true, type: 'select', select: {
          api: 'databaseDicList',
          body: {dicTypeCode: DICT_TYPE.RESOURCE_SUBJECT},
          key: 'id',
          name: 'dicName'
        }
      },
      {
        label: '所在城市', key: 'areakey', type: 'select', select: {
          api: 'databaseDicList',
          body: {dicTypeCode: DICT_TYPE.CITY},
          key: 'id',
          name: 'dicName'
        }
      },
      {label: '描述', key: 'astDesc'},

      {label: '资产类型', key: 'astType', value: DICT_TYPE.DATABASE, type: 'hide'},
    ]
  }
};
