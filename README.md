# AXVECO webpage token
A non-transferable token on the Ethereum blockchain that can be used by webpages to e.g. show an easter egg. The token can be distributed by a single owner account via the web interface.

![A demo picture](demo.png)

## Building
```
git clone https://github.com/mvanaltvorst/AXVECO-webpage-token.git
cd AXVECO-webpage-token
npm install
cp secrets_sample.js secrets.js
```
This is the point where you edit `secrets.js` with your own Infura API endpoint and your 12 word private key mnemonic.
```
truffle compile
truffle migrate --network=production
```
This is where your contract's address will appear. If you want to build the web interface, you should run the following command:
```
webpack --mode=production
```
The resulting files will be located in the `build/app/` directory.
