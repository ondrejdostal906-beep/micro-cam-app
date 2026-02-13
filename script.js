const SB_URL = 'https://ueewbbbcbqcjuevihqwl.supabase.co';
const SB_KEY = 'sb_publishable_E6TmwD4EzvHijHipQnfajQ_0YayF6zI'; 

let goldy = 100;

async function nactiData() {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/profiles?id=eq.1&select=*`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const data = await res.json();
    if (data.length > 0) {
      goldy = parseFloat(data[0].goldy);
      aktualizujDisplej();
    }
  } catch (err) { console.error(err); }
}

async function ulozData(novyPocet) {
  try {
    await fetch(`${SB_URL}/rest/v1/profiles?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ goldy: novyPocet })
    });
  } catch (err) { console.error(err); }
}

function aktualizujDisplej() {
  // Zaokrouhlení na 1 desetinné místo pro přehlednost
  document.getElementById('goldy-displej').innerText = goldy.toFixed(1) + " G";
  
  // Zobrazení tlačítka pro výběr
  const vyberSekce = document.getElementById('vyber-sekce');
  if (goldy >= 500) {
    vyberSekce.innerHTML = `<button onclick="window.location.href='https://buy.stripe.com'" style="padding: 10px; background: #00f2ea; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; width: 220px;">VYBRAT 500 KČ (Zisk!)</button>`;
  } else {
    vyberSekce.innerHTML = `<button onclick="koupitGoldy()" style="padding: 10px; background: #ffd700; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; width: 220px; color: #000;">KOUPIT 100 G (150 Kč)</button>`;
  }
}

// Funkce pro nákup (přesměrování na bránu)
async function koupitGoldy() {
  alert("Přesměrování na platební bránu Stripe...");
  // V reálu zde bude link na tvůj Stripe Checkout
  goldy += 100;
  await ulozData(goldy);
  aktualizujDisplej();
}

document.getElementById('btn-sledovat').onclick = async () => {
  goldy += 0.1; // Udržitelná odměna
  aktualizujDisplej();
  await ulozData(goldy);
};

document.getElementById('btn-nahrat').onclick = async () => {
  if (goldy >= 5) {
    goldy -= 5;
    aktualizujDisplej();
    await ulozData(goldy);
    spustKameru();
  } else {
    alert("Pro nahrání potřebuješ 5 G. Kup si je!");
  }
};

async function spustKameru() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.getElementById('video-nahled');
  video.srcObject = stream;
  video.style.display = "block";
  document.getElementById('status-text').style.display = "none";
}

nactiData();

