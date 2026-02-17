// Stock Market Academy - Bulletproof Version
// No external dependencies, full error handling

const ADMIN_PASSWORD = "PARENT2024";
const STARTING_CAPITAL = 100;

// Simple asset database
const ASSETS = {
    SPX: { name: "S&P 500", price: 4500, volatility: 0.02 },
    GOLD: { name: "Gold", price: 2000, volatility: 0.015 },
    OIL: { name: "Oil", price: 80, volatility: 0.03 },
    TBILL: { name: "T-Bill", price: 100, volatility: 0.001 },
    CASH: { name: "Cash", price: 1, volatility: 0 }
};

// Simple news events
const NEWS = [
    { headline: "Market Rally", summary: "Stocks surge on positive economic data. S&P 500 up 3%.", impact: 0.03 },
    { headline: "Banking Crisis", summary: "Major bank fails. Flight to safety pushes bonds and gold higher.", impact: -0.05 },
    { headline: "Oil Shock", summary: "Oil prices spike 40% on supply concerns.", impact: 0.02 },
    { headline: "Rate Cut", summary: "Federal Reserve cuts rates. Markets celebrate cheap money.", impact: 0.04 },
    { headline: "Recession Fears", summary: "Economic data weakens. Investors flee to safety.", impact: -0.03 }
];

// Game state
const game = {
    state: {
        users: {},
        currentUser: null,
        day: 0,
        prices: {},
        news: [],
        pendingTrade: null
    },

    // Initialize
    init() {
        console.log("Initializing game...");
        try {
            this.loadState();
            this.initPrices();
            this.render();
            console.log("Game initialized successfully");
        } catch (e) {
            console.error("Init error:", e);
            alert("Error starting game. Check console.");
        }
    },

    // Initialize prices
    initPrices() {
        if (Object.keys(this.state.prices).length === 0) {
            for (let symbol in ASSETS) {
                this.state.prices[symbol] = ASSETS[symbol].price;
            }
            this.saveState();
        }
    },

    // Save to localStorage
    saveState() {
        try {
            localStorage.setItem('stockGame', JSON.stringify(this.state));
            console.log("State saved");
        } catch (e) {
            console.error("Save failed:", e);
        }
    },

    // Load from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem('stockGame');
            if (saved) {
                this.state = JSON.parse(saved);
                console.log("State loaded");
            }
        } catch (e) {
            console.error("Load failed:", e);
        }
    },

    // Render current screen
    render() {
        if (!this.state.currentUser) {
            this.renderLogin();
        } else {
            this.renderGame();
        }
    },

    // Render login screen
    renderLogin() {
        const screen = document.getElementById('loginScreen');
        const gameScreen = document.getElementById('gameScreen');
        
        if (!screen || !gameScreen) {
            console.error("Screen elements not found");
            return;
        }

        screen.classList.add('active');
        gameScreen.classList.remove('active');
        
        this.renderUserList();
    },

    // Render user list
    renderUserList() {
        const list = document.getElementById('userList');
        if (!list) return;
        
        list.innerHTML = '';
        
        for (let username in this.state.users) {
            const user = this.state.users[username];
            const value = this.calculatePortfolioValue(user);
            const change = ((value - STARTING_CAPITAL) / STARTING_CAPITAL * 100).toFixed(1);
            
            const card = document.createElement('div');
            card.className = 'user-card';
            card.onclick = () => this.selectUser(username);
            card.innerHTML = `
                <div class="name">${username}</div>
                <div class="value">$${value.toFixed(2)}</div>
                <div class="change">${change > 0 ? '+' : ''}${change}%</div>
            `;
            list.appendChild(card);
        }
    },

    // Show create user form
    showCreateUser() {
        const form = document.getElementById('createUserForm');
        if (form) {
            form.classList.remove('hidden');
        }
    },

    // Hide create user form
    hideCreateUser() {
        const form = document.getElementById('createUserForm');
        if (form) {
            form.classList.add('hidden');
        }
        const input = document.getElementById('newUsername');
        if (input) input.value = '';
    },

    // Create new user
    createUser() {
        const input = document.getElementById('newUsername');
        if (!input) return;
        
        const username = input.value.trim();
        
        if (username.length < 4 || username.length > 12) {
            alert('Username must be 4-12 characters');
            return;
        }
        
        if (this.state.users[username]) {
            alert('Username already exists');
            return;
        }
        
        this.state.users[username] = {
            username: username,
            cash: STARTING_CAPITAL,
            holdings: {},
            transactions: [],
            day: 0
        };
        
        this.saveState();
        this.hideCreateUser();
        this.renderUserList();
        alert(`User ${username} created!`);
    },

    // Select user
    selectUser(username) {
        this.state.currentUser = username;
        this.saveState();
        this.renderGame();
    },

    // Render game screen
    renderGame() {
        const loginScreen = document.getElementById('loginScreen');
        const gameScreen = document.getElementById('gameScreen');
        
        if (!loginScreen || !gameScreen) return;
        
        loginScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        this.updateHeader();
        this.showTab('portfolio');
    },

    // Update header
    updateHeader() {
        const user = this.state.users[this.state.currentUser];
        if (!user) return;
        
        const usernameEl = document.getElementById('username');
        const dayEl = document.getElementById('day');
        const valueEl = document.getElementById('portfolioValue');
        const changeEl = document.getElementById('portfolioChange');
        
        if (usernameEl) usernameEl.textContent = user.username;
        if (dayEl) dayEl.textContent = user.day;
        
        const value = this.calculatePortfolioValue(user);
        const change = value - STARTING_CAPITAL;
        const changePct = (change / STARTING_CAPITAL * 100).toFixed(2);
        
        if (valueEl) valueEl.textContent = `$${value.toFixed(2)}`;
        if (changeEl) {
            changeEl.textContent = `${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePct}%)`;
            changeEl.className = change >= 0 ? 'change positive' : 'change negative';
        }
    },

    // Calculate portfolio value
    calculatePortfolioValue(user) {
        let total = user.cash;
        for (let symbol in user.holdings) {
            const shares = user.holdings[symbol];
            const price = this.state.prices[symbol] || 0;
            total += shares * price;
        }
        return total;
    },

    // Show tab
    showTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(btn => {
            btn.classList.remove('active');
        });
        event?.target?.classList?.add('active');
        
        const content = document.getElementById('content');
        if (!content) return;
        
        if (tab === 'portfolio') {
            this.renderPortfolio();
        } else if (tab === 'market') {
            this.renderMarket();
        } else if (tab === 'news') {
            this.renderNews();
        }
    },

    // Render portfolio
    renderPortfolio() {
        const user = this.state.users[this.state.currentUser];
        if (!user) return;
        
        const content = document.getElementById('content');
        if (!content) return;
        
        let html = '<div class="section"><h3>Your Holdings</h3>';
        
        // Cash
        html += `
            <div class="item">
                <div class="item-header">
                    <div class="item-title">CASH</div>
                    <div class="item-value">$${user.cash.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        // Holdings
        for (let symbol in user.holdings) {
            const shares = user.holdings[symbol];
            const price = this.state.prices[symbol];
            const value = shares * price;
            const asset = ASSETS[symbol];
            
            html += `
                <div class="item" onclick="game.showAsset('${symbol}')">
                    <div class="item-header">
                        <div class="item-title">${symbol}</div>
                        <div class="item-value">$${value.toFixed(2)}</div>
                    </div>
                    <div class="item-detail">${shares.toFixed(4)} shares @ $${price.toFixed(2)}</div>
                    <div class="item-detail">${asset.name}</div>
                </div>
            `;
        }
        
        html += '</div>';
        
        // Transactions
        html += '<div class="section"><h3>Recent Transactions</h3>';
        const recent = user.transactions.slice(-10).reverse();
        
        if (recent.length === 0) {
            html += '<p class="loading">No transactions yet</p>';
        } else {
            html += '<table><tr><th>Day</th><th>Action</th><th>Asset</th><th>Amount</th></tr>';
            recent.forEach(tx => {
                html += `
                    <tr>
                        <td>${tx.day}</td>
                        <td class="${tx.action.toLowerCase()}">${tx.action}</td>
                        <td>${tx.symbol}</td>
                        <td>$${tx.amount.toFixed(2)}</td>
                    </tr>
                `;
            });
            html += '</table>';
        }
        
        html += '</div>';
        content.innerHTML = html;
    },

    // Render market
    renderMarket() {
        const content = document.getElementById('content');
        if (!content) return;
        
        let html = '<div class="section"><h3>Available Assets</h3>';
        
        for (let symbol in ASSETS) {
            const asset = ASSETS[symbol];
            const price = this.state.prices[symbol];
            
            html += `
                <div class="item" onclick="game.showAsset('${symbol}')">
                    <div class="item-header">
                        <div class="item-title">${symbol}</div>
                        <div class="item-value">$${price.toFixed(2)}</div>
                    </div>
                    <div class="item-detail">${asset.name}</div>
                </div>
            `;
        }
        
        html += '</div>';
        content.innerHTML = html;
    },

    // Render news
    renderNews() {
        const content = document.getElementById('content');
        if (!content) return;
        
        let html = '<div class="section"><h3>Market News</h3>';
        
        if (this.state.news.length === 0) {
            html += '<p class="loading">No news yet. Advance time to see events!</p>';
        } else {
            this.state.news.slice(-10).reverse().forEach(item => {
                html += `
                    <div class="news-item ${item.impact < 0 ? 'crisis' : ''}">
                        <div class="news-date">Day ${item.day}</div>
                        <div class="news-headline">${item.headline}</div>
                        <div class="news-summary">${item.summary}</div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        content.innerHTML = html;
    },

    // Show asset detail
    showAsset(symbol) {
        const modal = document.getElementById('assetModal');
        const nameEl = document.getElementById('assetName');
        const infoEl = document.getElementById('assetInfo');
        
        if (!modal || !nameEl || !infoEl) return;
        
        const asset = ASSETS[symbol];
        const price = this.state.prices[symbol];
        const user = this.state.users[this.state.currentUser];
        const holding = user.holdings[symbol] || 0;
        
        nameEl.textContent = `${symbol} - ${asset.name}`;
        infoEl.innerHTML = `
            <p><strong>Price:</strong> $${price.toFixed(2)}</p>
            <p><strong>You own:</strong> ${holding.toFixed(4)} shares ($${(holding * price).toFixed(2)})</p>
            <p><strong>Your cash:</strong> $${user.cash.toFixed(2)}</p>
        `;
        
        this.state.pendingTrade = { symbol };
        modal.classList.add('active');
    },

    // Close asset modal
    closeAsset() {
        const modal = document.getElementById('assetModal');
        if (modal) modal.classList.remove('active');
        this.state.pendingTrade = null;
    },

    // Execute trade
    trade(action) {
        if (!this.state.pendingTrade) return;
        
        this.state.pendingTrade.action = action;
        this.showPasswordModal();
    },

    // Show password modal
    showPasswordModal() {
        const modal = document.getElementById('passwordModal');
        if (modal) {
            modal.classList.add('active');
        }
        const input = document.getElementById('tradePassword');
        if (input) {
            input.value = '';
            input.focus();
        }
    },

    // Close password modal
    closePassword() {
        const modal = document.getElementById('passwordModal');
        if (modal) modal.classList.remove('active');
    },

    // Verify password and execute trade
    verifyPassword() {
        const input = document.getElementById('tradePassword');
        if (!input) return;
        
        if (input.value !== ADMIN_PASSWORD) {
            alert('Incorrect password');
            return;
        }
        
        this.closePassword();
        this.executeTrade();
    },

    // Execute the pending trade
    executeTrade() {
        if (!this.state.pendingTrade) return;
        
        const { symbol, action } = this.state.pendingTrade;
        const amountInput = document.getElementById('tradeAmount');
        if (!amountInput) return;
        
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) {
            alert('Enter valid amount');
            return;
        }
        
        const user = this.state.users[this.state.currentUser];
        const price = this.state.prices[symbol];
        
        if (action === 'buy') {
            if (amount > user.cash) {
                alert(`Not enough cash. You have $${user.cash.toFixed(2)}`);
                return;
            }
            
            const shares = amount / price;
            user.cash -= amount;
            user.holdings[symbol] = (user.holdings[symbol] || 0) + shares;
            
            user.transactions.push({
                day: user.day,
                action: 'BUY',
                symbol,
                shares,
                price,
                amount
            });
            
            alert(`Bought ${shares.toFixed(4)} shares of ${symbol}`);
            
        } else if (action === 'sell') {
            const holding = user.holdings[symbol] || 0;
            const maxSell = holding * price;
            
            if (amount > maxSell) {
                alert(`You can only sell $${maxSell.toFixed(2)} worth`);
                return;
            }
            
            const shares = amount / price;
            user.holdings[symbol] -= shares;
            user.cash += amount;
            
            if (user.holdings[symbol] < 0.0001) {
                delete user.holdings[symbol];
            }
            
            user.transactions.push({
                day: user.day,
                action: 'SELL',
                symbol,
                shares,
                price,
                amount
            });
            
            alert(`Sold ${shares.toFixed(4)} shares of ${symbol}`);
        }
        
        this.saveState();
        this.closeAsset();
        this.updateHeader();
        this.showTab('portfolio');
    },

    // Advance time
    advanceTime() {
        const user = this.state.users[this.state.currentUser];
        if (!user) return;
        
        // Random days between 1-25
        const days = Math.floor(Math.random() * 25) + 1;
        user.day += days;
        this.state.day += days;
        
        // Update prices
        for (let symbol in this.state.prices) {
            const asset = ASSETS[symbol];
            const change = (Math.random() - 0.5) * 2 * asset.volatility * days;
            this.state.prices[symbol] *= (1 + change);
            this.state.prices[symbol] = Math.max(this.state.prices[symbol], 0.01);
        }
        
        // Generate news (0-3 events)
        const numEvents = Math.floor(Math.random() * 4);
        for (let i = 0; i < numEvents; i++) {
            const event = NEWS[Math.floor(Math.random() * NEWS.length)];
            this.state.news.push({
                day: user.day,
                headline: event.headline,
                summary: event.summary
            });
            
            // Apply impact to SPX
            this.state.prices.SPX *= (1 + event.impact);
        }
        
        this.saveState();
        this.updateHeader();
        
        if (numEvents > 0) {
            alert(`${numEvents} news event(s) occurred!`);
            this.showTab('news');
        } else {
            this.showTab('portfolio');
        }
    },

    // Show admin panel
    showAdmin() {
        const modal = document.getElementById('adminModal');
        if (modal) modal.classList.add('active');
        const input = document.getElementById('adminPassword');
        if (input) {
            input.value = '';
            input.focus();
        }
    },

    // Close admin panel
    closeAdmin() {
        const modal = document.getElementById('adminModal');
        if (modal) modal.classList.remove('active');
        const content = document.getElementById('adminContent');
        if (content) content.classList.add('hidden');
    },

    // Verify admin password
    verifyAdmin() {
        const input = document.getElementById('adminPassword');
        if (!input) return;
        
        if (input.value !== ADMIN_PASSWORD) {
            alert('Incorrect admin password');
            return;
        }
        
        const content = document.getElementById('adminContent');
        if (content) {
            content.classList.remove('hidden');
            this.renderAdminUsers();
        }
    },

    // Render admin users
    renderAdminUsers() {
        const container = document.getElementById('adminUsers');
        if (!container) return;
        
        let html = '';
        for (let username in this.state.users) {
            const user = this.state.users[username];
            const value = this.calculatePortfolioValue(user);
            html += `<p><strong>${username}:</strong> $${value.toFixed(2)} (Day ${user.day})</p>`;
        }
        
        container.innerHTML = html || '<p>No users</p>';
    },

    // Export data
    exportData() {
        const data = JSON.stringify(this.state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stock-game-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        alert('Data exported!');
    }
};

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    game.init();
});

console.log("Stock Market Academy loaded. Admin password: PARENT2024");
