import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/fallen-herald.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { fallenHeraldYellow as fallenHeraldYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/fallen-herald";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const snatchRed = previewCard(snatchRedRules);
const fallenHeraldYellow = previewCard(fallenHeraldYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-fallen-herald-yellow",
  label: "Fallen Herald (yellow)",
  description:
    "happy: banishing this from hand prevents the next 4 damage. Instant - Banish this from your hand: Prevent the next 4 damage that would be dealt to you this turn.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "fallen-herald-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [fallenHeraldYellow],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dash = game.as(dash);
    const Chane = game.as(chane);
    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Chane.activate(fallenHeraldYellow);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-fallen-herald-yellow");
  },
};
