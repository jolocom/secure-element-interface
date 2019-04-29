import SecureElement from '../src/index';
import { strict as assert} from 'assert';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const test = async () => {
  console.log('Check intialisation');
  const SE = new SecureElement();

  await sleep(1000);

  console.log('Check random number generation');
  const rand1 = SE.getRandom(64);
  const rand2 = SE.getRandom(64);
  const rand3 = SE.getRandom(64);

  console.log(rand1, rand2, rand3)

  assert( (rand1.equals(rand2) === false) &&
          (rand1.equals(rand3) === false) &&
          (rand2.equals(rand3) === false) );

  const indexes = [0, 1, 2, 3];

  console.log('Wipe all keys');
  indexes.map(n => assert(SE.wipeKeyPair(n)));
  indexes.map(n => assert.throws(() => SE.getPublicKey(n))); 

  console.log('Check key pair generation');
  indexes.map(n => assert(SE.generateKeyPair(n)));

  await sleep(1000);

  console.log('Check key uniqueness');
  indexes.map(async n => {const keyn = SE.getPublicKey(n);
                          await sleep(2000);
                          assert(keyn.byteLength);
                          console.log(keyn);
                          assert(keyn.equals(SE.getPublicKey(n)));
                          indexes.map(i => {if (i != n) {
                                              assert(keyn.equals(SE.getPublicKey(i)) === false);
                                           }});
                          }); 

  console.log('Check new key difference'); 
  indexes.map(n => {const keyn = SE.getPublicKey(n);
                    SE.generateKeyPair(n);
                    assert(keyn.equals(SE.getPublicKey(n)) === false);
                    });

  console.log('Wipe all test keys');
  indexes.map(n => SE.wipeKeyPair(n));
}

test();
