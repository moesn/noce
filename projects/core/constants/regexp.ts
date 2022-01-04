interface NcRegItem {
  name: string,
  reg: string,
  tip?: string,
}

export const NcRegExp: NcRegItem[] = [
  {
    name: '任意',
    reg: '^(?! )[\\s\\S]*(?! ).$'
  },
  {
    name: '字母',
    reg: '^[a-zA-Z]*$'
  },
  {
    name: '数字',
    reg: '^[0-9]*$'
  },
  {
    name: '汉字',
    reg: '^[\u4E00-\u9FA5]*$'
  },
  {
    name: '字符',
    tip: '请输入字符!@#$^&*-_>',
    reg: '^[!@#$^&*-_]*$'
  },
  {
    name: '名称',
    tip: '汉字字母数字或 !@#$%^&*_>',
    reg: '^(?! )[\u4E00-\u9FA5a-zA-Z0-9 !@#$^&*-_>]*$'
  },
  {
    name: '字母数字',
    tip: '字母或数字，字母开头',
    reg: '^(?![0-9])[a-zA-Z0-9]*$'
  },
  {
    name: '身份证',
    tip: '请输入15或18位身份证号码',
    reg: '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}$',
  },
  {
    name: '手机号',
    tip: '请输入11位有效的手机号',
    reg: '^1([38][0-9]|4[579]|5[012356789]|66|7[1235678]|9[189])[0-9]{8}$'
  },
  {
    name: '邮箱',
    tip: '请输入有效的邮箱地址',
    reg: "^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$"
  },
  {
    name: 'URL',
    tip: '请输入有效的URL地址',
    reg: '^(http|https):\\/\\/[\\w\\-_\u4E00-\u9FA5:/]+(\\.[\\w\\-_\u4E00-\u9FA5]+)+([\u4E00-\u9FA5\\w\\-.,@?^=%&:/~+#]*[\u4E00-\u9FA5\\w\\-@?^=%&/~+#])?$'
  },
  {
    name: 'IP',
    tip: '请输入有效的IP',
    reg: '(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|(^(([\\da-fA-F]{1,4}){0,1}($|(?!:$):)){2,8}$)'
  },
  {
    name: 'IP段',
    tip: '格式：192.168.1.0/24',
    reg: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[1-2]\\d|3[0-2])$'
  },
  {
    name: '多IP段',
    tip: '格式：192.168.1.0/24，多个用英文逗号隔开',
    reg: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[1-2]\\d|3[0-2])(,(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[1-2]\\d|3[0-2]))*$'
  },
  {
    name: 'IPV4',
    tip: '请输入有效的IPV4',
    reg: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
  },
  {
    name: 'IPV6',
    tip: '请输入有效的IPV6',
    reg: '^(([\\da-fA-F]{1,4}){0,1}($|(?!:$):)){2,8}$'
  },
  {
    name: 'MAC',
    tip: '请输入有效的MAC地址',
    reg: '^[a-fA-F0-9]{2}(-[a-fA-F0-9]{2}){5}$|^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$|^[a-fA-F0-9]{12}$|^[a-fA-F0-9]{4}(\\.[a-fA-F0-9]{4}){2}$'
  }
];

// 根据传入的正则表达式名称获取表达式内容
export const ncGetPattern = (name: string): NcRegItem => NcRegExp.find(d => d.name === name) || {name: '', reg: ''};
