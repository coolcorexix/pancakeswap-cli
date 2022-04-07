[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# Prequisite

- Installed Node.js v14.17.4

# Installation

```
git clone https://github.com/coolcorexix/pancakeswap-cli
yarn install
```

# Commands

### Global options:

|          Option          | Shorthand |          Description           | Default |
| :----------------------: | :-------: | :----------------------------: | :-----: |
| --mnemonic-path <string> |    -m     |   Path to your mnemonic file   |         |
|  --environment <string>  |    -e     | Runtime blockchain environment | mainnet |

### **trade**

Swap a pair of ERC20 tokens. Swapping from native token to ERC20 token is not supported yet. You need to wrap BNB to WBNB first using the `swap` command.

Options:

|         Option          | Shorthand |     Description     |
| :---------------------: | :-------: | :-----------------: |
|    --input <string>     |    -i     | Input token symbol  |
| --input-amount <number> |    -a     |   Amount to trade   |
|    --output <string>    |    -o     | Output token symbol |

Sample usage:

```shell
yarn cli pancakeswap -m mnemonic -e testnet trade -i wbnb -a 0.01 -o busd
```

Sample response:

```shell
yarn run v1.22.10
$ ts-node -r tsconfig-paths/register src/index.ts pancakeswap -m mnemonic -e testnet trade -i wbnb -a 0.01 -o busd
Warning: 0x7e624fa0e1c4abfd309cc15719b7e2580887f570 is not checksummed.
Warning: 0x3c1748d647e6a56b37b66fcd2b5626d0461d3aa0 is not checksummed.
Warning: 0xae13d989dac2f0debff460ac112a837c89baa7cd is not checksummed.
Warning: 0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684 is not checksummed.
💰 Current gas balance: 3.157224515
💸 Swap 0.01 wbnb 👉 6.452488 busd? (y/N)
y
👌 Wrapped BNB already approved
⏳ Please wait, call the cotract might take a little bit long...
🙌 Swap is done, you now have 1.849801839670732118 wbnb and 152.327628533287111019 busd
🧾 Tx receipt: Swap 0.01 WBNB for 6.45 BUSD to 0x52...57c6, transaction hash: 0xb14a44a35ee2a9137b3287a60c269edfbaa752202d66eaa17560a15b0ae5956c
Done in 37.52s.
```

### **wrap**

Wrap / unwrap native token to ERC20 token.

Options:

|      Option       | Shorthand |       Description       |
| :---------------: | :-------: | :---------------------: |
|     --unwrap      |    -u     |   Unwrap WBNB to BNB    |
| --amount <number> |    -a     | Amount to wrap / unwrap |

Sample usage:

```shell
yarn cli pancakeswap -m mnemonic -e testnet wrap -a 0.1
```

Sample response:

```shell
yarn run v1.22.10
$ ts-node -r tsconfig-paths/register src/index.ts pancakeswap -m mnemonic -e testnet wrap -a 0.1
Warning: 0x7e624fa0e1c4abfd309cc15719b7e2580887f570 is not checksummed.
Warning: 0x3c1748d647e6a56b37b66fcd2b5626d0461d3aa0 is not checksummed.
Warning: 0xae13d989dac2f0debff460ac112a837c89baa7cd is not checksummed.
Warning: 0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684 is not checksummed.
💰 Current gas balance: 3.156177425
⏳ Please wait, calling the contract might take a little bit long...
🧾 Wrap 0.1 BNB to WBNB receipt: 0xce0f08f450ed9a1f9ceaf4cb938d8e85f7c1048b4c53df1003ee7473e35c36a6
Done in 18.42s.
```

### **get-token-balance**

Get current balance of a ERC20 token by symbol or address.

Options:

|       Option       | Shorthand |     Description     |
| :----------------: | :-------: | :-----------------: |
| --symbol <string>  |    -s     | Input token symbol  |
| --address <string> |    -a     | Input token address |

Sample usage:

```shell
yarn cli pancakeswap -m mnemonic -e testnet get-token-balance  -s busd
```

Sample response:

```shell
yarn run v1.22.10
$ ts-node -r tsconfig-paths/register src/index.ts pancakeswap -m mnemonic -e testnet get-token-balance -s busd
Warning: 0x7e624fa0e1c4abfd309cc15719b7e2580887f570 is not checksummed.
Warning: 0x3c1748d647e6a56b37b66fcd2b5626d0461d3aa0 is not checksummed.
Warning: 0xae13d989dac2f0debff460ac112a837c89baa7cd is not checksummed.
Warning: 0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684 is not checksummed.
💰 Current gas balance: 3.055890045
🏦 current balance of busd: 152.327628533287111019 
Done in 8.08s.
```



