// Παίρνει το API Key από το LocalStorage, αν δεν υπάρχει ανοίγει παραθυράκι να το ζητήσει
let GEMINI_API_KEY = localStorage.getItem('gemini_api_key');

if (!GEMINI_API_KEY) {
    GEMINI_API_KEY = prompt("Παρακαλώ εισάγετε το Gemini API Key σας για να λειτουργήσει η ανάλυση:");
    if (GEMINI_API_KEY) {
        localStorage.setItem('gemini_api_key', GEMINI_API_KEY);
    }
}

const analyzeButton = document.getElementById('analyzeBtn');
const userInputArea = document.getElementById('userInput');
const resultBox = document.getElementById('resultBox');
const evaluationsList = document.getElementById('evaluationsList');

// Λογική για τα Διαδραστικά Αστέρια
const stars = document.querySelectorAll('#starRatingContainer .star');
let currentSelectedRating = 0; // Αρχικά 0 αστέρια (πρέπει να επιλέξει ο χρήστης)

stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => {
        stars.forEach((s, idx) => {
            if (idx <= index) s.classList.add('hover');
            else s.classList.remove('hover');
        });
    });

    star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
        currentSelectedRating = index + 1; 
        updateStarsDisplay();
    });
});

function updateStarsDisplay() {
    stars.forEach((s, idx) => {
        if (idx < currentSelectedRating) s.classList.add('selected');
        else s.classList.remove('selected');
    });
}

updateStarsDisplay();

// Εμφάνιση ιστορικού
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('myEvals')) || [];
    
    evaluationsList.innerHTML = history.map((item, index) => `
        <div class="history-item">
            <div>
                <strong>${'⭐'.repeat(item.stars || 5)} | ${item.sentiment}</strong>
                <p style="margin: 5px 0;">${item.text}</p>
                <small style="color: #a0aec0;">${item.date}</small>
            </div>
            <button class="delete-btn" onclick="deleteItem(${index})">×</button>
        </div>
    `).join('');
}

window.deleteItem = function(index) {
    if (confirm("Θελεις σίγουρα να διαγράψεις αυτή την αξιολόγηση;")) {
        const history = JSON.parse(localStorage.getItem('myEvals')) || [];
        history.splice(index, 1);
        localStorage.setItem('myEvals', JSON.stringify(history));
        loadHistory();
    }
}

loadHistory();

// Η κύρια συνάρτηση ανάλυσης
analyzeButton.addEventListener('click', async function() {
    let userText = userInputArea.value;

    // ΕΛΕΓΧΟΣ 1: Αν ξέχασε τα αστέρια
    if (currentSelectedRating === 0) {
        alert("Παρακαλώ επίλεξε πρώτα τη βαθμολογία σου με τα αστέρια!");
        return;
    }

    // ΕΛΕΓΧΟΣ 2: Αν ξέχασε το κείμενο
    if (userText.trim() === "") {
        alert("Γράψε κάτι πρώτα!");
        return;
    }

    analyzeButton.innerHTML = '<span class="loader"></span> Αναμονή...';
    analyzeButton.disabled = true;

    const promptInstructions = `Ανάλυσε το εξής κείμενο: "${userText}". Δώσε μου το συναίσθημα (Θετικό 😊, Αρνητικό 😡, ή Ουδέτερο 😐) και μια μικρή σύνοψη. Απάντησε αυστηρά στη μορφή: Συναίσθημα | Σύνοψη`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptInstructions }] }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content.parts[0].text) {
            throw new Error("Invalid API Response Structure");
        }

        const aiResponse = data.candidates[0].content.parts[0].text.trim();
        
        let cleanSentiment = "Ουδέτερο 😐";
        let cleanSummary = aiResponse;

        if (aiResponse.includes('|')) {
            const parts = aiResponse.split('|');
            cleanSentiment = parts[0].trim();
            cleanSummary = parts[1].trim();
        } else {
            if (aiResponse.includes("Θετικό") || aiResponse.includes("😊")) cleanSentiment = "Θετικό 😊";
            if (aiResponse.includes("Αρνητικό") || aiResponse.includes("😡")) cleanSentiment = "Αρνητικό 😡";
        }

        document.getElementById('sentimentResult').innerText = cleanSentiment;
        document.getElementById('summaryResult').innerText = cleanSummary;
        resultBox.style.display = "block";

        if (cleanSentiment.includes("Θετικό")) {
            document.body.style.backgroundColor = "#e6fffa";
        } else if (cleanSentiment.includes("Αρνητικό")) {
            document.body.style.backgroundColor = "#fff5f5";
        } else {
            document.body.style.backgroundColor = "#f0f4f8";
        }

        const history = JSON.parse(localStorage.getItem('myEvals')) || [];
        history.unshift({
            text: userText,
            sentiment: cleanSentiment,
            stars: currentSelectedRating, 
            date: new Date().toLocaleString()
        });
        localStorage.setItem('myEvals', JSON.stringify(history));
        loadHistory();

    } catch (error) {
        alert("Σφάλμα κατά την επικοινωνία με το AI!");
        console.error("Λεπτομέρειες σφάλματος:", error);
    } finally {
        analyzeButton.innerHTML = "Ανάλυση Κειμένου";
        analyzeButton.disabled = false;
    }
});

// --- ΕΛΕΓΧΟΣ ENTER ΚΑΙ ΠΡΟΣΤΑΣΙΑ ΑΠΟ BUG ΑΛΛΑΓΗΣ ΓΡΑΜΜΗΣ ---
userInputArea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Σταματάει την αλλαγή γραμμής ακαριαία

        if (currentSelectedRating === 0) {
            alert("Παρακαλώ επίλεξε πρώτα τη βαθμολογία σου με τα αστέρια!");
            return;
        }

        if (!analyzeButton.disabled) {
            analyzeButton.click();
        }
    }
});