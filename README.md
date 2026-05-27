# 🤖 AI Text Analyzer Dashboard

Μια σύγχρονη, single-page web εφαρμογή (SPA) που πραγματοποιεί **Ανάλυση Συναισθήματος (Sentiment Analysis)** και **Σύνοψη Κειμένου (Summarization)** σε πραγματικό χρόνο, αξιοποιώντας το **Gemini 2.5 Flash API** της Google.

Δημιουργήθηκε ως ένα ανθεκτικό (error-tolerant) front-end MVP που προσφέρει εξαιρετική εμπειρία χρήστη (UX) και δυναμική διαχείριση κατάστασης (state management).

---

## ✨ Χαρακτηριστικά (Features)

* **Direct AI Integration:** Σύνδεση με το Gemini API για ακαριαία ανάλυση κειμένου.
* **Interactive Star Rating UI:** Διαδραστική επιλογή βαθμολογίας με αστέρια (hover/click state) τύπου Skroutz/Amazon, υλοποιημένη αποκλειστικά με Vanilla JS & DOM manipulation.
* **Dynamic Theme Switching:** Το background της εφαρμογής αλλάζει αυτόματα χρώμα (απαλό πράσινο/κόκκινο/γκρι) ανάλογα με το συναίσθημα που επιστρέφει το AI (Θετικό, Αρνητικό, Ουδέτερο).
* **Keyboard Accessibility (UX):** Δυνατότητα υποβολής της ανάλυσης απευθείας με το πάτημα του `Enter` (με χρήση `preventDefault()` για αποφυγή αλλαγής γραμμής).
* **Persistent Local History:** Αποθήκευση των προηγούμενων αξιολογήσεων στο `LocalStorage` (μαζί με ημερομηνία/ώρα και σκορ), ώστε τα δεδομένα να διατηρούνται μετά από refresh.
* **Granular Data Management (CRUD):** Ο διαχειριστής μπορεί να διαγράψει επιλεκτικά οποιαδήποτε αξιολόγηση επιθυμεί από το ιστορικό.
* **Visual Feedback:** Ενσωματωμένος CSS loading spinner κατά τη διάρκεια της αναμονής της απάντησης από το API.

---

## 🛠️ Τεχνολογίες (Tech Stack)

* **HTML5:** Δομημένη και σημασιολογική (semantic) αρχιτεκτονική.
* **CSS3:** Clean UI, Flexbox layout, Custom CSS Animations (για τον loader) και ομαλές μεταβάσεις χρωμάτων (`transition`).
* **Vanilla JavaScript (ES6+):** * Asynchronous Programming (`Async/Await` & `Fetch API`)
    * DOM Event Listeners (`keydown`, `mouseover`, `click`)
    * Browser Storage Web API (`LocalStorage`)
    * Error Handling (`Try/Catch` blocks) για θωράκιση από invalid API responses.

---

## 🔒 Ασφάλεια API Key (Security Notice)

Για λόγους ασφαλείας και προστασίας του API Key (αποφυγή έκθεσης στο client-side repository), η εφαρμογή υιοθετεί μια **prompt-based local storage** προσέγγιση:
Την πρώτη φορά που φορτώνει η σελίδα, ζητά από τον χρήστη να εισάγει το δικό του Gemini API Key. Το κλειδί αποθηκεύεται με ασφάλεια τοπικά στον browser (`LocalStorage`) και δεν ανεβαίνει ποτέ στον κώδικα του GitHub.

> *Σημείωση για Production:* Σε ένα enterprise περιβάλλον, η κλήση αυτή θα γινόταν μέσω ενός ασφαλούς Backend Proxy (π.χ. Node.js/Express) χρησιμοποιώντας περιβαλλοντικές μεταβλητές (`.env`).

---

## 🚀 Πώς να το τρέξετε τοπικά (Local Setup)

1. Κάντε clone ή download το repository.
2. Ανοίξτε το αρχείο `index.html` σε οποιονδήποτε σύγχρονο browser (Chrome, Brave, Edge).
3. Εισάγετε το Gemini API Key σας στο παράθυρο που θα εμφανιστεί.
4. Γράψτε μια κριτική, επιλέξτε αστέρια και πατήστε **Enter** ή το κουμπί **Ανάλυση Κειμένου**!
