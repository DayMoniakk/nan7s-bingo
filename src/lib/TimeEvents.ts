import confetti from "canvas-confetti";

export enum TimeEvent {
  None,
  Halloween,
  Christmas,
  NewYear,
}

let currentEvent: TimeEvent = TimeEvent.None;

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createEventCanvas(): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.classList.add("events-canvas");

  return canvas;
}

export function checkTimeEvents() {
  const date = new Date();

  checkHalloween(date);
  checkChristmas(date);
  checkNewYear(date);
}

export function getCurrentEvent(): TimeEvent {
  return currentEvent;
}

function checkHalloween(date: Date) {
  if (date.getMonth() + 1 === 10 && date.getDate() >= 30) {
    currentEvent = TimeEvent.Halloween;
    document.body.classList.add("event-halloween");
  }
}

function checkChristmas(date: Date) {
  if (date.getMonth() + 1 === 12 && date.getDate() >= 15) {
    currentEvent = TimeEvent.Christmas;
    document.body.classList.add("event-christmas");

    let skew = 1;
    skew = Math.max(0.8, skew - 0.001);

    setInterval(() => {
      const snow = confetti.create(createEventCanvas(), {
        resize: true,
        useWorker: true,
      });

      snow({
        particleCount: 1,
        startVelocity: 0,
        origin: {
          x: Math.random(),
          // since particles fall down, skew start toward the top
          y: Math.random() * skew - 0.2,
        },
        colors: ["#ffffff"],
        shapes: ["circle"],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 0.7),
        drift: randomInRange(-0.4, 0.4),
        disableForReducedMotion: true,
      });
    }, randomInRange(100, 250));
  }
}

function checkNewYear(date: Date) {
  if (
    (date.getMonth() + 1 === 1 && date.getDate() === 1) ||
    (date.getMonth() + 1 === 12 && date.getDate() === 31)
  ) {
    currentEvent = TimeEvent.NewYear;
    document.body.classList.add("event-new-year");

    const canvas = createEventCanvas();

    const confettiInstance = confetti.create(canvas, {
      resize: true, // Automatically resize canvas
      useWorker: true, // Use a worker for improved performance
    });

    const duration: number = 3 * 1000; // 3 seconds
    const animationEnd: number = Date.now() + duration;
    const options: confetti.Options = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      disableForReducedMotion: true,
    };

    function randomInRange(min: number, max: number): number {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft: number = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        canvas.remove(); // Clean up the canvas after animation
        return;
      }

      const particleCount: number = 50 * (timeLeft / duration);

      // Launch confetti from two different origins
      confettiInstance(
        Object.assign({}, options, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confettiInstance(
        Object.assign({}, options, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }
}
