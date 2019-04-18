#!/bin/bash

echo "Create build dir..."
mkdir sea_build
cd sea_build

echo "Create build env with CMake..."
cmake ./../secure-element-abstraction/ -DTARGET_GROUP=v2 -DCMAKE_TOOLCHAIN_FILE=../toolchain-rpi.cmake

echo "Build libseadyn.so..."
make
cp ./src/libseadyn.so ../libseadyn.so

cd ./..
