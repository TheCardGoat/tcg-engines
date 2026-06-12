import { alphaGoroTakemuraLosingHisWay } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const unitGoroTakemuraLosingHisWayBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitGoroTakemuraLosingHisWay",
  label: "Goro Takemura - power scales with face-up legends",
  references: [
    "packages/engine/src/cards/alpha/units/goro-takemura-losing-his-way.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const goro = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaGoroTakemuraLosingHisWay.id,
    );

    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, false);

    await pom.attackRival(goro.instanceId, CYBERPUNK_P1);
    const attack = await pom.getAttackState();
    if (!attack) {
      throw new Error("Expected Goro to start a direct attack.");
    }
    expectEqual("Goro attack kind", attack.kind, "direct");
    expectEqual("Goro attack step", attack.step, "offensive");
    await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);

    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    const steal = await pom.getAttackState();
    if (!steal) {
      throw new Error("Expected Goro direct attack to reach the steal step.");
    }
    expectEqual("Goro steal step", steal.step, "steal");
  },
};
