let goldy = 100;
let mediaRecorder;
let nahranaData = [];

const displej = document.getElementById('goldy-displej');
const video = document.getElementById('video-nahled');
const statusText = document.getElementById('status-text');
const btnNahrat = document.getElementById('btn-nahrat');

function aktualizuj() {
    displej.innerText = goldy + " G";
}

async function startNahravani() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        video.style.display = "block";
        statusText.style.display = "none";

        // Nastavení rekordéru
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) nahranaData.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(nahranaData, { type: 'video/webm' });
            alert("Video úspěšně nahráno na server Micro Cam! (Velikost: " + Math.round(blob.size/1024) + " KB)");
            // Tady by v budoucnu byl kód pro odeslání do databáze
            nahranaData = []; 
        };

        // Nahráváme 5 sekund
        mediaRecorder.start();
        btnNahrat.innerText = "NAHRÁVÁM... (5s)";
        btnNahrat.style.background = "#555";

        setTimeout(() => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop()); // Vypne kameru po nahrání
            video.style.display = "none";
            statusText.style.display = "block";
            statusText.innerText = "Video bylo odesláno! Čeká na schválení.";
            btnNahrat.innerText = "NAHRÁT VIDEO (-5 G)";
            btnNahrat.style.background = "#ff0050";
        }, 5000);

    } catch (err) {
        alert("Chyba kamery: " + err);
    }
}

btnNahrat.onclick = () => {
    if (goldy >= 5) {
        goldy -= 5;
        aktualizuj();
        startNahravani();
    } else {
        alert("Nedostatek Goldů!");
    }
};

// Bonus: Kliknutí na oko přidá 1 Gold (simulace sledování)
document.getElementById('btn-sledovat').onclick = () => {
    goldy += 1;
    aktualizuj();
};
