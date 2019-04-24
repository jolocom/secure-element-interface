import SecureElement from '../src/index';
import { strict as assert} from 'assert';

console.log('Check intialisation');
const SE = new SecureElement();

console.log('Check random number generation');
const rand1 = SE.getRandom(64);
const rand2 = SE.getRandom(64);
const rand3 = SE.getRandom(64);

assert( (rand1.equals(rand2) === false) &&
        (rand1.equals(rand3) === false) &&
        (rand2.equals(rand3) === false) );

console.log('Check key pair generation');
SE.generateKeyPair(0);

const key0 = SE.getPublicKey(0);
console.log(key0.byteLength);
assert(key0.byteLength);
assert(key0.equals(SE.getPublicKey(0)) === true);

SE.generateKeyPair(0);
assert(key0.equals(SE.getPublicKey(0)) === false);
