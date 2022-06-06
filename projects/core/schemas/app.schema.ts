export const NM_APP_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "全局配置",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "$schema": {
        "type": "string"
      },
      "title": {
        "description": "应用名称",
        "type": "string"
      },
      "home": {
        "description": "首页路由地址",
        "type": "string"
      },
      "base": {
        "description": "路由基础路径",
        "type": "string",
        "default": "page"
      },
      "beian": {
        "title": "备案号",
        "type": "string"
      },
      "images": {
        "description": "logo、背景等图片",
        "$ref": "#/definitions/images",
        "default": {}
      },
      "apis": {
        "description": "功能页面可用服务接口查询",
        "$ref": "#/definitions/api"
      },
      "layout": {
        "description": "布局",
        "$ref": "#/definitions/layout"
      },
      "encryptMode": {
        "description": "数据加密模式",
        "enum": [
          "rsa",
          "base64"
        ],
        "default": "rsa"
      },
      "pubKey": {
        "description": "数据加密公钥",
        "type": "string"
      },
      "okCode": {
        "description": "接口相应正确时的状态码",
        "type": [
          "string",
          "number"
        ],
        "default": "0"
      },
      "console": {
        "title": "是否在F12控制台打印日志",
        "type": "boolean",
        "default": false
      }
    },
    "required": [
      "$schema",
      "title",
      "layout",
      "pubKey"
    ],
    "definitions": {
      "images": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "logo": {
            "description": "左上角logo图标地址",
            "type": "string",
            "default": "/assets/images/logo.png"
          },
          "background": {
            "description": "登录页面背景图片",
            "type": "string",
            "default": "/assets/images/bg.png"
          }
        }
      },
      "layout": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "navApi": {
            "description": "顶部导航菜单接口",
            "$ref": "#/definitions/api"
          },
          "menuApi": {
            "description": "左侧导航菜单接口",
            "$ref": "#/definitions/api"
          },
          "menuWidth": {
            "description": "左侧导航菜单宽度",
            "type": "number",
            "default": 200
          },
          "menuMode": {
            "description": "左侧导航菜单宽度",
            "enum": [
              "vertical",
              "horizontal",
              "inline"
            ],
            "default": "vertical"
          }
        }
      },
      "api": {
        "description": "接口配置",
        "type": "object",
        "additionalProperties": false,
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
