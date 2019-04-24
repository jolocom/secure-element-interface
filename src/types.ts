
export interface ISecureElement {
  getRandom: (len: number) => Buffer
  getPublicKey: (index: number) => Buffer
  sign: (key: number, message: Buffer) => Buffer
  verify: (key: number, content: Buffer, signature: Buffer) => boolean
}
