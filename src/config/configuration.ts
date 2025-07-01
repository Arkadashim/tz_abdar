export default () => ({
  port: parseInt(new String(process.env.PORT).valueOf(), 10) || 3000,
  evmRpcUrl: process.env.EVM_RPC_URL,
  cosmosGrpcUrl: process.env.COSMOS_GRPC_URL,
  cosmosRpcUrl: process.env.COSMOS_RPC_URL,
});
