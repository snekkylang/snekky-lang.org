#!/bin/bash
echo "Building snekky..."
cd snekky
haxelib install console.hx 0.2.12 --quiet
haxelib install hxcpp --quiet
haxelib install hxargs --quiet
haxe scripts/build-js.hxml
cp js/snekky.js ../public/js/
cd ..

echo "Building snekkyd..."
cd snekkyd
haxelib install hxcpp --quiet
haxe build-js.hxml
cp js/snekkyd.js ../public/js/
cd ..

echo "Building snekkyp.."
cd snekkyp
haxelib install hxcpp --quiet
haxe build-js.hxml
cp js/snekkyp.js ../public/js/
cd ..

echo "Building website..."
npm install
npm run build