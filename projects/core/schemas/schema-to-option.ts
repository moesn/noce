import Ajv from "ajv"
import localize from "ajv-i18n"
import {forEach} from "lodash-es";
import {getValueFromObject, objectExtend} from 'noce/helper';
import {NM_APP_SCHEMA} from './app.schema';
import {NM_AUTH_SCHEMA} from './auth.schema';
import {NM_PAGE_SCHEMA} from './page.schema';

const SCHEMAS = {
  app_schema: NM_APP_SCHEMA,
  auth_schema: NM_AUTH_SCHEMA,
  page_schema: NM_PAGE_SCHEMA
}; // ts版配置

let OPTIONS: any = {
  app: {},
  auth: {},
  page: {}
}; // 缓存应用/认证/页面选项

// 将配置文件转换为配置选项
export function schemaToOption(path: string): any {
  let options: any = {};

  // 通过Http请求获取配置文件
  const xhr = new XMLHttpRequest();
  xhr.open("GET", path, false);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status == 0) {
        try {
          options = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  xhr.send(null);

  // 验证和编译配置文件
  compieAndValidate(options, options.$schema);

  // 删除$schema
  delete options.$schema;
  console.log(options)
  return options;
}

// 验证和编译配置文件
function compieAndValidate(data: any, schemaPath: string) {
  let schema = {};

  if (schemaPath) {
    // 处理schema路径，转换后xx_xx_app_schema_json
    const scmpath = schemaPath.split('/').join('_');

    // 匹配对应的schema模版
    forEach(SCHEMAS, (scm, key) => {
      if (scmpath.includes(key)) {
        schema = scm;
        // 缓存配置项, key：app_schema
        OPTIONS[key.split('_')[0]] = data;
      }
    })
  }

  // 使用默认值，强制类型转换
  const ajv = new Ajv({useDefaults: true, coerceTypes: true});

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    // 将错误翻译成中文
    localize.zh(validate.errors)
    throw new Error(ajv.errorsText(validate.errors))
  }
}

// 获取应用选项
export function getAppOption(key: string): any {
  return getValueFromObject(OPTIONS.app, key);
}

// 获取认证选项
export function getAuthOption(key: string): any {
  return getValueFromObject(OPTIONS.auth, key);
}

// 获取页面选项
export function getPageOption(key: string): any {
  return getValueFromObject(OPTIONS.page, key);
}

// 设置页面选项
export function setPageOption(option: any): any {
  objectExtend(OPTIONS.page, option);
}

