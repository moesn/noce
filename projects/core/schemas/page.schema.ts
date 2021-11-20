export const NM_PAGE_SCHEMA =
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "description": "页面配置",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "$schema": {
        "type": "string"
      },
      "apis": {
        "description": "接口列表",
        "type": "object"
      },
      "table": {
        "$ref": "#/definitions/table"
      }
    },
    "required": [
      "$schema"
    ],
    "definitions": {
      "table": {
        "description": "表格配置项",
        "type": "object",
        "required": [
          "view"
        ],
        "additionalProperties": false,
        "properties": {
          "name": {
            "description": "表格名称",
            "type": "string",
            "default": ""
          },
          "key": {
            "description": "表格数据的主建",
            "type": "string",
            "default": "id",
            "minLength": 1
          },
          "view": {
            "description": "表格查看配置",
            "type": "object",
            "required": [
              "api",
              "columns"
            ],
            "additionalProperties": false,
            "properties": {
              "api": {
                "description": "表格数据查询接口地址",
                "type": "string",
                "minLength": 1
              },
              "body": {
                "description": "接口参数",
                "type": "object"
              },
              "pageSize": {
                "description": "每页显示条数",
                "type": "integer",
                "default": 10
              },
              "frontPagination": {
                "description": "是否前端分页",
                "type": "boolean",
                "default": false
              },
              "parse": {
                "description": "对查询到的数据进行解析",
                "type": "string"
              },
              "columns": {
                "description": "表格显示的数据列配置",
                "type": "array",
                "minItems": 1,
                "items": {
                  "description": "表格列配置项",
                  "type": "object",
                  "required": [
                    "label",
                    "key"
                  ],
                  "additionalProperties": false,
                  "properties": {
                    "label": {
                      "description": "表头显示的文字",
                      "type": "string",
                      "minLength": 1
                    },
                    "key": {
                      "description": "表格数据的key",
                      "type": "string",
                      "minLength": 1
                    },
                    "search": {
                      "description": "表格数据是否可搜索",
                      "type": "boolean",
                      "default": false
                    }
                  }
                }
              }
            }
          },
          "form": {
            "$ref": "#/definitions/form"
          },
          "create": {
            "description": "表格数据增加配置",
            "type": "object",
            "required": [
              "api"
            ],
            "additionalProperties": false,
            "properties": {
              "api": {
                "description": "表格数据增加接口地址",
                "type": "string",
                "minLength": 1
              },
              "body": {
                "description": "接口参数",
                "type": "object"
              }
            }
          },
          "update": {
            "description": "表格数据修改配置",
            "type": "object",
            "required": [
              "api"
            ],
            "additionalProperties": false,
            "properties": {
              "api": {
                "description": "表格数据修改接口地址",
                "type": "string",
                "minLength": 1
              },
              "body": {
                "description": "接口参数",
                "type": "object"
              },
              "name": {
                "description": "修改操作的表头名称",
                "type": "string",
                "default": "修改",
                "minLength": 1
              }
            }
          },
          "delete": {
            "description": "表格数据删除配置",
            "type": "object",
            "required": [
              "api"
            ],
            "additionalProperties": false,
            "properties": {
              "api": {
                "description": "表格数据删除接口地址",
                "type": "string",
                "minLength": 1
              },
              "body": {
                "description": "接口参数",
                "type": "object",
                "default": {
                  "ids": [
                    "$this.data[this.key]$"
                  ]
                }
              },
              "name": {
                "description": "删除操作的表头名称",
                "type": "string",
                "default": "删除",
                "minLength": 1
              }
            }
          }
        }
      },
      "form": {
        "description": "表单配置，可配置多个表单",
        "type": "array",
        "minItems": 1,
        "items": {
          "description": "表单项置项",
          "type": "object",
          "required": [
            "fields"
          ],
          "additionalProperties": false,
          "properties": {
            "name": {
              "description": "表单名称",
              "type": "string",
              "minLength": 1
            },
            "width": {
              "description": "表单宽度，只需要在第一个表单里配",
              "enum": [
                360,
                560,
                720,
                960
              ]
            },
            "cols": {
              "description": "表单列数，只需要在第一个表单里配",
              "type": "integer",
              "default": 1
            },
            "tip": {
              "description": "表单说明提示",
              "type": "string",
              "minLength": 1
            },
            "beforeEdit": {
              "description": "表单编辑前数据处理",
              "type": "string",
              "minLength": 1
            },
            "beforeSave": {
              "description": "表单保存前数据处理",
              "type": "string",
              "minLength": 1
            },
            "fields": {
              "description": "表单字段",
              "type": "array",
              "minItems": 1,
              "items": {
                "description": "表单字段属性设置",
                "type": "object",
                "required": [
                  "type",
                  "label",
                  "key"
                ],
                "additionalProperties": false,
                "properties": {
                  "type": {
                    "description": "表单项类型",
                    "enum": [
                      "input",
                      "textarea",
                      "number",
                      "password",
                      "switch",
                      "select",
                      "modal",
                      "datetime",
                      "date",
                      "time"
                    ]
                  },
                  "label": {
                    "description": "表单项显示的文字",
                    "type": "string",
                    "minLength": 1
                  },
                  "key": {
                    "description": "表单项数据的key",
                    "type": "string",
                    "minLength": 1
                  },
                  "value": {
                    "description": "表单项数据的默认值",
                    "type": [
                      "string",
                      "number",
                      "integer"
                    ],
                    "minLength": 1
                  },
                  "span": {
                    "description": "表单项跨度",
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 24
                  },
                  "required": {
                    "description": "表单项是否必填",
                    "type": "boolean",
                    "default": false
                  },
                  "readonly": {
                    "description": "表单项是否只读",
                    "type": [
                      "boolean",
                      "string"
                    ],
                    "default": false
                  },
                  "pattern": {
                    "description": "表单项输入内容正则校验",
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
                        "description": "自定义正则校验",
                        "type": "object",
                        "required": [
                          "name",
                          "reg"
                        ],
                        "additionalProperties": false,
                        "properties": {
                          "name": {
                            "description": "正则表达式名称",
                            "type": "string",
                            "minLength": 1
                          },
                          "reg": {
                            "description": "正则表达式内容",
                            "type": "string",
                            "minLength": 5
                          }
                        }
                      }
                    ]
                  },
                  "tip": {
                    "description": "表单项说明提示",
                    "type": "string",
                    "minLength": 1
                  },
                  "input": {
                    "description": "普通输入框专属配置",
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "minLength": {
                        "description": "最小输入文字数量",
                        "type": "integer",
                        "default": 1
                      },
                      "maxLength": {
                        "description": "最大输入文字数量",
                        "type": "integer",
                        "default": 32
                      }
                    }
                  },
                  "number": {
                    "description": "数字输入框专属配置",
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                      "min": {
                        "description": "最小输入数字",
                        "type": "integer",
                        "default": -9007199254740991
                      },
                      "max": {
                        "description": "最大输入数字",
                        "type": "integer",
                        "default": 9007199254740991
                      }
                    }
                  },
                  "select": {
                    "description": "下拉选择框专属配置",
                    "type": "object",
                    "minProperties": 1,
                    "additionalProperties": false,
                    "properties": {
                      "multiple": {
                        "description": "是否多选",
                        "type": "boolean",
                        "default": false
                      },
                      "options": {
                        "description": "固定选项数据",
                        "type": "array",
                        "default": [],
                        "items": {
                          "type": "object",
                          "required": [
                            "label",
                            "value"
                          ],
                          "additionalProperties": false,
                          "properties": {
                            "label": {
                              "description": "选项显示的标签",
                              "type": "string"
                            },
                            "value": {
                              "description": "选项提交到后台的值",
                              "type": [
                                "string",
                                "integer",
                                "number"
                              ]
                            }
                          }
                        }
                      },
                      "api": {
                        "description": "服务接口地址",
                        "type": "string",
                        "minLength": 1
                      },
                      "labelKey": {
                        "description": "用于展示的key",
                        "type": "string",
                        "minLength": 1
                      },
                      "valueKey": {
                        "description": "用于保存值的key",
                        "type": "string",
                        "minLength": 1,
                        "default": "id"
                      }
                    },
                    "dependencies": {
                      "api": [
                        "labelKey"
                      ]
                    }
                  },
                  "modal": {
                    "oneOf": [
                      {
                        "$ref": "#/definitions/table"
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
                            "password"
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
                          "enum": [
                            "textarea"
                          ]
                        }
                      }
                    },
                    "then": {
                      "properties": {
                        "input": {
                          "default": {
                            "maxLength": 128
                          }
                        }
                      }
                    }
                  },
                  {
                    "if": {
                      "properties": {
                        "type": {
                          "enum": [
                            "number"
                          ]
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
                          "enum": [
                            "select"
                          ]
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
                          "enum": [
                            "modal"
                          ]
                        }
                      }
                    },
                    "then": {
                      "required": [
                        "modal"
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  }





