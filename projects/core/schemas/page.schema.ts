export const NM_PAGE_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "title": "页面配置",
    "description": "支持表格、表单、列表、树等",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "$schema": {
        "type": "string"
      },
      "apis": {
        "title": "接口列表",
        "description": "APP配置从服务端获取接口列表时，此处配置失效",
        "type": "object"
      },
      "table": {
        "title": "右侧表格",
        "$ref": "#table"
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
        "additionalProperties": false,
        "properties": {
          "name": {
            "title": "表格名称",
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
            "title": "表格视图配置",
            "type": "object",
            "required": [
              "api",
              "columns"
            ],
            "additionalProperties": false,
            "properties": {
              "api": {
                "title": "查询接口地址",
                "$ref": "#api"
              },
              "body": {
                "title": "查询接口参数",
                "$ref": "#body"
              },
              "pageSize": {
                "title": "每页显示条数",
                "type": "integer",
                "default": 10,
                "multipleOf": 5,
                "minimum": 5
              },
              "frontPagination": {
                "title": "是否前端分页",
                "type": "boolean",
                "default": false
              },
              "parseData": {
                "title": "解析数据",
                "description": "表格渲染之前对数据进行处理",
                "$ref": "#parse"
              },
              "tabs": {
                "title": "表格标签",
                "description": "分标签展示不同的表格数据",
                "type": "array",
                "minItems": 1,
                "uniqueItems": true,
                "items": {
                  "type": "object",
                  "required": [
                    "label",
                    "value"
                  ],
                  "additionalProperties": false,
                  "properties": {
                    "label": {
                      "title": "标签名称",
                      "type": "string"
                    },
                    "value": {
                      "title": "标签值",
                      "type": [
                        "string",
                        "number"
                      ]
                    },
                    "api": {
                      "title": "查询接口地址",
                      "description": "不同的标签可能需要不同的查询接口，不配置时使用表格的接口",
                      "$ref": "#api"
                    },
                    "body": {
                      "title": "查询接口参数",
                      "$ref": "#body"
                    }
                  }
                }
              },
              "columns": {
                "title": "表格列",
                "description": "表格每列显示配置",
                "type": "array",
                "uniqueItems": true,
                "minItems": 1,
                "items": {
                  "type": "object",
                  "required": [
                    "label",
                    "key"
                  ],
                  "additionalProperties": false,
                  "properties": {
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
                    "tabIndex": {
                      "title": "标签索引",
                      "description": "标记在哪些标签时显示当前字段，不配置时默认所有字段",
                      "oneOf": [
                        {
                          "type": "integer",
                          "minimum": 0
                        },
                        {
                          "type": "array",
                          "minItems": 1,
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
                      "enum": [
                        "default",
                        "green",
                        "blue",
                        "yellow",
                        "orange",
                        "red"
                      ],
                      "default": "default"
                    }
                  }
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
            "additionalProperties": false,
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
            "additionalProperties": false,
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
            "additionalProperties": false,
            "properties": {
              "api": {
                "description": "删除接口地址",
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
          "additionalProperties": false,
          "properties": {
            "name": {
              "title": "表单名称",
              "type": "string",
              "minLength": 1
            },
            "width": {
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
                "additionalProperties": false,
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
                      "string",
                      "number"
                    ],
                    "minLength": 1
                  },
                  "span": {
                    "title": "表单项跨度",
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 24
                  },
                  "required": {
                    "title": "表单项是否必填",
                    "type": "boolean",
                    "default": false
                  },
                  "readonly": {
                    "title": "表单项是否只读",
                    "$ref": "#parseBool"
                  },
                  "tip": {
                    "title": "表单项说明提示",
                    "type": "string",
                    "minLength": 1
                  },
                  "input": {
                    "title": "普通输入框专属配置",
                    "type": "object",
                    "additionalProperties": false,
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
                          "身份证",
                          "手机号",
                          "邮箱"
                        ]
                      },
                      {
                        "title": "自定义正则校验",
                        "type": "object",
                        "required": [
                          "name",
                          "reg"
                        ],
                        "additionalProperties": false,
                        "properties": {
                          "name": {
                            "title": "正则表达式名称",
                            "type": "string",
                            "minLength": 1
                          },
                          "reg": {
                            "title": "正则表达式",
                            "type": "string",
                            "minLength": 1
                          }
                        }
                      }
                    ]
                  },
                  "number": {
                    "title": "数字输入框专属配置",
                    "type": "object",
                    "additionalProperties": false,
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
                  "select": {
                    "title": "下拉选择框专属配置",
                    "type": "object",
                    "additionalProperties": false,
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
                          "additionalProperties": false,
                          "properties": {
                            "label": {
                              "title": "选项显示的标签",
                              "type": "string"
                            },
                            "value": {
                              "title": "选项提交到后台的值",
                              "type": [
                                "string",
                                "number"
                              ]
                            }
                          }
                        }
                      },
                      "api": {
                        "title": "服务接口地址",
                        "$ref": "#api"
                      },
                      "labelKey": {
                        "title": "用于展示的字段",
                        "type": "string",
                        "minLength": 1
                      },
                      "valueKey": {
                        "title": "用于关联的字段",
                        "type": "string",
                        "default": "id",
                        "minLength": 1
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
                          "labelKey"
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
                      "titleKey"
                    ],
                    "additionalProperties": false,
                    "properties": {
                      "multiple": {
                        "title": "是否多选",
                        "type": "boolean",
                        "default": false
                      },
                      "api": {
                        "title": "服务接口地址",
                        "$ref": "#api"
                      },
                      "titleKey": {
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
                    "allOf": [
                      {
                        "title": "弹窗关联配置",
                        "type": "object",
                        "required": [
                          "nameKey"
                        ],
                        "additionalProperties": false,
                        "properties": {
                          "nameKey": {
                            "title": "弹窗名称字段",
                            "description": "关联字段中弹窗数据的名称字段",
                            "type": "string",
                            "minLength": 1
                          }
                        }
                      },
                      {
                        "$ref": "#modal"
                      }
                    ]
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
        "items": {
          "type": "object",
          "required": [
            "type",
            "api",
            "titleKey",
            "mappingKey"
          ],
          "additionalProperties": false,
          "properties": {
            "name": {
              "title": "导航名称",
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
            "titleKey": {
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
              "description": "数据主键映射到表格的对应字段",
              "type": "string",
              "minLength": 1
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
      "modal": {
        "$id": "#modal",
        "title": "弹窗",
        "oneOf": [
          {
            "$ref": "#table"
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
            "roleId": "$this.list.id$",
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





