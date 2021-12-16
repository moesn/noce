export const NM_PAGE_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "title": "页面配置",
    "description": "支持表格、表单、列表、树等，examples里是关键字说明",
    "examples": [
      "apis：api接口配置时的关键字，例：apis.userlist",
      "$*$：动态参数时使用",
      "this：设置动态参数时的关键字",
      "this.data：当前操作的数据",
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

        "properties": {
          "title": {
            "title": "表格标题",
            "type": "string",
            "minLength": 1
          },
          "key": {
            "title": "数据主键",
            "type": "string",
            "default": "id",
            "minLength": 1
          },
          "view": {
            "$id": "#view",
            "title": "表格视图配置",
            "type": "object",
            "required": [
              "api",
              "columns"
            ],

            "properties": {
              "api": {
                "title": "查询接口地址",
                "$ref": "#api"
              },
              "body": {
                "title": "查询接口参数",
                "$ref": "#body"
              },
              "ellipsis": {
                "title": "超长数据省略显示",
                "description": "超过最大显示长度时省略显示，鼠标移动上去会显示完整数据",
                "type": "integer",
                "default": 10
              },
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
                "default": 360
              },
              "reload": {
                "title": "是否可以重新加载页面",
                "type": "boolean",
                "default": true
              },
              "frontPagination": {
                "title": "是否前端分页",
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
                        "action"
                      ]
                    },
                    "label": {
                      "title": "表格表头文字",
                      "type": "string",
                      "minLength": 1
                    },
                    "key": {
                      "title": "表格数据字段",
                      "type": "string",
                      "minLength": 1
                    },
                    "width": {
                      "title": "表格宽度",
                      "type": "string",
                      "pattern": "^0|[0-9]+(px|%)$"
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
                          "type": "integer",
                          "default": 1
                        },
                        "off": {
                          "title": "关的值",
                          "type": "integer",
                          "default": 0
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
                        }
                      }
                    },
                    "select": {
                      "title": "选择切换",
                      "type": "object",
                      "required": [
                        "api",
                        "options"
                      ],

                      "properties": {
                        "api": {
                          "$ref": "#api"
                        },
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
                            "api",
                            "textKey",
                            "valueKey"
                          ],

                          "properties": {
                            "api": {
                              "title": "查询接口地址",
                              "$ref": "#api"
                            },
                            "body": {
                              "title": "查询接口参数",
                              "$ref": "#body"
                            },
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
                          "enum": [
                            "default",
                            "green",
                            "blue",
                            "yellow",
                            "orange",
                            "red",
                            "disabled"
                          ]
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
                        ]
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
          },
          "form": {
            "$ref": "#form"
          },
          "create": {
            "$id": "#create",
            "title": "新增接口",
            "type": "object",
            "required": [
              "api"
            ],

            "properties": {
              "api": {
                "title": "新增接口地址",
                "$ref": "#api"
              },
              "body": {
                "title": "增加接口参数",
                "$ref": "#body"
              }
            }
          },
          "update": {
            "$id": "#update",
            "title": "修改接口",
            "type": "object",
            "required": [
              "api"
            ],

            "properties": {
              "api": {
                "title": "修改接口地址",
                "$ref": "#api"
              },
              "body": {
                "title": "修改接口参数",
                "$ref": "#body"
              },
              "name": {
                "default": "修改"
              }
            }
          },
          "delete": {
            "$id": "#delete",
            "title": "删除接口",
            "type": "object",
            "required": [
              "api"
            ],

            "properties": {
              "api": {
                "title": "删除接口地址",
                "$ref": "#api"
              },
              "body": {
                "title": "删除接口参数",
                "$ref": "#body",
                "default": {
                  "ids": [
                    "$this.data[this.key]$"
                  ]
                }
              },
              "name": {
                "default": "删除"
              }
            }
          },
          "timeKey":{
            "title": "数据的时间字段",
            "description": "可通过此字段设置时间范围过滤数据",
            "type": "string",
            "minLength": 1
          },
          "dragSort": {
            "title": "表格拖拽排序",
            "$ref": "#create"
          },
          "upload": {
            "title": "数据上传",
            "type": "object",
            "required": [
              "api"
            ],

            "properties": {
              "api": {
                "title": "上传接口地址",
                "$ref": "#api"
              },
              "tip": {
                "title": "按钮说明",
                "type": "string",
                "minLength": 1,
                "default": "上传"
              }
            }
          },
          "download": {
            "title": "数据下载",
            "type": "object",
            "required": [
              "api"
            ],

            "properties": {
              "api": {
                "title": "下载接口地址",
                "$ref": "#api"
              },
              "tip": {
                "title": "按钮说明",
                "type": "string",
                "minLength": 1,
                "default": "下载"
              }
            }
          },
          "actions": {
            "title": "表格操作按钮扩展",
            "type": "array",
            "items": {
              "$id": "#action",
              "type": "object",
              "required": [
                "icon",
                "tip",
                "click"
              ],

              "properties": {
                "icon": {
                  "title": "按钮图标",
                  "type": "string",
                  "minLength": 1
                },
                "tip": {
                  "title": "按钮说明",
                  "type": "string",
                  "minLength": 1
                },
                "confirm": {
                  "title": "操作确认提示信息",
                  "type": "string",
                  "minLength": 1
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
                          "$ref": "#create"
                        }
                      ]
                    },
                    {
                      "title": "点击后弹出表格",
                      "$ref": "#table",
                      "required": ["view"]
                    }
                  ]
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
              "oneOf": [
                {
                  "enum": [
                    360,
                    560,
                    720,
                    960
                  ]
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
                      "input",
                      "textarea",
                      "number",
                      "password",
                      "switch",
                      "select",
                      "treeselect",
                      "modal",
                      "datetime",
                      "date",
                      "time"
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
                      }
                    }
                  },
                  "pattern": {
                    "title": "内置正则校验",
                    "oneOf": [
                      {
                        "enum": [
                          "字母",
                          "数字",
                          "汉字",
                          "字符",
                          "身份证",
                          "手机号",
                          "邮箱",
                          "URL",
                          "IP",
                          "IP段",
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
                    ]
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
                  "select": {
                    "title": "下拉选择框专属配置",
                    "type": "object",

                    "properties": {
                      "multiple": {
                        "title": "是否多选",
                        "type": "boolean",
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
                      "api": {
                        "title": "查询接口地址",
                        "$ref": "#api"
                      },
                      "body": {
                        "title": "查询接口参数",
                        "$ref": "#body"
                      },
                      "nameKey": {
                        "title": "用于展示的字段",
                        "type": "string",
                        "minLength": 1
                      },
                      "valueKey": {
                        "title": "用于关联的字段",
                        "type": "string",
                        "default": "id",
                        "minLength": 1
                      },
                      "trigger": {
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
                      "api",
                      "nameKey"
                    ],

                    "properties": {
                      "multiple": {
                        "title": "是否多选",
                        "type": "boolean",
                        "default": false
                      },
                      "api": {
                        "title": "查询接口地址",
                        "$ref": "#api"
                      },
                      "body": {
                        "title": "查询接口参数",
                        "$ref": "#body"
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
                      "key": {
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
                      }
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
            "api",
            "nameKey",
            "mappingKey"
          ],

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
            "api": {
              "title": "查询接口地址",
              "$ref": "#api"
            },
            "body": {
              "title": "查询接口参数",
              "$ref": "#body"
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
            "key": {
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
              "$ref": "#create"
            },
            "update": {
              "$ref": "#update"
            },
            "delete": {
              "$ref": "#delete"
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
          },
          "allOf": [
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
          ]
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
                      960
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
      }
    }
  }






