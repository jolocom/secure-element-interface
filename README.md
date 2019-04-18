# secure-element-interface
This project provides the Riddle and Code Secure Element as a npm module with a js interface.

## Building
### SEA library
Steps to build the secure element abstraction dynamic library:
1. clone this repo (with --recursive for the submodules)
2. create a build folder and enter it
3. run ```cmake ../secure-element-abstraction/ -DTARGET_GROUP=v2 -DCMAKE_TOOLCHAIN_FILE=../toolchain-rpi.cmake```
4. run ```make```

### Interface Package
Steps to package:
1. ensure you have built the SEA library as above
2. copy build/src/libseadyn.so to the top level
3. run npm package
