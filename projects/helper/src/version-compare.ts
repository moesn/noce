export const versionCompare = (v1: any, v2: any): number => {
  if (v1 === v2) return 0;

  const toNum = (version: string): number => {
    version = version.toString()
    // 非数字分割
    const versionArr = version.split(/\D/)
    // 版本号4位对齐
    const NUM_FILL = ['0000', '000', '00', '0', '']
    // 例如：1.12.345转成000100120345
    for (let i = 0; i < versionArr.length; i++) {
      const len = versionArr[i].length
      versionArr[i] = NUM_FILL[len] + versionArr[i]
    }

    return parseInt(versionArr.join(''))
  }

  v1 = toNum(v1)
  v2 = toNum(v2)

  if (v1 > v2) {
    return 1
  }

  if (v1 < v2) {
    return -1
  }

  return 0;
}


