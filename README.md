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

## Deploy smart contracts

```bash
yarn hardhat run execute/deploy.ts
```

```bash
cp config/contracts.example.ts config/contracts.ts
```

Copy all adress to `config/contracts.ts`

## Push transaction (pay with erc-20)

```bash
yarn hardhat run execute/run.ts --network [localhost or sepolia or bsctestnet]
```
