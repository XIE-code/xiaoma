const rotateLeft = function (lValue, iShiftBits) {
  return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
}

const addUnsigned = function (lX, lY) {
  const lX8 = lX & 0x80000000
  const lY8 = lY & 0x80000000
  const lX4 = lX & 0x40000000
  const lY4 = lY & 0x40000000
  const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff)
  if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8
  if (lX4 | lY4) {
    if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8
    else return lResult ^ 0x40000000 ^ lX8 ^ lY8
  } else {
    return lResult ^ lX8 ^ lY8
  }
}

const F = function (x, y, z) {
  return (x & y) | (~x & z)
}

const G = function (x, y, z) {
  return (x & z) | (y & ~z)
}

const H = function (x, y, z) {
  return x ^ y ^ z
}

const I = function (x, y, z) {
  return y ^ (x | ~z)
}

const FF = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
  return addUnsigned(rotateLeft(a, s), b)
}

const GG = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
  return addUnsigned(rotateLeft(a, s), b)
}

const HH = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
  return addUnsigned(rotateLeft(a, s), b)
}

const II = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
  return addUnsigned(rotateLeft(a, s), b)
}

const convertToWordArray = function (string) {
  let lWordCount
  const lMessageLength = string.length
  const lNumberOfWordsTempOne = lMessageLength + 8
  const lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64
  const lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16
  const lWordArray = Array(lNumberOfWords - 1)
  let lBytePosition = 0
  let lByteCount = 0
  while (lByteCount < lMessageLength) {
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] =
      lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition)
    lByteCount++
  }
  lWordCount = (lByteCount - (lByteCount % 4)) / 4
  lBytePosition = (lByteCount % 4) * 8
  lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
  lWordArray[lNumberOfWords - 2] = lMessageLength << 3
  lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
  return lWordArray
}

const wordToHex = function (lValue) {
  let WordToHexValue = ''
  let WordToHexValueTemp = ''
  let lByte
  let lCount
  for (lCount = 0; lCount <= 3; lCount++) {
    lByte = (lValue >>> (lCount * 8)) & 255
    WordToHexValueTemp = '0' + lByte.toString(16)
    WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
  }
  return WordToHexValue
}

const uTF8Encode = function (string) {
  string = string.replace(/\r\n/g, '\n')
  let output = ''
  for (let n = 0; n < string.length; n++) {
    const c = string.charCodeAt(n)
    if (c < 128) {
      output += String.fromCharCode(c)
    } else if (c > 127 && c < 2048) {
      output += String.fromCharCode((c >> 6) | 192)
      output += String.fromCharCode((c & 63) | 128)
    } else {
      output += String.fromCharCode((c >> 12) | 224)
      output += String.fromCharCode(((c >> 6) & 63) | 128)
      output += String.fromCharCode((c & 63) | 128)
    }
  }
  return output
}

export function md5(string) {
  let x = []
  let k, AA, BB, CC, DD, a, b, c, d
  const S11 = 7
  const S12 = 12
  const S13 = 17
  const S14 = 22
  const S21 = 5
  const S22 = 9
  const S23 = 14
  const S24 = 20
  const S31 = 4
  const S32 = 11
  const S33 = 16
  const S34 = 23
  const S41 = 6
  const S42 = 10
  const S43 = 15
  const S44 = 21
  string = uTF8Encode(string)
  x = convertToWordArray(string)
  a = 0x67452301
  b = 0xefcdab89
  c = 0x98badcfe
  d = 0x10325476
  for (k = 0; k < x.length; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478)
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756)
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db)
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee)
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf)
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a)
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613)
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501)
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8)
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af)
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1)
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be)
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122)
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193)
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e)
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821)
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562)
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340)
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51)
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa)
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d)
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681)
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8)
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6)
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6)
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87)
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed)
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905)
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8)
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9)
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a)
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942)
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681)
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122)
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c)
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44)
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9)
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60)
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70)
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6)
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa)
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085)
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05)
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039)
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5)
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8)
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665)
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244)
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97)
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7)
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039)
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3)
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92)
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d)
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1)
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f)
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0)
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314)
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1)
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82)
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235)
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb)
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391)
    a = addUnsigned(a, AA)
    b = addUnsigned(b, BB)
    c = addUnsigned(c, CC)
    d = addUnsigned(d, DD)
  }
  const tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
  return tempValue.toLowerCase()
}
