import * as ffi from 'ffi-napi';
import * as ref from 'ref-napi';
import {ISecureElement} from './types';

const lib_path = '../libseadyn.so';

const uint8_t = ref.types.uint8;
const uint16_t = ref.types.uint16;
const uint8_Ptr = ref.refType(uint8_t);
const uint16_Ptr = ref.refType(uint16_t);

const res_t = uint8_t;
enum Result {
  SE_SUCCESS      = 0x00,
  SE_COM_FAIL     = 0xF7,
  SE_GEN_FAIL     = 0xF8,
  SE_UNKNOWN      = 0xFF,
  SE_VERIFY_SUCCESS = 0xF6,
  SE_VERIFY_FAIL = 0xF5,
}

const get_sec_el = () => ffi.Library(lib_path, {
  /**
   * SE_STATUS se_get_random(uint8_t* rand_out , uint8_t randomLen);
   * Retrieves a random byte array of size randomLen from the Secure Module.
   * @param[in,out] random  IN: buffer to contain random value (at least of size randomLen);
   *                       OUT: retrieved random data
   * @param[in] randomLen Amount of byte to retrieve
   * @retval ::SE_SUCCESS Upon successful execution
   */
  'se_get_random': [res_t, [uint8_Ptr, uint8_t]],

  /**
    * SE_STATUS se_get_pubkey(uint8_t index, uint8_t* publicKey , uint16_t* publicKeyLen);
    * Retrieves one of the public keys stored in one of the slots.
    * @param[in] index The slot number for reading the public key
    * @param[in,out] publicKey  IN: buffer to contain public key with th length of publicKeyLen;
    *                          OUT: retrieved public key
    * @param[in] publicKeyLen Pointer to the length of the retrieved public key
    * @retval ::SE_SUCCESS Upon successful execution
    *         ::BAD_PARAM In case of a key_id too large for ATECC608
  */
  'se_get_pubkey': [res_t, [uint8_t, uint8_Ptr, uint16_Ptr]],

  /**
    * SE_STATUS se_sign(uint8_t index, const uint8_t *msg, uint16_t msglen, uint8_t *psignature, uint16_t *pSignatureLen);
    * Signs a given message using the key stored in one of the slots.
    * @param[in] index The slot number for reading the public key
    * @param[in] msg buffer to contain the message to be signed;
    * @param[in] msglen The length of the message to be signed.
    * @param[in,out] pSignature  IN: buffer to contain the signed message;
    *                           OUT: the signed message
    * @param[in] msglen Pointer to the length of the signed message
    * @retval ::SE_SUCCESS Upon successful execution
    *         ::BAD_PARAM In case of a message not being the right length(32Byte) for ATECC608
  */
  'se_sign': [res_t, [uint8_t, uint8_Ptr, uint16_t, uint8_Ptr, uint16_Ptr]],

  /**
   * SE_STATUS se_verify(uint8_t index, const uint8_t *pHash, uint16_t hashLen, const uint8_t *pSignature, uint16_t signatureLen);
   * Verifies a given signature using the key stored in one of the slots and the original message.
   * @param[in] index The slot number for reading the public key
   * @param[in] pHash buffer to the content to be verified;
   * @param[in] hashLen The length of the content to be verified.
   * @param[in] pSignature  IN: buffer to contain the signed message;
   * @param[in] msglen The length of the signed message
   * @retval ::SE_SUCCESS Upon successful execution
   */
  'se_verify': [res_t, [uint8_t, uint8_Ptr, uint16_t, uint8_Ptr, uint16_t]],

  /**
   * SE_STATUS se_init();
   * Initilazes the secure element.
   * @retval ::SE_SUCCESS Upon successful execution
   */
  'se_init': [res_t, []],

  /**
   * SE_STATUS se_generate_keypair(uint8_t index);
   * Generates a key pair inside one of the slots.
   * @param[in] index The slot number
   * @retval ::SE_SUCCESS Upon successful execution
   */
  'se_generate_keypair': [res_t, [uint8_t]],
});

export class SecureElement implements ISecureElement {
  private readonly sec_el;

  constructor() {
    this.sec_el = get_sec_el();

    const result = this.sec_el.se_init():
    if (result != Result.SE_SUCCESS) {
      throw new Error(`Secure Element initialisation failed with code: ${result}`);
    }
  }

  public getRandom(len: number): Buffer {
    const rand = Buffer.alloc(len);
    const result = this.sec_el.se_get_random(rand, len);
    if (result == Result.SE_SUCCESS) {
      return rand;
    } else {
      throw new Error(`Secure Element random number generation failed with code: ${result}`);
    }
  }

  public getPublicKey(index: number): Buffer {
    const res_len = ref.alloc(uint16_t, 128 + 8)
    const pubKey = Buffer.alloc(ref.deref(res_len));
    const result = this.sec_el.se_get_pubkey(index, pubKey, res_len);
    if (result == Result.SE_SUCCESS) {
      return pubKey;
    } else {
      throw new Error(`Secure Element public key read failed with code: ${result}`);
    }
  }

  public sign(key: number, message: Buffer): Buffer {
    const sig = Buffer.alloc(100);  // TODO allocate a better size than 100
    const res_len = ref.alloc(uint16_t);
    const result = this.sec_el.se_sign(key, message, message.byteLength, sig, res_len);
    if (result == Result.SE_SUCCESS) {
      return sig;
    } else {
      throw new Error(`Secure Element signing failed with code: ${result}`);
    }
  }

  public verify(key: number, content: Buffer, signature: Buffer): boolean {
    const result = this.sec_el.se_verify(key, content, content.byteLength, signature, signature.byteLength);
    if (result == Result.SE_VERIFY_SUCCESS) {
      return true;
    } else if (result == Result.SE_VERIFY_FAIL) {
      return false;
    } else {
      throw new Error(`Secure Element verification failed with code: ${result}`);
    }
  }

  public generateKeyPair(index: number): boolean  {
    const result = this.sec_el.se_generate_keypair(index);
    return result == Result.SE_SUCCESS;
  }
};

export default SecureElement;
