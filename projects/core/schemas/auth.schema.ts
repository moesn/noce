export const NM_AUTH_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "title": "认证配置",
    "type": "object",

    "properties": {
      "$schema": {
        "type": "string",
        "minLength": 1
      },
      "title": {
        "title": "登录页面系统标题",
        "type": "string"
      },
      "keepAlive": {
        "title": "关闭浏览器后是否保持登录状态",
        "type": "boolean",
        "default": false
      },
      "baseUrl": {
        "title": "认证接口共同的地址前缀",
        "type": "string"
      },
      "login": {
        "title": "登录接口配置",
        "$ref": "#login"
      },
      "logout": {
        "title": "登出接口配置",
        "$ref": "#api"
      },
      "passwd": {
        "title": "修改密码配置",
        "$ref": "#passwd"
      },
      "vercode": {
        "title": "获取验证码接口配置",
        "$ref": "#api"
      },
      "refresh": {
        "title": "刷新认证接口配置",
        "$ref": "#refresh"
      },
      "interceptor": {
        "title": "http拦截器配置",
        "type": "object",

        "properties": {
          "token": {
            "title": "请求头token配置",
            "type": "object",

            "properties": {
              "key": {
                "title": "请求头token的key",
                "type": "string",
                "minLength": 1,
                "default": "Author"
              },
              "prefix": {
                "title": "请求头token的前缀配置",
                "type": "string",
                "default": "Bearer"
              }
            },
            "default": {}
          },
          "ignoreUrls": {
            "title": "不需要认证拦截的接口",
            "type": "array",
            "default": []
          }
        },
        "default": {}
      },
      "success": {
        "title": "认证成功后返回数据key配置",
        "type": "object",

        "properties": {
          "accessTokenKey": {
            "title": "访问token的key",
            "type": "string",
            "minLength": 1,
            "default": "data.access_token"
          },
          "refreshTokenKey": {
            "title": "刷新token的key",
            "type": "string",
            "minLength": 1,
            "default": "data.refresh_token"
          },
          "redirectKey": {
            "title": "重定向key",
            "type": "string",
            "minLength": 1,
            "default": "data.redirect"
          },
          "vercodeKey": {
            "title": "返回二维码的key",
            "type": "string",
            "minLength": 1,
            "default": "data"
          }
        },
        "default": {}
      },
      "payload": {
        "title": "认证成功后返回token内容",
        "type": "object",

        "properties": {
          "userIdKey": {
            "title": "用户ID的key",
            "type": "string",
            "minLength": 1,
            "default": "user_id"
          },
          "usernameKey": {
            "title": "用于显示的用户名的key",
            "type": "string",
            "minLength": 1,
            "default": "username"
          }
        },
        "default": {}
      }
    },
    "required": [
      "$schema",
      "login",
      "logout",
      "passwd",
      "refresh"
    ],
    "definitions": {
      "login": {
        "$id": "#login",
        "type": "object",
        "$ref": "#api",

        "properties": {
          "body": {
            "title": "请求参数",
            "type": "object",

            "properties": {
              "accKey": {
                "title": "账号key",
                "type": "string",
                "minLength": 1,
                "default": "username"
              },
              "pwdKey": {
                "title": "密码key",
                "type": "string",
                "minLength": 1,
                "default": "password"
              },
              "verKey": {
                "title": "验证码key",
                "type": "string",
                "minLength": 1,
                "default": "vercode"
              }
            }
          }
        },
        "required": [
          "body"
        ]
      },
      "passwd": {
        "$id": "#passwd",
        "type": "object",

        "properties": {
          "url": {
            "title": "接口地址",
            "type": "string",
            "minLength": 1
          },
          "body": {
            "title": "请求参数",
            "type": "object",

            "properties": {
              "oldKey": {
                "title": "旧密码key",
                "type": "string",
                "minLength": 1,
                "default": "oldpwd"
              },
              "newKey": {
                "title": "新密码key",
                "type": "string",
                "minLength": 1,
                "default": "newpwd"
              },
              "idKey": {
                "title": "用户名key",
                "type": "string",
                "minLength": 1,
                "default": "username"
              }
            }
          }
        },
        "required": [
          "url",
          "body"
        ]
      },
      "refresh": {
        "$id": "#refresh",
        "type": "object",
        "$ref": "#api",

        "properties": {
          "body": {
            "title": "请求参数",
            "type": "object",

            "properties": {
              "accessTokenKey": {
                "title": "访问token的key",
                "type": "string",
                "minLength": 1,
                "default": "access_token"
              },
              "refreshTokenKey": {
                "title": "刷新token的key",
                "type": "string",
                "minLength": 1,
                "default": "refresh_token"
              }
            }
          }
        },
        "required": [
          "body"
        ]
      },
      "api": {
        "$id": "#api",
        "title": "接口配置",
        "type": "object",

        "properties": {
          "url": {
            "title": "接口地址",
            "type": "string",
            "minLength": 1
          },
          "method": {
            "title": "接口调用方式",
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



