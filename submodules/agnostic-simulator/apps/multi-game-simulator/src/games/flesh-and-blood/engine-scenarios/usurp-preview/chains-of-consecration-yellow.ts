import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/instants/chains-of-consecration.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { dromai as dromaiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dromai";
import { ursurTheSoulReaper as ursurTheSoulReaperRules } from "@tcg/flesh-and-blood-cards/cards/tokens/ursur-the-soul-reaper";
import { metisArchangelOfTenacity as metisArchangelOfTenacityRules } from "@tcg/flesh-and-blood-cards/cards/allies/metis-archangel-of-tenacity";
import { chainsOfConsecrationYellow as chainsOfConsecrationYellowRules } from "@tcg/flesh-and-blood-cards/cards/instants/chains-of-consecration";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const dromai = previewCard(dromaiRules);
const ursurTheSoulReaper = previewCard(ursurTheSoulReaperRules);
const metisArchangelOfTenacity = previewCard(metisArchangelOfTenacityRules);
const chainsOfConsecrationYellow = previewCard(chainsOfConsecrationYellowRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-chains-of-consecration-yellow",
  label: "Chains of Consecration (yellow)",
  description:
    "Printed ability and its legal choices. Prevent all damage target ally would deal this turn. If damage is prevented from a Shadow ally this way, banish it face-down.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "chains-of-consecration-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const shadow = true;
    const ally = shadow ? ursurTheSoulReaper : metisArchangelOfTenacity;
    const engine = FabTestEngine.start(
      {
        hero: dromai,
        hand: [chainsOfConsecrationYellow],
        arena: [ally],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(dromai);
    player.play(chainsOfConsecrationYellow);
    player.target(ally);
    game.untilIdle();
    player.activateAttack(ally);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-chains-of-consecration-yellow");
  },
};
