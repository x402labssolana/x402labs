from solders.pubkey import Pubkey
import requests
import json

def get_token_name(self, contract_param):
    helios_key = '07619634-789b-4f04-8997-d0f04c9104dd'#saisonillico

    contract_address = contract_param
    key = Pubkey.from_string(contract_address)

    url = f"https://mainnet.helius-rpc.com/?api-key={helios_key}"

    headers = {
        'Content-Type': 'application/json',
    }

    data = {
        "jsonrpc": "2.0",
        "id": f"{key}",
        "method": "getAsset",
        "params": {
            "id": f"{key}",
            "displayOptions": {
                "showInscription": True,  # shows inscription and spl-20 data
            },
        },
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    result = response.json()['result']
    if 'symbol' in result['content']['metadata']:
        print("\nToken Symbol is: ", result['content']['metadata']['symbol'], "\n")
        return str(result['content']['metadata']['symbol'])

    elif 'symbol' in result['token_info']:
        # print("\nToken Symbol is: ", result['token_info']['symbol'], "\n")
        return str(result['token_info']['symbol'])
    else:
        return contract_param #returning the contract if the token name is not found