import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-shieldmaiden.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { restlessShieldmaidenRed as restlessShieldmaidenRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-shieldmaiden";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const restlessShieldmaidenRed = previewCard(restlessShieldmaidenRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-shieldmaiden-red",
  label: "Restless Shieldmaiden (red)",
  description: "happy: Decay puts a −1{h} counter at the end of your turn. Shadow Resist 1\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-shieldmaiden-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: malice, hand: [], arena: [restlessShieldmaidenRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(malice);
    player.endTurn();
    return matchFromEngine(engine, "usurp-preview-restless-shieldmaiden-red");
  },
};
