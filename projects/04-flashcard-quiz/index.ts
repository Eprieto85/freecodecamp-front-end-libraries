// Provided by ../../shared/ep.js (language tabs EN / ES / FR)
declare const EP: { t(key: string): string };

interface FlashCard {
  questionText: string;
  questionAnswer: string;
}

class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
  }
}

const currentCards: FlashCard[] = [
  { questionText: "What does HTML stand for?", questionAnswer: "HyperText Markup Language" },
  { questionText: "What does CSS stand for?", questionAnswer: "Cascading Style Sheets" },
  { questionText: "Which hook stores state in a React component?", questionAnswer: "useState" },
  { questionText: "What does TypeScript add to JavaScript?", questionAnswer: "Static types" }
];

let currentIndex = 0;
let isFlipped = false;
let errorKey = "";

const flashcardEl = document.getElementById("flashcard") as HTMLDivElement;
const cardTextEl = document.getElementById("card-text") as HTMLParagraphElement;
const cardSideEl = document.getElementById("card-side") as HTMLSpanElement;
const counterEl = document.getElementById("counter") as HTMLParagraphElement;
const errorEl = document.getElementById("form-error") as HTMLParagraphElement;
const deleteBtn = document.getElementById("delete-btn") as HTMLButtonElement;
const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
const entryForm = document.getElementById("entry-form") as HTMLFormElement;
const frontText = document.getElementById("front-text") as HTMLTextAreaElement;
const backText = document.getElementById("back-text") as HTMLTextAreaElement;

// Draws the current state; also runs when the language tab changes.
function render(): void {
  const card: FlashCard | undefined = currentCards[currentIndex];
  flashcardEl.classList.toggle("flipped", isFlipped && !!card);
  cardSideEl.textContent = EP.t(isFlipped && card ? "answer" : "question");
  if (!card) {
    cardTextEl.textContent = EP.t("no_cards");
  } else {
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

function showCurrentCard(): void {
  isFlipped = false;
  render();
}

function addCard(questionText: string, questionAnswer: string): void {
  if (questionText === "" || questionAnswer === "") {
    throw new InvalidUserInputError("Both the question and the answer are required.");
  }
  currentCards.push({ questionText, questionAnswer });
  currentIndex = currentCards.length - 1;
}

flashcardEl.addEventListener("click", () => {
  if (!currentCards[currentIndex]) return;
  isFlipped = !isFlipped;
  render();
});

deleteBtn.addEventListener("click", () => {
  if (currentCards.length === 0) return;
  currentCards.splice(currentIndex, 1);
  currentIndex = Math.max(0, currentIndex - 1);
  showCurrentCard();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) currentIndex--;
  showCurrentCard();
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < currentCards.length - 1) currentIndex++;
  showCurrentCard();
});

entryForm.addEventListener("submit", (event: Event) => {
  event.preventDefault();
  errorKey = "";
  try {
    addCard(frontText.value.trim(), backText.value.trim());
    frontText.value = "";
    backText.value = "";
    showCurrentCard();
  } catch (error) {
    if (error instanceof InvalidUserInputError) {
      errorKey = "error_empty";
      render();
    } else {
      throw error;
    }
  }
});

window.addEventListener("ep-lang", render);

showCurrentCard();
