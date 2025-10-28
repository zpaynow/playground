Faucet deployed at `https://faucet.zpaynow.com`

```bash
curl -X POST https://faucet.zpaynow.com/send \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xYourEthereumAddress",
    "token": "0x59377131cffda1e8a13d38827d4ed837b986f5f5"
  }'
```

Response:
```json
{
  "status": "success",
  "txHash": "0x...",
  "explorer": "https://sepolia.etherscan.io/tx/0x...",
  "amount": "100"
}
```
