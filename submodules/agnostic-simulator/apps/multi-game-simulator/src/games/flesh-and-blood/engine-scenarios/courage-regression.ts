import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { headJabBlue, headJabRed } from "@tcg/flesh-and-blood-cards/cards/actions/head-jab";
import { visitThePrizeRoomBlue } from "@tcg/flesh-and-blood-cards/cards/actions/visit-the-prize-room";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { olympia } from "@tcg/flesh-and-blood-cards/cards/heroes/olympia";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const COURAGE_REGRESSION_SCENARIOS = {
  "courage-consumption-and-logs": {
    id: "courage-consumption-and-logs",
    label: "Courage — consumption and logs",
    description:
      "Two Courage tokens have been created and consumed by Head Jab. The current attack gets +2 power, both creation lines remain in history, and the next Head Jab stays in hand for an expiry check.",
    group: "combat",
    tags: ["courage", "tokens", "active-effects", "logs", "regression"],
    viewerId: "player-1",
    botMode: "off",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: olympia,
          hand: [visitThePrizeRoomBlue, visitThePrizeRoomBlue, headJabRed, headJabBlue],
          actionPoints: 1,
          resourcePoints: 2,
          deck: 6,
        },
        { hero: dash, hand: [], life: 20, deck: 6 },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Olympia = engine.as(olympia);

      Olympia.play(visitThePrizeRoomBlue);
      engine.untilIdle({ optionals: "decline", ordering: "listed" });
      Olympia.play(visitThePrizeRoomBlue);
      engine.untilIdle({ optionals: "decline", ordering: "listed" });
      Olympia.must.playAttack(headJabRed);
      engine.advanceUntil({ stopAt: "defend", ordering: "listed" });

      return matchFromEngine(engine, "courage-consumption-and-logs");
    },
  },
} satisfies FabScenarioCollection;
