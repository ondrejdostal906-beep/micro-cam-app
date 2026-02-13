// ÚDAJE PRO TVOU DATABÁZI (JIŽ VYPLNĚNO)
const SB_URL = 'https://ueewbbbcbqcjuevihqwl.supabase.co';
const SB_KEY = 'sb_publishable_E6TmwD4EzvHijHipQnfajQ_0YayF6zI'; 

let goldy = 100;

// Načtení Goldů při startu aplikace ze Supabase
async function nactiData() {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/profiles?select=*`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const data = await res.json();
    if (data.length > 0) {
      goldy = data[0].goldy; // Vezme goldy z prvního řádku v tabulce
      document.getElementById('goldy-displej').innerText = goldy + " G";
    }
  } catch (err) { console.log("Chyba načítání:", err); }
}

// Uložení Goldů do Supabase
async function ulozData(novyPocet) {
  try {
    await fetch(`${SB_URL}/rest/v1/profiles?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ goldy: novyPocet })
    });
  } catch (err) { console.log("Chyba ukládání:", err); }
}

// Propojení s tlačítkem oko (Sledovat)
document.getElementById('btn-sledovat').onclick = async () => {
  goldy += 1;
  document.getElementById('goldy-displej').innerText = goldy + " G";
  await ulozData(goldy);
};

// Propojení s tlačítkem Nahrát
document.getElementById('btn-nahrat').onclick = async () => {
  if (goldy >= 5) {
    goldy -= 5;
    document.getElementById('goldy-displej').innerText = goldy + " G";
    await ulozData(goldy);
    spustKameru();
  } else {
    alert("Máš málo Goldů!");
  }
};

// Funkce pro spuštění kamery
async function spustKameru() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.getElementById('video-nahled');
  video.srcObject = stream;
  video.style.display = "block";
  document.getElementById('status-text').style.display = "none";
}

// Spustit načítání při otevření stránky
nactiData();
