import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/enshrine-sin.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { enshrineSinRed as enshrineSinRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/enshrine-sin";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const enshrineSinRed = previewCard(enshrineSinRedRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-enshrine-sin-red",
  label: "Enshrine Sin (red)",
  description:
    "From hand it opts, creates a Runechant, and refunds the action point. You may play this from your banished zone. If you do, it costs an additional {r} to play.\nOpt 1, then create a Runechant token. Go again\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "enshrine-sin-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [enshrineSinRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = engine.as(chane);
    Chane.play(enshrineSinRed);
    engine.untilIdle({ optBottom: 0 });
    return matchFromEngine(engine, "usurp-preview-enshrine-sin-red");
  },
};
