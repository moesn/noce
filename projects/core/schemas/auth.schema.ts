export const NM_AUTH_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "应用认证配置",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "$schema": {
        "type": "string",
        "minLength": 1
      },
      "title": {
        "description": "登录页面系统标题",
        "type": "string"
      },
      "keepAlive": {
        "description": "关闭浏览器后是否保持登录状态",
        "type": "boolean",
        "default": false
      },
      "baseUrl": {
        "description": "认证相关接口共同的地址前缀",
        "type": "string"
      },
      "login": {
        "description": "登录接口配置",
        "$ref": "#/definitions/login"
      },
      "logout": {
        "description": "登出接口配置",
        "$ref": "#/definitions/api"
      },
      "vercode": {
        "description": "获取验证码接口配置",
        "$ref": "#/definitions/api"
      },
      "refresh": {
        "description": "刷新认证接口配置",
        "$ref": "#/definitions/refresh"
      },
      "interceptor": {
        "description": "http拦截器配置",
        "type": "object",
        "properties": {
          "token": {
            "description": "请求头token配置",
            "type": "object",
            "properties": {
              "key": {
                "description": "请求头token的key",
                "type": "string",
                "minLength": 1,
                "default": "Author"
              },
              "prefix": {
                "description": "请求头token的前缀配置",
                "type": "string",
                "default": "Bearer"
              }
            },
            "default": {}
          },
          "ignoreUrls": {
            "description": "不需要认证的接口",
            "type": "array",
            "default": []
          }
        },
        "default": {}
      },
      "success": {
        "description": "认证成功后返回数据key配置",
        "type": "object",
        "properties": {
          "accessTokenKey": {
            "description": "访问token的key",
            "type": "string",
            "minLength": 1,
            "default": "data.token"
          },
          "refreshTokenKey": {
            "description": "刷新token的key",
            "type": "string",
            "minLength": 1,
            "default": "data.retoken"
          },
          "redirectKey": {
            "description": "重定向key",
            "type": "string",
            "minLength": 1,
            "default": "data.redirect"
          }
        },
        "default": {}
      }
    },
    "required": [
      "$schema",
      "login",
      "logout",
      "refresh"
    ],
    "definitions": {
      "login": {
        "type": "object",
        "$ref": "#/definitions/api",
        "properties": {
          "body": {
            "description": "请求参数",
            "type": "object",
            "properties": {
              "accKey": {
                "description": "账号key",
                "type": "string",
                "minLength": 1,
                "default": "username"
              },
              "pwdKey": {
                "description": "密码key",
                "type": "string",
                "minLength": 1,
                "default": "password"
              },
              "verKey": {
                "description": "验证码key",
                "type": "string",
                "minLength": 1,
                "default": "vercode"
              }
            }
          }
        }
      },
      "refresh": {
        "type": "object",
        "$ref": "#/definitions/api",
        "properties": {
          "body": {
            "description": "请求参数",
            "type": "object",
            "properties": {
              "accessTokenKey": {
                "description": "访问token的key",
                "type": "string",
                "minLength": 1,
                "default": "token"
              },
              "refreshTokenKey": {
                "description": "刷新token的key",
                "type": "string",
                "minLength": 1,
                "default": "retoken"
              }
            }
          }
        }
      },
      "api": {
        "description": "接口配置",
        "type": "object",
        "properties": {
          "url": {
            "description": "接口地址",
            "type": "string",
            "minLength": 1
          },
          "method": {
            "description": "接口调用方式",
            "enum": [
              "post",
              "get"
            ],
            "default": "post"
          }
        },
        "required": [
          "url"
        ]
      }
    }
  }

