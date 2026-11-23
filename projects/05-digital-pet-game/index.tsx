// Provided by ../../shared/ep.js (language tabs EN / ES / FR)
declare const EP: { t(key: string): string; useLang(): string };

const { useState, useEffect } = React;

enum Action {
  EAT = "EAT",
  PLAY = "PLAY",
  SLEEP = "SLEEP"
}

enum PetMood { HAPPY, EXCITED, CONTENT, SAD, TIRED, SICK, HUNGRY }

const moodEmoji: Record<PetMood, string> = {
  [PetMood.HAPPY]: "😊",
  [PetMood.EXCITED]: "🤩",
  [PetMood.CONTENT]: "🙂",
  [PetMood.SAD]: "😢",
  [PetMood.TIRED]: "😴",
  [PetMood.SICK]: "🤒",
  [PetMood.HUNGRY]: "🍖"
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function getMood(hunger: number, happiness: number, energy: number): PetMood {
  if (hunger > 70) return PetMood.HUNGRY;
  if (energy < 30) return PetMood.TIRED;
  if (happiness < 30) return PetMood.SAD;
  if (happiness > 80 && energy > 70) return PetMood.EXCITED;
  if (happiness > 60) return PetMood.HAPPY;
  return PetMood.CONTENT;
}

// Every 30 seconds the pet gets hungrier and less happy.
// (A slow tick keeps the timer cheap: the freeCodeCamp tests fast-forward 20 minutes.)
const TICK_MS = 30000;
const TICK_STEP = 10;

export const PetGame = () => {
  EP.useLang(); // re-render when the language tab changes
  const [started, setStarted] = useState(false);
  const [petName, setPetName] = useState("");
  const [hunger, setHunger] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [happiness, setHappiness] = useState(100);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setHunger((h) => clamp(h + TICK_STEP));
      setHappiness((p) => clamp(p - TICK_STEP));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [started]);

  const handleStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("pet-name") as HTMLInputElement;
    const name = input.value.trim();
    if (name === "") return;
    setPetName(name);
    setStarted(true);
  };

  const handleAction = (action: Action) => {
    if (action === Action.EAT) {
      setHunger((h) => clamp(h - 10));
      setEnergy((e) => clamp(e + 5));
    } else if (action === Action.PLAY) {
      setEnergy((e) => clamp(e - 10));
      setHappiness((p) => clamp(p + 10));
    } else {
      setHunger((h) => clamp(h + 10));
      setEnergy((e) => clamp(e + 20));
    }
  };

  if (!started) {
    return (
      <div className="base-container info-panel">
        <form className="start-questions" onSubmit={handleStart}>
          <label htmlFor="pet-name">{EP.t("name_label")}</label>
          <input id="pet-name" type="text" placeholder={EP.t("name_ph")} />
          <button id="set-name-btn" type="submit">{EP.t("start")}</button>
        </form>
      </div>
    );
  }

  const mood = getMood(hunger, happiness, energy);

  const stats = [
    { name: "Hunger", label: EP.t("stat_hunger"), value: hunger, bad: true },
    { name: "Happiness", label: EP.t("stat_happiness"), value: happiness, bad: false },
    { name: "Energy", label: EP.t("stat_energy"), value: energy, bad: false }
  ];

  const level = (value: number, bad: boolean) => {
    const score = bad ? 100 - value : value;
    return score >= 60 ? "high" : score >= 30 ? "medium" : "low";
  };

  return (
    <div className="base-container">
      <h2 className="pet-name">{petName}</h2>
      <div className="game-container">
        <div className="pet-sprite">{moodEmoji[mood]}</div>
        <p className="mood">{EP.t("mood")}: {EP.t("mood_" + PetMood[mood].toLowerCase())}</p>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat stat-bar" key={stat.name}>
            <div className="stat-header">
              <span className="stat-name">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <div className="stat-progress">
              <div
                className={"stat-fill " + level(stat.value, stat.bad)}
                style={{ width: stat.value + "%" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pet-buttons">
        <button id="eat-action" className="pet-button" onClick={() => handleAction(Action.EAT)}>{EP.t("eat")}</button>
        <button id="play-action" className="pet-button" onClick={() => handleAction(Action.PLAY)}>{EP.t("play")}</button>
        <button id="sleep-action" className="pet-button" onClick={() => handleAction(Action.SLEEP)}>{EP.t("sleep")}</button>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<PetGame />);
