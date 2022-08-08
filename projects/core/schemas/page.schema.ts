export const NM_PAGE_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "$page",
    "title": "页面配置",
    "description": "支持表格、表单、列表、树等，examples里是关键字说明",
    "examples": [
      "apis：api接口配置时的关键字，例：apis.userlist",
      "$*$：动态参数时使用",
      "this：设置动态参数时的关键字",
      "that：设置动态参数时的关键字，从浏览器storage里面取值",
      "this.data：当前操作的数据",
      "this.user：当前登录的用户Token里的Payload数据",
      "this.params：当前表格查询参数",
      "this.nav：导航+表格时，当前操作的导航数据",
      "this.tab：多标签表格时，当前标签数据",
      "例：$this.data.id$",
      "$*：1、树形结构的上级名称时使用"
    ],
    "type": "object",

    "properties": {
      "$schema": {
        "type": "string"
      },
      "apis": {
        "title": "接口列表",
        "description": "APP配置从服务端获取接口列表时，此处配置失效",
        "type": "object",
        "default": {}
      },
      "table": {
        "title": "右侧表格",
        "$ref": "#table"
      },
      "tabs": {
        "title": "表格标签",
        "$ref": "#tabs"
      },
      "navs": {
        "title": "左侧导航",
        "$ref": "#navs"
      }
    },
    "required": [
      "table"
    ],
    "definitions": {
      "table": {
        "$id": "#table",
        "title": "表格配置",
        "type": "object",
        "required": [
          "view"
        ],

        "properties": {
          "title": {
            "title": "表格标题",
            "type": "string",
            "minLength": 1
          },
          "style": {
            "title": "表格样式配置",
            "type": "object",

            "properties": {
              "titleId": {
                "title": "表格标题ID",
                "type": "string",
                "minLength": 1
              },
              "titleColor": {
                "$id": "#color",
                "title": "表格标题颜色",
                "enum": [
                  "default",
                  "green",
                  "blue",
                  "yellow",
                  "orange",
                  "red",
                  "disabled"
                ]
              }
            }
          },
          "idKey": {
            "title": "数据主键",
            "type": "string",
            "default": "id",
            "minLength": 1
          },
          "view": {
            "title": "表格视图配置",
            "type": "object",
            "required": [
              "columns"
            ],

            "allOf": [
              {
                "title": "查询接口地址",
                "$ref": "#post"
              },
              {
                "properties": {
                  "pageSize": {
                    "title": "每页显示条数",
                    "type": "integer",
                    "default": 10,
                    "multipleOf": 5,
                    "minimum": 5
                  },
                  "width": {
                    "title": "表格作为弹窗时的宽度",
                    "$ref": "#width",
                    "default": 560
                  },
                  "reload": {
                    "title": "是否可以重新加载页面",
                    "type": "boolean",
                    "default": true
                  },
                  "query": {
                    "title": "编辑完成后是否重新查询数据",
                    "type": "boolean",
                    "default": false
                  },
                  "singlePage": {
                    "title": "是否不分页",
                    "type": "boolean",
                    "default": false
                  },
                  "showIndex": {
                    "title": "是否显示序号",
                    "type": "boolean",
                    "default": false
                  },
                  "checkable": {
                    "title": "是否显示选择列",
                    "type": "boolean",
                    "default": false
                  },
                  "multiple": {
                    "title": "是否支持多选",
                    "$ref": "#parseBool",
                    "default": true
                  },
                  "setSearch": {
                    "title": "是否支持指定字段搜索",
                    "type": "boolean",
                    "default": true
                  },
                  "parseData": {
                    "title": "解析数据",
                    "description": "表格渲染之前对数据进行处理",
                    "$ref": "#parse"
                  },
                  "columns": {
                    "title": "表格列",
                    "description": "表格每列显示配置",
                    "type": "array",
                    "uniqueItems": true,
                    "items": {
                      "type": "object",

                      "properties": {
                        "type": {
                          "title": "表格列类型",
                          "enum": [
                            "text",
                            "icon",
                            "switch",
                            "select",
                            "action",
                            "image"
                          ]
                        },
                        "label": {
                          "title": "表格表头文字",
                          "type": "string"
                        },
                        "key": {
                          "title": "表格数据字段",
                          "type": "string",
                          "minLength": 1
                        },
                        "tip": {
                          "title": "表头说明",
                          "type": "string",
                          "minLength": 1
                        },
                        "tipKey": {
                          "title": "列表项提示字段",
                          "type": "string",
                          "minLength": 1
                        },
                        "width": {
                          "title": "表格宽度",
                          "type": "string",
                          "pattern": "^0|[0-9]+(px|%)$"
                        },
                        "ellipsis": {
                          "title": "超长数据省略显示",
                          "description": "超过最大显示长度时省略显示，鼠标移动上去会显示完整数据",
                          "type": "integer",
                          "default": 20
                        },
                        "show": {
                          "title": "是否显示表格列",
                          "$ref": "#parseBool",
                          "default": true
                        },
                        "switch": {
                          "title": "开关切换",
                          "type": "object",
                          "required": [
                            "enable",
                            "disable"
                          ],

                          "properties": {
                            "enable": {
                              "$ref": "#delete",
                              "title": "开的接口"
                            },
                            "disable": {
                              "$ref": "#delete",
                              "title": "关的接口"
                            },
                            "on": {
                              "title": "开的值",
                              "type": [
                                "boolean",
                                "integer",
                                "string"
                              ],
                              "default": true
                            },
                            "off": {
                              "title": "关的值",
                              "type": [
                                "boolean",
                                "integer",
                                "string"
                              ],
                              "default": false
                            },
                            "labelOn": {
                              "title": "开的文字标签",
                              "type": "string",
                              "default": "启用"
                            },
                            "labelOff": {
                              "title": "关的文字标签",
                              "type": "string",
                              "default": "禁用"
                            },
                            "readonly": {
                              "title": "是否不可以操作",
                              "$ref": "#parseBool"
                            }
                          }
                        },
                        "select": {
                          "title": "选择切换",
                          "type": "object",
                          "required": [
                            "options"
                          ],

                          "allOf": [
                            {
                              "title": "切换接口",
                              "$ref": "#post"
                            },
                            {
                              "properties": {
                                "options": {
                                  "title": "切换的选项",
                                  "type": "array",
                                  "uniqueItems": true,
                                  "minItems": 2,
                                  "items": {
                                    "type": "object",
                                    "required": [
                                      "label",
                                      "value"
                                    ],

                                    "properties": {
                                      "label": {
                                        "title": "选项显示的标签",
                                        "type": "string"
                                      },
                                      "value": {
                                        "title": "选项提交到后台的值",
                                        "type": [
                                          "boolean",
                                          "string",
                                          "array",
                                          "number"
                                        ]
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        },
                        "image": {
                          "title": "图片列",
                          "type": "object",

                          "properties": {
                            "upload": {
                              "title": "是否可上传图片",
                              "$ref": "#upload"
                            }
                          }
                        },
                        "action": {
                          "title": "自定义表格操作列",
                          "$ref": "#action"
                        },
                        "format": {
                          "title": "表格数据格式化",
                          "oneOf": [
                            {
                              "enum": [
                                "date",
                                "time",
                                "datetime",
                                "size"
                              ]
                            },
                            {
                              "$ref": "#format"
                            }
                          ],
                          "minLength": 1
                        },
                        "search": {
                          "title": "是否可搜索",
                          "description": "当前字段是否支持搜索",
                          "type": "boolean",
                          "default": false
                        },
                        "sort": {
                          "title": "是否可排序",
                          "description": "当前字段是否支持排序",
                          "type": "boolean",
                          "default": false
                        },
                        "filters": {
                          "title": "筛选项设置",
                          "oneOf": [
                            {
                              "type": "array",
                              "uniqueItems": true,
                              "minItems": 2,
                              "items": {
                                "type": "object",
                                "required": [
                                  "text",
                                  "value"
                                ],

                                "properties": {
                                  "text": {
                                    "title": "选项显示的文字",
                                    "type": "string"
                                  },
                                  "value": {
                                    "title": "选项提交到后台的值",
                                    "type": "string"
                                  }
                                }
                              }
                            },
                            {
                              "type": "object",
                              "required": [
                                "textKey",
                                "valueKey"
                              ],

                              "allOf": [
                                {
                                  "title": "查询接口地址",
                                  "$ref": "#post"
                                },
                                {
                                  "properties": {
                                    "textKey": {
                                      "title": "选项显示的字段",
                                      "type": "string",
                                      "minLength": 1
                                    },
                                    "valueKey": {
                                      "title": "选项提交到后台的字段",
                                      "type": "string",
                                      "minLength": 1
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        "tabIndex": {
                          "$id": "#tabIndex",
                          "title": "标签索引",
                          "description": "标记在哪些标签时显示当前字段，不配置时默认所有字段",
                          "oneOf": [
                            {
                              "type": "integer",
                              "minimum": 0
                            },
                            {
                              "type": "array",
                              "minItems": 2,
                              "items": {
                                "type": "integer",
                                "minimum": 0
                              }
                            }
                          ]
                        },
                        "icon": {
                          "title": "显示图标",
                          "type": "string"
                        },
                        "color": {
                          "title": "显示颜色",
                          "oneOf": [
                            {
                              "$ref": "#color"
                            },
                            {
                              "$ref": "#format"
                            }
                          ],
                          "default": "default"
                        }
                      },
                      "allOf": [
                        {
                          "if": {
                            "properties": {
                              "type": {
                                "const": "text"
                              }
                            }
                          },
                          "then": {}
                        },
                        {
                          "if": {
                            "properties": {
                              "type": {
                                "const": "icon"
                              }
                            }
                          },
                          "then": {
                            "required": [
                              "icon"
                            ]
                          }
                        },
                        {
                          "if": {
                            "properties": {
                              "type": {
                                "const": "image"
                              }
                            }
                          },
                          "then": {
                            "required": [
                              "image"
                            ]
                          }
                        },
                        {
                          "if": {
                            "properties": {
                              "type": {
                                "const": "action"
                              }
                            }
                          },
                          "then": {
                            "required": [
                              "action"
                            ]
                          }
                        },
                        {
                          "if": {
                            "properties": {
                              "type": {
                                "const": "switch"
                              }
                            }
                          },
                          "then": {
                            "required": [
                              "switch"
                            ],
                            "properties": {
                              "width":{
                                "default": "80px"
                              }
                            }
                          }
                        },
                        {
                          "if": {
                            "properties": {
                              "type": {
                                "const": "select"
                              }
                            }
                          },
                          "then": {
                            "required": [
                              "select"
                            ]
                          }
                        },
                        {
                          "if": {},
                          "then": {
                            "required": [
                              "type",
                              "label",
                              "key"
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            ]
          },
          "form": {
            "$ref": "#form"
          },
          "create": {
            "title": "新增接口",
            "$ref": "#post"
          },
          "update": {
            "$id": "#update",
            "title": "修改接口",
            "type": "object",

            "allOf": [
              {
                "title": "修改接口地址",
                "$ref": "#post"
              },
              {
                "properties": {
                  "name": {
                    "default": "修改"
                  }
                }
              }
            ]
          },
          "delete": {
            "$id": "#delete",
            "title": "删除接口",
            "type": "object",

            "allOf": [
              {
                "title": "删除接口地址",
                "$ref": "#post"
              },
              {
                "properties": {
                  "body": {
                    "title": "删除接口参数",
                    "$ref": "#body",
                    "default": {
                      "ids": [
                        "$this.data[this.idKey]$"
                      ]
                    }
                  },
                  "name": {
                    "default": "删除"
                  }
                }
              }
            ]
          },
          "timeKey":{
            "title": "数据的时间字段",
            "description": "可通过此字段设置时间范围过滤数据",
            "type": "string",
            "minLength": 1
          },
          "dragSort": {
            "title": "表格拖拽排序",
            "$ref": "#post"
          },
          "upload": {
            "title": "数据上传",
            "$id": "#upload",
            "type": "object",

            "allOf": [
              {
                "title": "上传接口地址",
                "$ref": "#post"
              },
              {
                "properties": {
                  "tip": {
                    "title": "按钮说明",
                    "type": "string",
                    "minLength": 1,
                    "default": "上传"
                  },
                  "buttonText": {
                    "title": "上传选择按钮文字",
                    "type": "string",
                    "minLength": 1,
                    "default": "选择文件"
                  },
                  "accept": {
                    "title": "支持的上传类型",
                    "type": "array",
                    "default": [".xlsx"]
                  }
                }
              }
            ]
          },
          "download": {
            "$id": "#download",
            "title": "数据下载",
            "type": "object",

            "allOf": [
              {
                "title": "下载接口地址",
                "$ref": "#post"
              },
              {
                "properties": {
                  "tip": {
                    "title": "按钮说明",
                    "type": "string",
                    "minLength": 1,
                    "default": "下载"
                  },
                  "blob": {
                    "title": "是否是流下载",
                    "type": "boolean",
                    "default": false
                  },
                  "filename": {
                    "title": "下载文件名称",
                    "type": "string"
                  }
                }
              }
            ]
          },
          "template": {
            "title": "模版下载",
            "$ref": "#download"
          },
          "actions": {
            "title": "表格操作按钮扩展",
            "type": "array",
            "items": {
              "$id": "#action",
              "type": "object",
              "oneOf": [
                {
                  "required": [
                    "icon",
                    "tip",
                    "click"
                  ]
                },
                {
                  "required": [
                    "icon",
                    "hover"
                  ]
                }
              ],

              "properties": {
                "icon": {
                  "title": "按钮图标",
                  "type": "string",
                  "minLength": 1
                },
                "iconOnly": {
                  "title": "是否只显示图标",
                  "description": "有的表格操作列需要显示值+图标",
                  "type": "boolean",
                  "default": true
                },
                "show": {
                  "title": "是否显示操作按钮",
                  "$ref": "#parseBool",
                  "default": true
                },
                "tip": {
                  "title": "按钮说明",
                  "type": "string",
                  "minLength": 1
                },
                "color": {
                  "title": "显示颜色",
                  "$ref": "#color",
                  "default": "default"
                },
                "confirm": {
                  "title": "操作确认提示信息",
                  "anyOf": [
                    {
                      "type": "string",
                      "minLength": 1
                    },
                    {
                      "$ref": "#format"
                    }
                  ]
                },
                "click": {
                  "title": "点击后触发的行为",
                  "oneOf": [
                    {
                      "allOf": [
                        {
                          "title": "仅调用接口",
                          "type": "object",

                          "properties": {
                            "params": {
                              "title": "是否提交表格查询参数",
                              "type": "boolean"
                            },
                            "refresh": {
                              "title": "操作成功后是否刷新数据",
                              "type": "boolean"
                            },
                            "checkToClick": {
                              "title": "是否需要选择数据",
                              "description": "true时需要选择了数据后才可以点击",
                              "type": "boolean"
                            }
                          }
                        },
                        {
                          "title": "仅需要调用固定接口",
                          "$ref": "#post"
                        }
                      ]
                    },
                    {
                      "title": "弹出新页面",
                      "type": "object",
                      "required": [
                        "table"
                      ],

                      "properties": {
                        "table": {
                          "title": "右侧表格",
                          "$ref": "#table"
                        },
                        "tabs": {
                          "title": "表格标签",
                          "$ref": "#tabs"
                        },
                        "navs": {
                          "title": "表格导航",
                          "$ref": "#navs"
                        }
                      }
                    },
                    {
                      "title": "弹出新表单",
                      "type": "object",
                      "required": [
                        "form",
                        "update"
                      ],
                      "properties": {
                        "form": {
                          "title": "抽屉表单",
                          "$ref": "#form"
                        },
                        "update": {
                          "title": "表单接口",
                          "$ref": "#post"
                        }
                      }
                    },
                    {
                      "title": "弹出自定义页面",
                      "type": "object",
                      "required": [
                        "component"
                      ],

                      "properties": {
                        "component": {
                          "title": "自定义的组件",
                          "type": "string"
                        },
                        "width": {
                          "title": "弹窗宽度",
                          "$ref": "#width"
                        },
                        "apis": {
                          "title": "自定义页面用到的接口",
                          "type": "object"
                        }
                      }
                    }
                  ]
                },
                "hover": {
                  "title": "鼠标划过后触发的行为",
                  "type": "object",

                  "properties": {
                    "key": {
                      "title": "鼠标划过显示的字段",
                      "type": "string",
                      "minLength": 1
                    }
                  }
                }
              }
            }
          }
        },
        "dependencies": {
          "create": [
            "update",
            "form"
          ],
          "update": [
            "create",
            "form"
          ],
          "form": [
            "create",
            "update"
          ]
        }
      },
      "form": {
        "$id": "#form",
        "title": "表单配置",
        "description": "可配置多个表单",
        "type": "array",
        "uniqueItems": true,
        "minItems": 1,
        "items": {
          "title": "表单配置项",
          "description": "width、cols如需配置，请在第一个表单里配置",
          "type": "object",
          "required": [
            "fields"
          ],

          "properties": {
            "title": {
              "title": "表单标题",
              "type": "string",
              "minLength": 1
            },
            "width": {
              "$id": "#width",
              "title": "表单宽度",
              "anyOf": [
                {
                  "enum": [
                    360,
                    480,
                    560,
                    720,
                    960,
                    "50%",
                    "100%"
                  ]
                },
                {
                  "type": "number"
                }
              ]
            },
            "cols": {
              "title": "表单列数",
              "enum": [
                1,
                2,
                3,
                4,
                6
              ],
              "default": 1
            },
            "tip": {
              "title": "表单说明提示",
              "type": "string",
              "minLength": 1
            },
            "beforeOpen": {
              "title": "表单编辑前数据处理",
              "$ref": "#parse"
            },
            "beforeSave": {
              "title": "表单保存前数据处理",
              "$ref": "#parse"
            },
            "fields": {
              "description": "表单字段",
              "type": "array",
              "uniqueItems": true,
              "minItems": 1,
              "items": {
                "title": "表单字段属性设置",
                "type": "object",

                "properties": {
                  "type": {
                    "title": "表单项类型",
                    "enum": [
                      "text",
                      "input",
                      "textarea",
                      "number",
                      "password",
                      "switch",
                      "tree",
                      "select",
                      "treeselect",
                      "modal",
                      "datetime",
                      "date",
                      "time",
                      "cron"
                    ]
                  },
                  "label": {
                    "title": "表单项标签",
                    "type": "string",
                    "minLength": 1
                  },
                  "key": {
                    "title": "表单项数据字段",
                    "type": "string",
                    "minLength": 1
                  },
                  "value": {
                    "title": "表单项默认值",
                    "type": [
                      "boolean",
                      "string",
                      "number",
                      "array"
                    ]
                  },
                  "span": {
                    "title": "表单项跨度",
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 24
                  },
                  "required": {
                    "title": "表单项是否必填",
                    "$ref": "#parseBool"
                  },
                  "readonly": {
                    "title": "表单项是否只读",
                    "$ref": "#parseBool"
                  },
                  "show": {
                    "title": "是否显示表单",
                    "$ref": "#parseBool",
                    "default": true
                  },
                  "tip": {
                    "title": "表单项说明提示",
                    "type": "string",
                    "minLength": 1
                  },
                  "input": {
                    "title": "普通输入框专属配置",
                    "type": "object",

                    "properties": {
                      "minLength": {
                        "title": "最小输入文字数量",
                        "type": "integer",
                        "default": 1
                      },
                      "maxLength": {
                        "title": "最大输入文字数量",
                        "type": "integer",
                        "default": 32
                      },
                      "change": {
                        "title": "输入变化事件",
                        "$ref": "#parse"
                      }
                    }
                  },
                  "pattern": {
                    "title": "内置正则校验",
                    "oneOf": [
                      {
                        "enum": [
                          "任意",
                          "字母",
                          "数字",
                          "汉字",
                          "字符",
                          "名称",
                          "密码",
                          "字母数字",
                          "身份证",
                          "手机号码",
                          "座机号码",
                          "邮箱",
                          "URL",
                          "IP",
                          "IP段",
                          "多IP段",
                          "IPV4",
                          "IPV6",
                          "MAC",
                          "..."
                        ]
                      },
                      {
                        "title": "自定义正则校验",
                        "type": "object",
                        "required": [
                          "name",
                          "reg"
                        ],

                        "properties": {
                          "name": {
                            "title": "正则表达式名称",
                            "type": "string",
                            "minLength": 1
                          },
                          "tip": {
                            "title": "输入提示",
                            "type": "string",
                            "minLength": 1,
                            "examples": [
                              "请输入有效的**"
                            ]
                          },
                          "reg": {
                            "title": "正则表达式",
                            "type": "string",
                            "pattern": "^\\^.+\\$$"
                          }
                        }
                      }
                    ],
                    "default": "任意"
                  },
                  "number": {
                    "title": "数字输入框专属配置",
                    "type": "object",

                    "properties": {
                      "min": {
                        "title": "最小输入数字",
                        "type": "integer",
                        "default": -9007199254740991
                      },
                      "max": {
                        "title": "最大输入数字",
                        "type": "integer",
                        "default": 9007199254740991
                      }
                    }
                  },
                  "switch": {
                    "title": "开关切换",
                    "type": "object",
                    "required": [
                      "labelOn",
                      "labelOff"
                    ],

                    "properties": {
                      "labelOn": {
                        "title": "开的文字标签",
                        "type": "string",
                        "default": "启用"
                      },
                      "labelOff": {
                        "title": "关的文字标签",
                        "type": "string",
                        "default": "禁用"
                      }
                    }
                  },
                  "tree": {
                    "title": "树型表单",
                    "description": "用于类似功能菜单授权的选择",
                    "type": "object",
                    "required": [
                      "all",
                      "nameKey"
                    ],

                    "properties": {
                      "all": {
                        "title": "所有数据查询接口地址",
                        "$ref": "#post"
                      },
                      "checked": {
                        "title": "已选数据查询接口地址",
                        "$ref": "#post"
                      },
                      "nameKey": {
                        "title": "用于展示的字段",
                        "type": "string",
                        "minLength": 1
                      },
                      "rootValue": {
                        "title": "根节点的值",
                        "type": [
                          "integer",
                          "string"
                        ],
                        "default": 0
                      },
                      "idKey": {
                        "title": "节点关键字段",
                        "type": "string",
                        "default": "id",
                        "minLength": 1
                      },
                      "parentKey": {
                        "title": "父节点关键字段",
                        "type": "string",
                        "default": "pid",
                        "minLength": 1
                      },
                      "expandAll": {
                        "title": "是否展开所有节点",
                        "type": "boolean",
                        "default": true
                      }
                    }
                  },
                  "select": {
                    "title": "下拉选择框专属配置",
                    "type": "object",

                    "properties": {
                      "api": {
                        "title": "查询接口地址",
                        "$ref": "#api"
                      },
                      "body": {
                        "title": "查询接口参数",
                        "$ref": "#body"
                      },
                      "parseReq": {
                        "title": "处理数据",
                        "description": "调用服务接口之前处理数据",
                        "$ref": "#parse"
                      },
                      "parseRes": {
                        "title": "处理数据",
                        "description": "调用服务接口之后处理数据",
                        "$ref": "#parse"
                      },
                      "multiple": {
                        "title": "是否多选",
                        "$ref": "#parseBool",
                        "default": false
                      },
                      "options": {
                        "title": "固定选项数据",
                        "type": "array",
                        "uniqueItems": true,
                        "minItems": 2,
                        "items": {
                          "type": "object",
                          "required": [
                            "label",
                            "value"
                          ],

                          "properties": {
                            "label": {
                              "title": "选项显示的标签",
                              "type": "string"
                            },
                            "value": {
                              "title": "选项提交到后台的值",
                              "type": [
                                "boolean",
                                "string",
                                "array",
                                "number"
                              ]
                            }
                          }
                        }
                      },
                      "nameKey": {
                        "title": "用于展示的字段",
                        "anyOf": [
                          {
                            "type": "string",
                            "minLength": 1
                          },
                          {
                            "$ref": "#format"
                          }
                        ]
                      },
                      "valueKey": {
                        "title": "用于关联的字段",
                        "description": "设置为空时，使用整项数据作为值",
                        "type": "string",
                        "default": "id"
                      },
                      "triggerKey": {
                        "title": "通过其他选择框触发查询数据",
                        "type": "string",
                        "minLength": 1
                      },
                      "click": {
                        "title": "切换点击事件",
                        "$ref": "#parse"
                      }
                    },
                    "oneOf": [
                      {
                        "required": [
                          "options"
                        ]
                      },
                      {
                        "required": [
                          "api",
                          "nameKey"
                        ]
                      }
                    ]
                  },
                  "treeselect": {
                    "$id": "#treeselect",
                    "title": "下拉选择框专属配置",
                    "type": "object",
                    "required": [
                      "nameKey"
                    ],

                    "allOf": [
                      {
                        "title": "查询接口地址",
                        "$ref": "#post"
                      },
                      {
                        "properties": {
                          "multiple": {
                            "title": "是否多选",
                            "$ref": "#parseBool",
                            "default": false
                          },
                          "nameKey": {
                            "title": "用于展示的字段",
                            "type": "string",
                            "minLength": 1
                          },
                          "rootValue": {
                            "title": "根节点的值",
                            "type": [
                              "integer",
                              "string"
                            ],
                            "default": 0
                          },
                          "idKey": {
                            "title": "节点关键字段",
                            "type": "string",
                            "default": "id",
                            "minLength": 1
                          },
                          "parentKey": {
                            "title": "父节点关键字段",
                            "type": "string",
                            "default": "pid",
                            "minLength": 1
                          }
                        }
                      }
                    ]
                  },
                  "nameKey": {
                    "title": "表单名称字段",
                    "description": "关联字段中表单数据的名称字段",
                    "type": "string",
                    "minLength": 1
                  },
                  "modal": {
                    "$ref": "#modal"
                  }
                },
                "allOf": [
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "enum": [
                            "input",
                            "password",
                            "textarea"
                          ]
                        }
                      }
                    },
                    "then": {
                      "properties": {
                        "input": {
                          "default": {}
                        }
                      },
                      "required": [
                        "pattern"
                      ]
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "textarea"
                        }
                      }
                    },
                    "then": {
                      "properties": {
                        "input": {
                          "properties": {
                            "maxLength": {
                              "default": 128
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "number"
                        }
                      }
                    },
                    "then": {
                      "properties": {
                        "number": {
                          "default": {}
                        }
                      }
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "switch"
                        }
                      }
                    },
                    "then": {
                      "properties": {
                        "switch": {
                          "default": {}
                        },
                        "value": {
                          "default": true
                        }
                      }
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "select"
                        }
                      }
                    },
                    "then": {
                      "required": [
                        "select"
                      ]
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "tree"
                        }
                      }
                    },
                    "then": {
                      "required": [
                        "tree"
                      ]
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "treeselect"
                        }
                      }
                    },
                    "then": {
                      "required": [
                        "treeselect"
                      ]
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "const": "modal"
                        }
                      }
                    },
                    "then": {
                      "required": [
                        "nameKey",
                        "modal"
                      ]
                    }
                  },
                  {
                    "if": {},
                    "then": {
                      "required": [
                        "type",
                        "label",
                        "key"
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      "navs": {
        "$id": "#navs",
        "title": "导航配置",
        "description": "导航列表或导航树",
        "type": "array",
        "uniqueItems": true,
        "minItems": 1,
        "maxItems": 3,
        "items": {
          "type": "object",
          "required": [
            "type",
            "nameKey",
            "mappingKey"
          ],

          "allOf": [
            {
              "title": "查询接口地址",
              "$ref": "#post"
            },
            {
              "properties": {
                "title": {
                  "title": "导航标题",
                  "type": "string",
                  "minLength": 1
                },
                "type": {
                  "title": "导航类型",
                  "enum": [
                    "list",
                    "tree"
                  ]
                },
                "width": {
                  "title": "导航宽度",
                  "type": "string",
                  "description": "固定宽度100px或百分比宽度10%，在第一个导航里设置",
                  "default": "200px"
                },
                "nameKey": {
                  "title": "用于展示的字段",
                  "type": "string",
                  "minLength": 1
                },
                "rootValue": {
                  "title": "根节点的值",
                  "description": "树型导航专有配置项",
                  "type": [
                    "integer",
                    "string"
                  ],
                  "default": 0
                },
                "idKey": {
                  "title": "数据主键",
                  "type": "string",
                  "default": "id",
                  "minLength": 1
                },
                "parentKey": {
                  "title": "父节点关键字段",
                  "description": "树型导航专有配置项",
                  "type": "string",
                  "default": "pid",
                  "minLength": 1
                },
                "mappingKey": {
                  "title": "映射键",
                  "description": "导航数据主键映射到表格的对应字段",
                  "type": "string",
                  "minLength": 1
                },
                "selected": {
                  "title": "是否默认选中列表项",
                  "type": "boolean",
                  "default": false
                },
                "mustSelect": {
                  "title": "是否必须选中列表项",
                  "type": "boolean",
                  "default": false
                },
                "tabIndex": {
                  "title": "标签索引",
                  "$ref": "#tabIndex",
                  "description": "标记在哪些标签时显示左侧导航，不配置时默认全部"
                },
                "parseData": {
                  "title": "解析数据",
                  "description": "导航渲染之前对数据进行处理",
                  "$ref": "#parse"
                },
                "form": {
                  "$ref": "#form"
                },
                "create": {
                  "$ref": "#post"
                },
                "update": {
                  "$ref": "#update"
                },
                "delete": {
                  "$ref": "#delete"
                },
                "click": {
                  "title": "导航点击事件",
                  "$ref": "#parse"
                }
              }
            },
            {
              "if": {
                "properties": {
                  "type": {
                    "const": "tree"
                  }
                }
              },
              "then": {
              }
            }
          ],
          "dependencies": {
            "create": [
              "update",
              "form"
            ],
            "update": [
              "create",
              "form"
            ],
            "form": [
              "create",
              "update"
            ]
          }
        }
      },
      "tabs": {
        "$id": "#tabs",
        "title": "多表格标签配置",
        "type": "array",
        "uniqueItems": true,
        "minItems": 1,
        "maxItems": 10,
        "items": {
          "$ref": "#table"
        }
      },
      "modal": {
        "$id": "#modal",
        "title": "弹窗",
        "allOf": [
          {
            "title": "弹窗关联配置",
            "type": "object",
            "required": [
              "nameKey"
            ],

            "properties": {
              "nameKey": {
                "title": "弹窗名称字段",
                "description": "关联字段中弹窗数据的名称字段",
                "type": "string",
                "minLength": 1
              },
              "width": {
                "title": "弹窗宽度",
                "oneOf": [
                  {
                    "enum": [
                      360,
                      560,
                      720,
                      960,
                      "50%",
                      "100%"
                    ]
                  }
                ],
                "default": 560
              }
            }
          },
          {
            "oneOf": [
              {
                "$ref": "#table"
              }
            ]
          }
        ]
      },
      "api": {
        "$id": "#api",
        "title": "接口地址",
        "type": "string",
        "pattern": "^apis.[a-zA-Z]+$"
      },
      "body": {
        "$id": "#body",
        "title": "接口参数",
        "description": "用户自定义的接口参数",
        "type": "object",
        "examples": [
          {
            "roleId": "$this.nav.id$",
            "status": "未激活"
          }
        ]
      },
      "format": {
        "$id": "#format",
        "title": "格式化数据",
        "description": "需要return返回数据",
        "type": "string",
        "pattern": "^d=>.+",
        "examples": [
          "d=>d.firstName+d.lastName",
          "d=>{return d.firstName+d.lastName;}"
        ]
      },
      "parse": {
        "$id": "#parse",
        "title": "解析数据",
        "description": "不需要return返回数据",
        "type": "string",
        "pattern": "^d=>.+",
        "examples": [
          "d=>d.name=d.firstName+d.lastName",
          "d=>{d.name=d.fullName;d.age=18}"
        ]
      },
      "parseBool": {
        "$id": "#parseBool",
        "title": "真或假",
        "description": "通过数据来判断时，需要返回true或false",
        "type": [
          "boolean",
          "string"
        ],
        "examples": [
          "d=>d.status===0",
          "d=>{return d.status===0}"
        ],
        "default": false,
        "if": {
          "not": {
            "enum": [
              true,
              false
            ]
          }
        },
        "then": {
          "pattern": "^d=>.+"
        }
      },
      "post": {
        "$id": "#post",
        "title": "服务请求",
        "type": "object",
        "required": [
          "api"
        ],

        "properties": {
          "api": {
            "title": "接口地址",
            "$ref": "#api"
          },
          "method": {
            "title": "接口调用方式",
            "enum": [
              "post",
              "download"
            ],
            "default": "post"
          },
          "blob": {
            "title": "是否是流下载",
            "type": "boolean",
            "default": false
          },
          "icon": {
            "title": "按钮图标"
          },
          "body": {
            "title": "接口参数",
            "$ref": "#body"
          },
          "parseReq": {
            "title": "处理请求数据",
            "description": "调用服务接口之前处理数据",
            "$ref": "#parse"
          },
          "parseRes": {
            "title": "处理响应数据",
            "description": "调用服务接口之后处理数据",
            "$ref": "#parse"
          },
          "successMsg": {
            "title": "成功提示信息",
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  }












