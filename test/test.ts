import secureElement from '../src/index';
import { strict as assert} from 'assert';

console.log('Check intialisation');
secureElement.init();

console.log('Check random number generation');
const rand1 = secureElement.getRandom(64);
const rand2 = secureElement.getRandom(64);
const rand3 = secureElement.getRandom(64);

assert( (rand1.equals(rand2) === false) &&
        (rand1.equals(rand3) === false) &&
        (rand2.equals(rand3) === false) );

console.log('Check key pair generation');
secureElement.generateKeyPair(0);

const key0 = secureElement.getPubkey(0);
console.log(key0.byteLength);
assert(key0.byteLength);
assert(key0.equals(secureElement.getPubkey(0)) === true);

secureElement.generateKeyPair(0);
assert(key0.equals(secureElement.getPubkey(0)) === false);
