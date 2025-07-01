Blockchain API
A NestJS application providing APIs to fetch block and transaction data from EVM (Sei Network) and Cosmos-based blockchains.
Features

EVM Endpoints:
GET /evm/block/:height: Retrieves block details (height, hash, parentHash, gasLimit, gasUsed, size) by block height.
GET /evm/transactions/:hash: Retrieves transaction details (hash, to, from, value, input, maxFeePerGas, maxPriorityFeePerGas, gasPrice) by transaction hash.
GET /evm/recent-transaction: Fetches a recent transaction from the latest block.


Cosmos Endpoints:
GET /cosmos/block/:height: Retrieves block details (height, time, hash, proposedAddress) by block height.
GET /cosmos/transactions/:hash: Retrieves transaction details (hash, height, time, gasUsed, gasWanted, fee, sender) by transaction hash.


Swagger UI for API documentation at /api.

Prerequisites

Node.js (v16 or higher)
npm
Access to the following nodes:
EVM: https://sei-evm-rpc.publicnode.com
Cosmos RPC: https://sei-m.rpc.n0ok.net:443
Cosmos gRPC: sei-grpc.polkachu.com:11990



Installation

Clone the repository:git clone <repository-url>
cd blockchain-api


Install dependencies:npm install


Copy the sample environment file to .env:cp .env.sample .env


Ensure the .env file contains the correct RPC URLs (default values should work):EVM_RPC_URL=https://sei-evm-rpc.publicnode.com
COSMOS_RPC_URL=https://sei-m.rpc.n0ok.net:443
COSMOS_GRPC_URL=sei-grpc.polkachu.com:11990


Place the Cosmos gRPC proto files in node_modules/@grpc/proto-loader/cosmos/base/tendermint/v1beta1/query.proto (or adjust the path in cosmos.module.ts).

Running the Application

Start the development server:npm run start:dev


The API will be available at http://localhost:3000.
Access the Swagger UI at http://localhost:3000/api to explore and test endpoints.

Project Structure

src/app.module.ts: Root module.
src/evm/: EVM-related module, controller, service, and DTOs.
src/cosmos/: Cosmos-related module, controller, service, DTOs, and transaction decoder.
src/exception.filter.ts: Global error handling filter.
src/main.ts: Application bootstrap with Swagger setup.
.env.sample: Template for environment variables.

API Usage

EVM Block: GET /evm/block/0x1 (replace 0x1 with a valid hex block number).
EVM Transaction: GET /evm/transactions/0xD70952032620CC4E2737EB8AC379806359D8E0B17B0488F627997A0B043ABDED (use a valid transaction hash).
Cosmos Block: GET /cosmos/block/123456 (replace 123456 with a valid block height).
Cosmos Transaction: GET /cosmos/transactions/D70952032620CC4E2737EB8AC379806359D8E0B17B0488F627997A0B043ABDED (use a valid transaction hash, with or without 0x).
Recent Transaction: GET /evm/recent-transaction to fetch a transaction from the latest block.

Dependencies

@nestjs/core, @nestjs/common, @nestjs/axios, @nestjs/config, @nestjs/microservices, @nestjs/swagger
rxjs, class-validator, class-transformer, swagger-ui-express
@cosmjs/stargate, @cosmjs/tendermint-rpc, @cosmjs/encoding, @cosmjs/proto-signing
@grpc/proto-loader

Install them with:
npm install @nestjs/core @nestjs/common @nestjs/axios @nestjs/config @nestjs/microservices @nestjs/swagger rxjs class-validator class-transformer swagger-ui-express @cosmjs/stargate @cosmjs/tendermint-rpc @cosmjs/encoding @cosmjs/proto-signing @grpc/proto-loader

Error Handling

Invalid inputs return HTTP 400 with a descriptive message.
Non-existent blocks or transactions return HTTP 404.
Internal errors return HTTP 500 with a timestamp and message.

Notes

Ensure the RPC and gRPC endpoints are accessible.
The Cosmos transaction endpoint accepts hashes with or without 0x prefix.
Use the Swagger UI for testing and documentation.
