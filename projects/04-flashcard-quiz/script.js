// Compiled from index.ts (TypeScript). Edit index.ts, not this file.
class InvalidUserInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidUserInputError";
    }
}
const currentCards = [
    { questionText: "What does HTML stand for?", questionAnswer: "HyperText Markup Language" },
    { questionText: "What does CSS stand for?", questionAnswer: "Cascading Style Sheets" },
    { questionText: "Which hook stores state in a React component?", questionAnswer: "useState" },
    { questionText: "What does TypeScript add to JavaScript?", questionAnswer: "Static types" }
];
let currentIndex = 0;
let isFlipped = false;
let errorKey = "";
const flashcardEl = document.getElementById("flashcard");
const cardTextEl = document.getElementById("card-text");
const cardSideEl = document.getElementById("card-side");
const counterEl = document.getElementById("counter");
const errorEl = document.getElementById("form-error");
const deleteBtn = document.getElementById("delete-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const entryForm = document.getElementById("entry-form");
const frontText = document.getElementById("front-text");
const backText = document.getElementById("back-text");
// Draws the current state; also runs when the language tab changes.
function render() {
    const card = currentCards[currentIndex];
    flashcardEl.classList.toggle("flipped", isFlipped && !!card);
    cardSideEl.textContent = EP.t(isFlipped && card ? "answer" : "question");
    if (!card) {
        cardTextEl.textContent = EP.t("no_cards");
    }
    else {
        cardTextEl.textContent = isFlipped ? card.questionAnswer : card.questionText;
    }
    counterEl.textContent = card
        ? EP.t("card") + " " + (currentIndex + 1) + " " + EP.t("of") + " " + currentCards.length
        : "0 " + EP.t("cards");
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= currentCards.length - 1;
    deleteBtn.disabled = currentCards.length === 0;
    errorEl.textContent = errorKey ? EP.t(errorKey) : "";
}
function showCurrentCard() {
    isFlipped = false;
    render();
}
function addCard(questionText, questionAnswer) {
    if (questionText === "" || questionAnswer === "") {
        throw new InvalidUserInputError("Both the question and the answer are required.");
    }
    currentCards.push({ questionText, questionAnswer });
    currentIndex = currentCards.length - 1;
}
flashcardEl.addEventListener("click", () => {
    if (!currentCards[currentIndex])
        return;
    isFlipped = !isFlipped;
    render();
});
deleteBtn.addEventListener("click", () => {
    if (currentCards.length === 0)
        return;
    currentCards.splice(currentIndex, 1);
    currentIndex = Math.max(0, currentIndex - 1);
    showCurrentCard();
});
prevBtn.addEventListener("click", () => {
    if (currentIndex > 0)
        currentIndex--;
    showCurrentCard();
});
nextBtn.addEventListener("click", () => {
    if (currentIndex < currentCards.length - 1)
        currentIndex++;
    showCurrentCard();
});
entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    errorKey = "";
    try {
        addCard(frontText.value.trim(), backText.value.trim());
        frontText.value = "";
        backText.value = "";
        showCurrentCard();
    }
    catch (error) {
        if (error instanceof InvalidUserInputError) {
            errorKey = "error_empty";
            render();
        }
        else {
            throw error;
        }
    }
});
window.addEventListener("ep-lang", render);
showCurrentCard();
