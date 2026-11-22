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

function showCurrentCard(): void {
  flashcardEl.classList.remove("flipped");
  const card: FlashCard | undefined = currentCards[currentIndex];
  cardSideEl.textContent = "Question";
  cardTextEl.textContent = card ? card.questionText : "No cards left. Add a new one below.";
  counterEl.textContent = card ? "Card " + (currentIndex + 1) + " of " + currentCards.length : "0 cards";
  prevBtn.disabled = currentIndex <= 0;
  nextBtn.disabled = currentIndex >= currentCards.length - 1;
  deleteBtn.disabled = currentCards.length === 0;
}

function addCard(questionText: string, questionAnswer: string): void {
  if (questionText === "" || questionAnswer === "") {
    throw new InvalidUserInputError("Both the question and the answer are required.");
  }
  currentCards.push({ questionText, questionAnswer });
  currentIndex = currentCards.length - 1;
}

flashcardEl.addEventListener("click", () => {
  const card: FlashCard | undefined = currentCards[currentIndex];
  if (!card) return;
  const isFlipped = flashcardEl.classList.toggle("flipped");
  cardSideEl.textContent = isFlipped ? "Answer" : "Question";
  cardTextEl.textContent = isFlipped ? card.questionAnswer : card.questionText;
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
  errorEl.textContent = "";
  try {
    addCard(frontText.value.trim(), backText.value.trim());
    frontText.value = "";
    backText.value = "";
    showCurrentCard();
  } catch (error) {
    if (error instanceof InvalidUserInputError) {
      errorEl.textContent = error.message;
    } else {
      throw error;
    }
  }
});

showCurrentCard();
