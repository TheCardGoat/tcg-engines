import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearMandibularUpgradeBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearMandibularUpgrade",
  label: "Mandibular Upgrade - gear grants blocker",
  references: [
    "packages/engine/src/cards/alpha/gear/mandibular-upgrade.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/scenarios.test.ts",
  ],
  async run(pom) {
    const blocker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    const initialAttack = await pom.getAttackState();
    if (!initialAttack) {
      throw new Error("Expected Mandibular Upgrade fixture to start in an attack.");
    }

    expectEqual("Mandibular initial attack kind", initialAttack.kind, "direct");
    expectEqual("Mandibular initial attack step", initialAttack.step, "defensive");
    expectEqual("Mandibular attack rival", initialAttack.rivalId, CYBERPUNK_P1);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, blocker.instanceId, "blocker", true);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, false);

    await pom.useBlocker(blocker.instanceId, CYBERPUNK_P1);

    const blockedAttack = await pom.getAttackState();
    if (!blockedAttack) {
      throw new Error("Expected attack state after Mandibular blocker redirect.");
    }
    expectEqual("Mandibular blocked attack kind", blockedAttack.kind, "fight");
    expectEqual("Mandibular blocked attack defender", blockedAttack.defenderId, blocker.instanceId);
    expectEqual("Mandibular blocked attack redirected", blockedAttack.redirectedByBlocker, true);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, true);
    await pom.expectGigCount(CYBERPUNK_P1, 1);
    await pom.expectGigCount(CYBERPUNK_P2, 2);
  },
};
