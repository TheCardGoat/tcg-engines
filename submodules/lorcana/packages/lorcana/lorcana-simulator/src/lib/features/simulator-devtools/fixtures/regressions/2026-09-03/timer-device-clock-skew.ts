import { createFixture } from "../../fixture-factory.js";

export const timerDeviceClockSkewRegression = createFixture({
  id: "timer-device-clock-skew",
  name: "Timer - Device clock skew",
  description:
    "A fresh clock must not become negative or offer premature timeout actions when the device wall clock changes.",
  seed: "timer-device-clock-skew",
  skipPreGame: true,
  timeControl: {
    mode: "dynamic",
    config: {
      initialReserveMs: 180_000,
      reserveCapMs: 180_000,
      perActionBonusMs: 0,
      perTurnPassBonusMs: 0,
      resetTimeOnSkipMs: 0,
      graceMs: 15_000,
    },
  },
  playerOne: { deck: 10 },
  playerTwo: { deck: 10 },
});
