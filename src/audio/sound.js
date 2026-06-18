const soundState = {
  context: null,
  masterGain: null,
  enabled: true,
};

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!soundState.context) {
    soundState.context = new AudioContextClass();
    soundState.masterGain = soundState.context.createGain();
    soundState.masterGain.gain.value = 0.75;
    soundState.masterGain.connect(soundState.context.destination);
  }

  return soundState.context;
}

function withAudioContext(callback) {
  if (!soundState.enabled) {
    return;
  }

  const context = getAudioContext();

  if (!context || !soundState.masterGain) {
    return;
  }

  if (context.state === "suspended") {
    context.resume()
      .then(() => {
        if (soundState.enabled) {
          callback(context);
        }
      })
      .catch(() => {});

    return;
  }

  callback(context);
}

function scheduleTone(context, frequency, duration, type, volume, startTime) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const attack = Math.min(0.012, duration * 0.35);
  const releaseWindow = Math.min(0.045, duration * 0.5);
  const releaseStart = startTime + Math.max(attack, duration - releaseWindow);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0.001, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
  gainNode.gain.setValueAtTime(volume, releaseStart);
  gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(soundState.masterGain);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

function playToneSequence(tones) {
  withAudioContext((context) => {
    const baseTime = context.currentTime + 0.008;

    tones.forEach((tone) => {
      scheduleTone(
        context,
        tone.frequency,
        tone.duration,
        tone.type || "sine",
        tone.volume,
        baseTime + (tone.delay || 0),
      );
    });
  });
}

function playTone(frequency, duration, type = "sine", volume = 0.025) {
  playToneSequence([
    {
      frequency,
      duration,
      type,
      volume,
      delay: 0,
    },
  ]);
}

export function isSoundEnabled() {
  return soundState.enabled;
}

export function setSoundEnabled(value) {
  soundState.enabled = value;
}

export function toggleSound() {
  setSoundEnabled(!soundState.enabled);
  return soundState.enabled;
}

export function playSelectSound() {
  playTone(520, 0.05, "sine", 0.018);
}

export function playCorrectSound() {
  playToneSequence([
    { frequency: 660, duration: 0.07, type: "sine", volume: 0.022, delay: 0 },
    { frequency: 880, duration: 0.085, type: "sine", volume: 0.024, delay: 0.075 },
  ]);
}

export function playWrongSound() {
  playTone(180, 0.12, "triangle", 0.02);
}

export function playCompleteSound() {
  playToneSequence([
    { frequency: 523.25, duration: 0.08, type: "sine", volume: 0.022, delay: 0 },
    { frequency: 659.25, duration: 0.085, type: "sine", volume: 0.024, delay: 0.09 },
    { frequency: 783.99, duration: 0.11, type: "sine", volume: 0.026, delay: 0.19 },
  ]);
}
