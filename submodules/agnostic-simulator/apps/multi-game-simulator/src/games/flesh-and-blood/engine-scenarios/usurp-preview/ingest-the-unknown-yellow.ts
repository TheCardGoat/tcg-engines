import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/ingest-the-unknown.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";

import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { ingestTheUnknownYellow as ingestTheUnknownYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/ingest-the-unknown";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);

const snatchRed = previewCard(snatchRedRules);
const ingestTheUnknownYellow = previewCard(ingestTheUnknownYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-ingest-the-unknown-yellow",
  label: "Ingest the Unknown (yellow)",
  description:
    "happy: the banished deck-top's base power becomes the attack's bonus. When this attacks, banish the top card of your deck. This gets +X{p}, where X is the banished card's base {p}.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "ingest-the-unknown-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [ingestTheUnknownYellow],
        deck: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    Rhinar.playAttack(ingestTheUnknownYellow);
    game.advanceUntil({ stopAt: "defend" });
    return matchFromEngine(engine, "usurp-preview-ingest-the-unknown-yellow");
  },
};
