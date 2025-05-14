#!/bin/bash

npm run build

cp dist/2_sem/jpeg_decoder.js files/scripts/jpeg_decoder.js

cp dist/2_sem/jpeg_encoder.js files/scripts/jpeg_encoder.js

sed -i 's/jpeg_encoder_1/exports/g' files/scripts/jpeg_decoder.js

sed -i '/const exports = require(".\/jpeg_encoder");/d' files/scripts/jpeg_decoder.js
