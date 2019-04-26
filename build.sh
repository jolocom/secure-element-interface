#!/bin/bash

echo "Create build dir..."
mkdir sea_build
cd sea_build

echo "Create build env with CMake..."
cmake ./../secure-element-abstraction/ -DTARGET_GROUP=v2 -DDYNAMIC_LINKING=OFF -DCMAKE_TOOLCHAIN_FILE=../toolchain-rpi.cmake

echo "Build libseadyn.so..."
make

cp ../secure-element-abstraction/lib/SElibrary/libseadyn.so ../libseadyn.so
cp ./test/sea_test ../sea_test

cd ./..
