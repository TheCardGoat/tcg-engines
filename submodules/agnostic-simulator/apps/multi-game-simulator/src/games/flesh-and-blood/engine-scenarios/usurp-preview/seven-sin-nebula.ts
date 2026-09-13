import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/weapons/seven-sin-nebula.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { grimFeastRed as grimFeastRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/grim-feast";
import { sevenSinNebula as sevenSinNebulaRules } from "@tcg/flesh-and-blood-cards/cards/weapons/seven-sin-nebula";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const grimFeastRed = previewCard(grimFeastRedRules);
const sevenSinNebula = previewCard(sevenSinNebulaRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-seven-sin-nebula",
  label: "Seven Sin Nebula",
  description:
    "happy: a real card played from banished unlocks the attack and its hit creates a Runechant. Action - {r}, {t}: Attack. Activate this only if you've played a card from a banished zone this turn.\nWhen this hits a hero, create a Runechant token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "seven-sin-nebula"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [sevenSinNebula],
        banished: [grimFeastRed],
        // Grim Feast's separate from-banished discount gap currently charges
        // its full 3; keep 1 more resource for Seven-Sin's attack cost.
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    game.as(dash);
    Chane.play(grimFeastRed, { from: "banished" });
    game.helpers.resolveUntilIdle();
    Chane.activateAttack(sevenSinNebula);
    return matchFromEngine(engine, "usurp-preview-seven-sin-nebula");
  },
};
