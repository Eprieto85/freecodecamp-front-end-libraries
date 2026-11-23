// Compiled from index.tsx (TypeScript + JSX). Edit index.tsx, not this file.
const { useState, useEffect } = React;
var Action;
(function (Action) {
    Action["EAT"] = "EAT";
    Action["PLAY"] = "PLAY";
    Action["SLEEP"] = "SLEEP";
})(Action || (Action = {}));
var PetMood;
(function (PetMood) {
    PetMood[PetMood["HAPPY"] = 0] = "HAPPY";
    PetMood[PetMood["EXCITED"] = 1] = "EXCITED";
    PetMood[PetMood["CONTENT"] = 2] = "CONTENT";
    PetMood[PetMood["SAD"] = 3] = "SAD";
    PetMood[PetMood["TIRED"] = 4] = "TIRED";
    PetMood[PetMood["SICK"] = 5] = "SICK";
    PetMood[PetMood["HUNGRY"] = 6] = "HUNGRY";
})(PetMood || (PetMood = {}));
const moodEmoji = {
    [PetMood.HAPPY]: "😊",
    [PetMood.EXCITED]: "🤩",
    [PetMood.CONTENT]: "🙂",
    [PetMood.SAD]: "😢",
    [PetMood.TIRED]: "😴",
    [PetMood.SICK]: "🤒",
    [PetMood.HUNGRY]: "🍖"
};
const clamp = (value) => Math.max(0, Math.min(100, value));
function getMood(hunger, happiness, energy) {
    if (hunger > 70)
        return PetMood.HUNGRY;
    if (energy < 30)
        return PetMood.TIRED;
    if (happiness < 30)
        return PetMood.SAD;
    if (happiness > 80 && energy > 70)
        return PetMood.EXCITED;
    if (happiness > 60)
        return PetMood.HAPPY;
    return PetMood.CONTENT;
}
// Every 30 seconds the pet gets hungrier and less happy.
// (A slow tick keeps the timer cheap: the freeCodeCamp tests fast-forward 20 minutes.)
const TICK_MS = 30000;
const TICK_STEP = 10;
const PetGame = () => {
    EP.useLang(); // re-render when the language tab changes
    const [started, setStarted] = useState(false);
    const [petName, setPetName] = useState("");
    const [hunger, setHunger] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [happiness, setHappiness] = useState(100);
    useEffect(() => {
        if (!started)
            return;
        const id = setInterval(() => {
            setHunger((h) => clamp(h + TICK_STEP));
            setHappiness((p) => clamp(p - TICK_STEP));
        }, TICK_MS);
        return () => clearInterval(id);
    }, [started]);
    const handleStart = (e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("pet-name");
        const name = input.value.trim();
        if (name === "")
            return;
        setPetName(name);
        setStarted(true);
    };
    const handleAction = (action) => {
        if (action === Action.EAT) {
            setHunger((h) => clamp(h - 10));
            setEnergy((e) => clamp(e + 5));
        }
        else if (action === Action.PLAY) {
            setEnergy((e) => clamp(e - 10));
            setHappiness((p) => clamp(p + 10));
        }
        else {
            setHunger((h) => clamp(h + 10));
            setEnergy((e) => clamp(e + 20));
        }
    };
    if (!started) {
        return (React.createElement("div", { className: "base-container info-panel" },
            React.createElement("form", { className: "start-questions", onSubmit: handleStart },
                React.createElement("label", { htmlFor: "pet-name" }, EP.t("name_label")),
                React.createElement("input", { id: "pet-name", type: "text", placeholder: EP.t("name_ph") }),
                React.createElement("button", { id: "set-name-btn", type: "submit" }, EP.t("start")))));
    }
    const mood = getMood(hunger, happiness, energy);
    const stats = [
        { name: "Hunger", label: EP.t("stat_hunger"), value: hunger, bad: true },
        { name: "Happiness", label: EP.t("stat_happiness"), value: happiness, bad: false },
        { name: "Energy", label: EP.t("stat_energy"), value: energy, bad: false }
    ];
    const level = (value, bad) => {
        const score = bad ? 100 - value : value;
        return score >= 60 ? "high" : score >= 30 ? "medium" : "low";
    };
    return (React.createElement("div", { className: "base-container" },
        React.createElement("h2", { className: "pet-name" }, petName),
        React.createElement("div", { className: "game-container" },
            React.createElement("div", { className: "pet-sprite" }, moodEmoji[mood]),
            React.createElement("p", { className: "mood" },
                EP.t("mood"),
                ": ",
                EP.t("mood_" + PetMood[mood].toLowerCase()))),
        React.createElement("div", { className: "stats-grid" }, stats.map((stat) => (React.createElement("div", { className: "stat stat-bar", key: stat.name },
            React.createElement("div", { className: "stat-header" },
                React.createElement("span", { className: "stat-name" }, stat.label),
                React.createElement("span", { className: "stat-value" }, stat.value)),
            React.createElement("div", { className: "stat-progress" },
                React.createElement("div", { className: "stat-fill " + level(stat.value, stat.bad), style: { width: stat.value + "%" } })))))),
        React.createElement("div", { className: "pet-buttons" },
            React.createElement("button", { id: "eat-action", className: "pet-button", onClick: () => handleAction(Action.EAT) }, EP.t("eat")),
            React.createElement("button", { id: "play-action", className: "pet-button", onClick: () => handleAction(Action.PLAY) }, EP.t("play")),
            React.createElement("button", { id: "sleep-action", className: "pet-button", onClick: () => handleAction(Action.SLEEP) }, EP.t("sleep")))));
};
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(PetGame, null));
