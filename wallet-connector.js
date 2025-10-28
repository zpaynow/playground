/**
 * Modern Multi-Wallet Connector
 * Supports MetaMask, Coinbase Wallet, Brave Wallet, Trust Wallet, and others
 */

class WalletConnector {
    constructor() {
        this.userAddress = null;
        this.provider = null;
        this.selectedWallet = null;
        this.onConnectCallbacks = [];
        this.onDisconnectCallbacks = [];
        this.init();
    }

    init() {
        // Check if already connected on page load
        this.checkExistingConnection();
    }

    async checkExistingConnection() {
        const savedWallet = localStorage.getItem('selectedWallet');
        const savedAddress = localStorage.getItem('userAddress');

        if (savedWallet && savedAddress) {
            try {
                const provider = this.detectProvider(savedWallet);
                if (provider) {
                    const accounts = await provider.request({ method: 'eth_accounts' });
                    if (accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
                        this.userAddress = accounts[0];
                        this.provider = provider;
                        this.selectedWallet = savedWallet;
                        this.setupListeners();
                        this.updateUI();
                        this.triggerConnectCallbacks();
                    }
                }
            } catch (error) {
                console.log('No existing connection found');
                localStorage.removeItem('selectedWallet');
                localStorage.removeItem('userAddress');
            }
        }
    }

    detectProvider(walletName) {
        if (typeof window.ethereum === 'undefined') {
            return null;
        }

        // Handle multiple providers
        if (window.ethereum.providers?.length > 0) {
            switch (walletName) {
                case 'metamask':
                    return window.ethereum.providers.find(p => p.isMetaMask && !p.isBraveWallet);
                case 'coinbase':
                    return window.ethereum.providers.find(p => p.isCoinbaseWallet);
                case 'brave':
                    return window.ethereum.providers.find(p => p.isBraveWallet);
                case 'trust':
                    return window.ethereum.providers.find(p => p.isTrust);
                default:
                    return window.ethereum.providers[0];
            }
        }

        // Single provider - check which one it is
        const provider = window.ethereum;
        switch (walletName) {
            case 'metamask':
                return provider.isMetaMask && !provider.isBraveWallet ? provider : null;
            case 'coinbase':
                return provider.isCoinbaseWallet ? provider : null;
            case 'brave':
                return provider.isBraveWallet ? provider : null;
            case 'trust':
                return provider.isTrust ? provider : null;
            default:
                return provider;
        }
    }

    getAvailableWallets() {
        const wallets = [];

        if (typeof window.ethereum === 'undefined') {
            return wallets;
        }

        const providers = window.ethereum.providers || [window.ethereum];

        // Check for MetaMask
        if (providers.some(p => p.isMetaMask && !p.isBraveWallet)) {
            wallets.push({
                name: 'metamask',
                label: 'MetaMask',
                icon: '🦊'
            });
        }

        // Check for Coinbase Wallet
        if (providers.some(p => p.isCoinbaseWallet)) {
            wallets.push({
                name: 'coinbase',
                label: 'Coinbase Wallet',
                icon: '🔵'
            });
        }

        // Check for Brave Wallet
        if (providers.some(p => p.isBraveWallet)) {
            wallets.push({
                name: 'brave',
                label: 'Brave Wallet',
                icon: '🦁'
            });
        }

        // Check for Trust Wallet
        if (providers.some(p => p.isTrust)) {
            wallets.push({
                name: 'trust',
                label: 'Trust Wallet',
                icon: '⚡'
            });
        }

        // If we have a generic provider that doesn't match above, add it as "Other Wallet"
        if (wallets.length === 0 && typeof window.ethereum !== 'undefined') {
            wallets.push({
                name: 'other',
                label: 'Web3 Wallet',
                icon: '💼'
            });
        }

        return wallets;
    }

    showWalletModal() {
        const availableWallets = this.getAvailableWallets();

        if (availableWallets.length === 0) {
            this.showNoWalletModal();
            return;
        }

        if (availableWallets.length === 1) {
            // Auto-connect if only one wallet available
            this.connectToWallet(availableWallets[0].name);
            return;
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'wallet-modal';
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.style.animation = 'fadeIn 0.2s ease-out';

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform"
                 style="animation: slideUp 0.3s ease-out;">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                        Connect Wallet
                    </h2>
                    <button onclick="walletConnector.closeModal()"
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <p class="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Choose your preferred wallet to connect
                </p>

                <div class="space-y-3">
                    ${availableWallets.map(wallet => `
                        <button onclick="walletConnector.connectToWallet('${wallet.name}')"
                                class="wallet-option w-full flex items-center gap-4 p-4 rounded-xl border-2
                                       border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary
                                       hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group">
                            <div class="text-4xl">${wallet.icon}</div>
                            <div class="flex-1 text-left">
                                <div class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                    ${wallet.label}
                                </div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                    Connect with ${wallet.label}
                                </div>
                            </div>
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    `).join('')}
                </div>

                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                        By connecting, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);

        // Add animations
        if (!document.getElementById('wallet-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'wallet-modal-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showNoWalletModal() {
        const modal = document.createElement('div');
        modal.id = 'wallet-modal';
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.style.animation = 'fadeIn 0.2s ease-out';

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform"
                 style="animation: slideUp 0.3s ease-out;">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                        No Wallet Found
                    </h2>
                    <button onclick="walletConnector.closeModal()"
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="text-center py-4">
                    <div class="text-6xl mb-4">🔒</div>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        No Web3 wallet detected. Please install a wallet extension to continue.
                    </p>

                    <div class="space-y-3">
                        <a href="https://metamask.io/download/" target="_blank"
                           class="block w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
                                  hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50
                                  transition-all text-center group">
                            <div class="font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                                🦊 Install MetaMask
                            </div>
                        </a>
                        <a href="https://www.coinbase.com/wallet/downloads" target="_blank"
                           class="block w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
                                  hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50
                                  transition-all text-center group">
                            <div class="font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                                🔵 Install Coinbase Wallet
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    async connectToWallet(walletName) {
        this.closeModal();

        try {
            const provider = this.detectProvider(walletName);

            if (!provider) {
                alert('Selected wallet not found. Please make sure it is installed and enabled.');
                return;
            }

            const accounts = await provider.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                alert('No accounts found. Please unlock your wallet and try again.');
                return;
            }

            this.userAddress = accounts[0];
            this.provider = provider;
            this.selectedWallet = walletName;

            // Save to localStorage
            localStorage.setItem('selectedWallet', walletName);
            localStorage.setItem('userAddress', this.userAddress);

            this.setupListeners();
            this.updateUI();
            this.triggerConnectCallbacks();

            console.log('Wallet connected:', this.userAddress);

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            if (error.code === 4001) {
                alert('Connection request rejected. Please try again and approve the connection.');
            } else {
                alert('Failed to connect wallet: ' + error.message);
            }
        }
    }

    setupListeners() {
        if (!this.provider) return;

        // Account change listener
        this.provider.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                this.disconnect();
            } else {
                this.userAddress = accounts[0];
                localStorage.setItem('userAddress', this.userAddress);
                this.updateUI();
                this.triggerConnectCallbacks();
            }
        });

        // Chain change listener
        this.provider.on('chainChanged', () => {
            window.location.reload();
        });

        // Disconnect listener (for some wallets)
        this.provider.on('disconnect', () => {
            this.disconnect();
        });
    }

    disconnect() {
        this.userAddress = null;
        this.provider = null;
        this.selectedWallet = null;
        localStorage.removeItem('selectedWallet');
        localStorage.removeItem('userAddress');
        this.updateUI();
        this.triggerDisconnectCallbacks();
    }

    updateUI() {
        const walletBtn = document.getElementById('connect-wallet-btn');
        const walletStatus = document.getElementById('wallet-status');
        const walletAddressEl = document.getElementById('wallet-address');

        if (this.userAddress) {
            if (walletBtn) walletBtn.classList.add('hidden');
            if (walletStatus) walletStatus.classList.remove('hidden');
            if (walletStatus) walletStatus.classList.add('flex');
            if (walletAddressEl) {
                walletAddressEl.textContent = this.userAddress.substring(0, 6) + '...' + this.userAddress.substring(38);
            }
        } else {
            if (walletBtn) walletBtn.classList.remove('hidden');
            if (walletStatus) walletStatus.classList.add('hidden');
            if (walletStatus) walletStatus.classList.remove('flex');
        }
    }

    closeModal() {
        const modal = document.getElementById('wallet-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => modal.remove(), 200);
        }
    }

    onConnect(callback) {
        this.onConnectCallbacks.push(callback);
    }

    onDisconnect(callback) {
        this.onDisconnectCallbacks.push(callback);
    }

    triggerConnectCallbacks() {
        this.onConnectCallbacks.forEach(callback => {
            try {
                callback(this.userAddress, this.provider);
            } catch (error) {
                console.error('Error in connect callback:', error);
            }
        });
    }

    triggerDisconnectCallbacks() {
        this.onDisconnectCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in disconnect callback:', error);
            }
        });
    }

    getAddress() {
        return this.userAddress;
    }

    getProvider() {
        return this.provider;
    }

    isConnected() {
        return this.userAddress !== null;
    }
}

// Create global instance
const walletConnector = new WalletConnector();

// Global function to open modal
function connectWallet() {
    walletConnector.showWalletModal();
}

// Add fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);
