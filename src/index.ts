import * as ffi from 'ffi-napi';
import * as ref from 'ref';

const lib_path = '../secure-element-abstraction/inc/sec_elem_abstr.h';

enum Result {
  SE_SUCCESS      = 0x00,
  SE_COM_FAIL     = 0xF7,
  SE_GEN_FAIL     = 0xF8,
  SE_UNKNOWN      = 0xFF,
  SE_VERIFY_SUCCESS = 0xF6,
  SE_VERIFY_FAIL = 0xF5,
}

const sec_el = ffi.Library(lib_path, {
  // SE_STATUS se_get_random(uint8_t* rand_out , uint8_t randomLen);
  'se_get_random': ['int', []],

  // SE_STATUS se_get_pubkey(uint8_t index, uint8_t* publicKey , uint16_t* publicKeyLen);
  'se_get_pubkey': ['int', ['int', ]],

  // SE_STATUS se_sign(uint8_t index, const uint8_t *msg, uint16_t msglen, uint8_t *psignature, uint16_t *pSignatureLen);
  'se_sign': ['int', ['int', ]],

  //SE_STATUS se_verify(uint8_t index, const uint8_t *pHash, uint16_t hashLen, const uint8_t *pSignature, uint16_t signatureLen);
  'se_verify': ['int', ['int', ]],

  //SE_STATUS se_init();
  'se_init': ['int'],

  //SE_STATUS se_generate_keypair(uint8_t index);
  'se_generate_keypair': ['int', ['int']],

  //SE_STATUS se_get_sha256(uint8_t* pMessage, uint16_t msgLen, uint8_t* sha, uint16_t*shaLen);
  'se_get_sha256': ['int', []],
});

export default {
  get_random: _ => ,
  get_pubkey: _ => ,
  sign: _ => ,
  verify: _ => ,
  init: _ =>
};
