import * as ffi from 'ffi-napi';
import * as ref from 'ref';

const lib_path = '../secure-element-abstraction/inc/sec_elem_abstr.h';

const sec_el = ffi.Library(lib_path, {
})

export default {
  get_random: _ => ,
  get_pubkey: _ => ,
  sign: _ => ,
  verify: _ => ,
  init: _ =>
};
