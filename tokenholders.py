
from typing import List, Union
import requests
import json


from asyncstdlib import enumerate as async_enumerate  



def get_token_price(token_address):
    """Get the current price of a token in USD"""
    try:

        url = f"https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112,{token_address}"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            if token_address in data:
                return float(data[token_address]['usdPrice'])
        

        return None
    except Exception as e:
        print(f"Error getting token price: {e}")
        return None

def get_token_holders_with_min_value(token_address, min_usd_value=8.0, helius_key=None):
    

    token_price = get_token_price(token_address)
    if token_price is None:
        print(f"Could not retrieve price for token {token_address}")
        return []
    
    print(f"Token price: ${token_price:.6f}")

    helius_key = input("050174d4-9124-486f-8562-3b7ffbf04b26")

    url = f"https://mainnet.helius-rpc.com/?api-key={helius_key}"

    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getProgramAccounts",
        "params": [
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", 
            {
                "encoding": "jsonParsed",
                "filters": [
                    {
                        "dataSize": 165  
                    },
                    {
                        "memcmp": {
                            "offset": 0,  
                            "bytes": token_address  
                        }
                    }
                ]
            }
        ]
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)


    
    if response.status_code != 200:
        print(f"Error fetching token holders: {response.status_code}")
        return []
    
    result = response.json()
    
    if 'result' not in result:
        print("No result found in response")
        return []
    
    holders_above_threshold = []
    
    for acc in result['result']:
        try:
            account_info = acc['account']['data']['parsed']['info']
            owner = account_info['owner']
            token_amount = float(account_info['tokenAmount']['uiAmount'])
            

            usd_value = token_amount * token_price
            

            if usd_value >= min_usd_value:
                holder_data = {
                    'owner': owner,
                    'token_amount': token_amount,
                    'usd_value': usd_value
                }
                holders_above_threshold.append(holder_data)
                
        except Exception as e:
            print(f"Error processing account: {e}")
            continue
    

    holders_above_threshold.sort(key=lambda x: x['usd_value'], reverse=True)
    
    return holders_above_threshold





def main_token_holders():

    token_address = "5KCspct2KqKm58ZqVJExoihyT1cB8xXAFJt2xxbpump" 
    
    print(f"Retrieving token holders for: {token_address}")
    print(f"Minimum USD value threshold: $8.00")
    print("-" * 60)
    

    holders = get_token_holders_with_min_value(token_address, min_usd_value=8.0)
    
    if not holders:
        print("No holders found with minimum $8 value or error occurred")
        return
    
    print(f"Found {len(holders)} holders with minimum $8 value:")
    print("-" * 60)
    

    for i, holder in enumerate(holders, 1):
        print(f"{i:3d}. Owner: {holder['owner']}")
        print(f"     Token Amount: {holder['token_amount']:,.2f}")
        print(f"     USD Value: ${holder['usd_value']:,.2f}")
        print()
    

    output_data = {
        "token_address": token_address,
        "min_usd_value": 8.0,
        "total_holders": len(holders),
        "holders": holders
    }
    
    filename = f"token_holders_{token_address[:8]}_min8usd.json"
    with open(filename, 'w', encoding='utf-8') as outfile:
        json.dump(output_data, outfile, indent=2)
    
    print(f"Results saved to: {filename}")
    print(f"Total holders with $8+ value: {len(holders)}")




main_token_holders()