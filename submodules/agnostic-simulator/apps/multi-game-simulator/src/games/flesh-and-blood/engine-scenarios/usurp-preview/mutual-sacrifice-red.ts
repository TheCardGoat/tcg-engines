import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/mutual-sacrifice.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { mutualSacrificeRed as mutualSacrificeRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/mutual-sacrifice";
import { restlessClericRed as restlessClericRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);
const mutualSacrificeRed = previewCard(mutualSacrificeRedRules);
const restlessClericRed = previewCard(restlessClericRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-mutual-sacrifice-red",
  label: "Mutual Sacrifice (red)",
  description:
    "happy: discarding an ally after hitting a hero makes them lose 2{h}. When this hits a hero, you may destroy an ally you control or discard an ally. If you do, they lose 2{h}.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "mutual-sacrifice-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        hand: [mutualSacrificeRed, restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    Malice.playAttack(mutualSacrificeRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-mutual-sacrifice-red");
  },
};
