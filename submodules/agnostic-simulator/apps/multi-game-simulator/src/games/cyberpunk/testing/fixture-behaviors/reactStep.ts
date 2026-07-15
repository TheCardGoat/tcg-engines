import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailSecondhandBombus,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const reactStepBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "reactStep",
  label: "React - block decision",
  references: ["packages/engine/tests/flow/two-turns-with-moves.test.ts"],
  async run(pom) {
    expectEqual("reactStep phase", await pom.getPhase(), "main");
    expectEqual("reactStep active player", await pom.getActivePlayerId(), CYBERPUNK_P2);
    await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
    await pom.expectBoardMode(CYBERPUNK_P2, "view");
    await pom.expectGigCount(CYBERPUNK_P1, 0);
    await pom.expectGigCount(CYBERPUNK_P2, 1);

    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      embracingPowerRetailStarterDeckMinotaur.id,
    );
    const blocker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailSecondhandBombus.id,
    );
    const initialAttack = await pom.getAttackState();
    if (!initialAttack) {
      throw new Error("Expected reactStep to start in an attack.");
    }
    expectEqual("initial attack kind", initialAttack.kind, "direct");
    expectEqual("initial attack step", initialAttack.step, "react");
    expectEqual("initial attacker", initialAttack.attackerId, attacker.instanceId);
    expectEqual("initial defender", initialAttack.defenderId, null);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, false);

    await pom.useBlocker(blocker.instanceId, CYBERPUNK_P1);

    const blockedAttack = await pom.getAttackState();
    if (!blockedAttack) {
      throw new Error("Expected attack state after using a blocker.");
    }
    expectEqual("blocked attack kind", blockedAttack.kind, "fight");
    expectEqual("blocked attack step", blockedAttack.step, "react");
    expectEqual("blocked attack defender", blockedAttack.defenderId, blocker.instanceId);
    expectEqual("blocked attack redirected", blockedAttack.redirectedByBlocker, true);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, blocker.instanceId, true);
    await pom.expectGigCount(CYBERPUNK_P1, 0);
    await pom.expectGigCount(CYBERPUNK_P2, 1);
  },
};
