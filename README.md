# x402labs - AI Trading Lab

A sophisticated AI-powered trading platform that combines machine learning with decentralized payments using the x402 protocol.

## 🚀 Features

- **AI Trading Agents**: Create and train specialized neural networks for cryptocurrency analysis
- **x402 Payment Integration**: Secure, decentralized payments using USDC on Base network
- **Real-time Token Analysis**: Automated data fetching and analysis for Solana tokens
- **Credit System**: 50 free predictions + 1000 paid predictions via x402
- **MetaMask Integration**: Seamless wallet connection and payment processing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI/ML**: Custom neural networks, TensorFlow.js
- **Blockchain**: Base network, USDC, MetaMask
- **APIs**: Helios RPC, Jupiter API
- **Payments**: x402 protocol

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/x402labssolana/x402labs.git
   cd x402labs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Helios API keys to .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Helios API Keys (get from https://helius.xyz)
HELIOS_RPC_KEY=your_helios_rpc_key
HELIOS_RPC_KEY_BACKUP=your_backup_rpc_key
HELIOS_METADATA_KEY=your_metadata_key

# x402 Payment Configuration
X402_RECEIVER_ADDRESS=0xa80fDB561a70122b7AD35c92362D4a78bF0dDCA9
X402_PAYMENT_AMOUNT=699000000
```

### API Keys Setup

1. Visit [Helios.xyz](https://helius.xyz) to get your API keys
2. Add the keys to your `.env.local` file
3. Never commit `.env.local` to version control

## 💳 Payment System

The platform uses the x402 protocol for secure payments:

- **Free Tier**: 50 AI predictions included
- **Paid Tier**: 699 USDC for 1000 additional predictions
- **Network**: Base Mainnet
- **Token**: USDC
- **Wallet**: MetaMask integration

## 🤖 AI Trading Agents

### Creating an Agent

1. Click "Create New Agent" in the main hub
2. Choose specialization (low-cap, high-cap, meme, DeFi, etc.)
3. Add training data by analyzing token performance
4. Train the neural network
5. Start making predictions

### Training Data

Add token data including:
- Market cap and volume
- Holder distribution and quality
- Token age and liquidity
- Social metrics
- Performance outcome (good/bad)

## 📊 Token Analysis

The platform automatically fetches:
- Real-time price data
- Volume metrics (5min, 1hr, 6hr, 24hr)
- Holder distribution analysis
- Token age calculation
- Market cap estimation

## 🔒 Security

- API keys stored in environment variables
- Secure payment processing via x402
- No sensitive data stored in browser
- Production-ready security measures

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── trading-agent/     # Main trading lab interface
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
├── lib/                 # Utility functions
└── types/               # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🔗 Links

- **Repository**: https://github.com/x402labssolana/x402labs
- **Live Demo**: [Coming Soon]
- **Documentation**: [Coming Soon]

---

Built with ❤️ by the x402labs team
