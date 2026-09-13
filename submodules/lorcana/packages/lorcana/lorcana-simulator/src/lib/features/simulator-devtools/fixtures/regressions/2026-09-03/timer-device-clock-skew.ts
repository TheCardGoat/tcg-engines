import { createFixture } from "../../fixture-factory.js";

export const timerDeviceClockSkewRegression = createFixture({
  id: "timer-device-clock-skew",
  name: "Timer - Device clock skew",
  description:
    "A fresh clock must not become negative or offer premature timeout actions when the device wall clock changes.",
  seed: "timer-device-clock-skew",
  skipPreGame: true,
  playerOne: { deck: 10 },
  playerTwo: { deck: 10 },
});
