import confetti from "canvas-confetti";

export async function playVictoryEffects(): Promise<void> {
  for (let i: number = 0; i < 3; i++) {
    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2,
      },
      disableForReducedMotion: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

export async function playEasterEggEffects(): Promise<void> {
  const clown = confetti.shapeFromText({ text: "🤡", scalar: 5 });
  const circus = confetti.shapeFromText({ text: "🎪", scalar: 5 });
  const manJuggling = confetti.shapeFromText({ text: "🤹‍♂️", scalar: 5 });
  const womanJuggling = confetti.shapeFromText({ text: "🤹‍♀️", scalar: 5 });

    for (let i: number = 0; i < 50; i++) {
    // the initialization is different because the types are not updated to take into account the flat property
    const config = { 
      particleCount: 1,
      shapes: [clown, circus, manJuggling, womanJuggling],
      startVelocity: 0,
      angle: 90,
      gravity: randomInRange(1.5, 2.5),
      disableForReducedMotion: true,
      ticks: 600,
      scalar: 5,
      drift: 0,
      decay: 0.94,
      origin: {
        x: Math.random(),
        y: -0.25,
      },
      flat: true,
    };

    confetti(config);

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}