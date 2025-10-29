# pip install solana==0.30.2 solders==0.20.0
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from datetime import datetime, timezone, timedelta

RPC_URL = "https://misty-omniscient-resonance.solana-mainnet.quiknode.pro/6e1cba920b0de0a853ca3ada8dc0d55a872f8326"
MINT_STR = "6XSMxfh8wAbHMVZ9WA3j6EsyVMyZGD96VHhiU1aBpump"  # <-- replace with your mint

def get_oldest_signature_and_time(client: Client, addr: Pubkey):
    """
    Pages backwards through get_signatures_for_address to find the oldest tx.
    Returns (signature:str, slot:int, block_time:int|None) or (None, None, None) if none found.
    """
    before = None
    oldest_sig = None
    oldest_slot = None
    oldest_bt = None

    while True:
        resp = client.get_signatures_for_address(addr, before=before, limit=1000)
        vals = resp.value  # a list of ConfirmedSignatureForAddress2 objs (new-style)
        if not vals:
            break

        # The list is newest -> oldest; the last element in this page is the oldest for this page
        last = vals[-1]
        oldest_sig = last.signature
        oldest_slot = last.slot
        oldest_bt = last.block_time  # may be None on very old txs

        # Prepare to fetch the next page (older than the last signature we just saw)
        before = oldest_sig

        # If page shorter than 1000, we reached the end
        if len(vals) < 1000:
            break

    return oldest_sig, oldest_slot, oldest_bt

def main():
    client = Client(RPC_URL)
    mint = Pubkey.from_string(MINT_STR)

    sig, slot, block_time = get_oldest_signature_and_time(client, mint)
    if sig is None:
        print("No transactions found for this mint address (is it correct?).")
        return

    if block_time is None:
        # Fallback: ask RPC for the block time of the slot (might still be None for very old slots)
        bt_resp = client.get_block_time(slot)
        block_time = bt_resp.value  # int | None

    if block_time is None:
        print(f"Oldest tx sig: {sig}\nSlot: {slot}\nBlock time unavailable from RPC.")
        return

    mint_dt = datetime.fromtimestamp(block_time, tz=timezone.utc)
    now = datetime.now(timezone.utc)
    age = now - mint_dt

    # Pretty print
    def human(delta: timedelta) -> str:
        secs = int(delta.total_seconds())
        days, rem = divmod(secs, 86400)
        hrs, rem = divmod(rem, 3600)
        mins, _ = divmod(rem, 60)
        parts = []
        if days: parts.append(f"{days}d")
        if hrs: parts.append(f"{hrs}h")
        if mins: parts.append(f"{mins}m")
        return " ".join(parts) or f"{secs}s"

    print(f"Mint address: {MINT_STR}")
    print(f"Oldest tx sig: {sig}")
    print(f"Minted at:    {mint_dt.isoformat()} (UTC)")
    print(f"Age:          {human(age)}")

if __name__ == "__main__":
    main()
