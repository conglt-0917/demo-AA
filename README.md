# Demo-AA

## Install packages

```bash
npm
# or
yarn
```

## Set Environment variables

```bash
cp .env.example .env
```

Fill `.env`

## Compile

```bash
yarn hardhat compile
```

## Deploy smart contracts (default is mumbai testnet)

```bash
yarn hardhat run execute/1_deploy.ts
```

Copy all adress to `config/contracts.ts`

```bash
cp config/contracts.example.ts config/contracts.ts
```

## Fund token and deposit

```bash
yarn hardhat run execute/2_fundAndMint.ts
```

## Deposit

```bash
yarn hardhat run execute/3_deposit.ts
```


## Push transaction (pay with erc-20)

```bash
yarn hardhat run execute/4_pushTx.ts
```
