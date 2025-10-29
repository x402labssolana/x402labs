@echo off
echo Testing Helius API Rate Limiting with curl...
echo.

set HELIUS_URL=https://mainnet.helius-rpc.com/?api-key=07619634-789b-4f04-8997-d0f04c9104dd

echo Making 20 concurrent requests to test rate limiting...
echo.

for /L %%i in (1,1,20) do (
    start /B curl -s -X POST -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":\"test-%%i\",\"method\":\"getHealth\",\"params\":[]}" %HELIUS_URL% > nul
)

echo All requests sent. Waiting for completion...
timeout /t 5 /nobreak > nul

echo.
echo Rate limiting test completed.
echo Check the browser at http://localhost:3000/test-rate-limit for detailed results.
echo.
pause
