# FullDeck.io

## Browserify JS
arCrypt wraps the eecrypto module and adds some convenience methods.
browserify arCrypt.js -o ar-crypt.js --standalone arCrypt

## Compile JS


## Minimize JS
We use Google's JS optimizer and minimizer. 
Note: eccrypt broke using ADVANCED_OPTIMIZATIONS 
java -jar compiler.jar --js_output_file=/home/brian/sandbox/fulldeck.io/src/public/js/ar-crypt.min.js  --compilation_level SIMPLE_OPTIMIZATIONS  /home/brian/sandbox/fulldeck.io/src/public/js/ar-crypt.js