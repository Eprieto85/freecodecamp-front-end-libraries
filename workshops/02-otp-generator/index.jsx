const { useState, useEffect, useRef } = React;

const DURATION = 5;

const OTPGenerator = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  // Countdown: one tick per second while a code is active
  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  // Stop automatically when the time reaches zero
  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setExpired(true);
    }
  }, [timeLeft, isActive]);

  const generateOTP = () => {
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    setOtp(newOtp);
    setTimeLeft(DURATION);
    setExpired(false);
    setIsActive(true);
  };

  let timerText = "";
  if (expired) {
    timerText = "OTP expired. Click the button to generate a new OTP.";
  } else if (isActive) {
    timerText = `Expires in: ${timeLeft} seconds`;
  }

  const progress = isActive ? (timeLeft / DURATION) * 100 : 0;

  return (
    <div className="container">
      <h1 id="otp-title">OTP Generator</h1>
      <h2 id="otp-display" className={expired ? "dead" : ""}>
        {otp ? otp : "Click 'Generate OTP' to get a code"}
      </h2>
      <div className="bar"><div className="bar-fill" style={{ width: progress + "%" }} /></div>
      <p id="otp-timer" aria-live="polite">{timerText}</p>
      <button id="generate-otp-button" onClick={generateOTP} disabled={isActive}>
        Generate OTP
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<OTPGenerator />);
