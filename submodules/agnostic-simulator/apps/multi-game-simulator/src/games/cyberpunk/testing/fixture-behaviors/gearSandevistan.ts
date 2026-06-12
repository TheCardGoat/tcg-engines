import { alphaCorpoSecurity, alphaSandevistan, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearSandevistanBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearSandevistan",
  label: "Sandevistan - played unit can attack spent units",
  references: ["packages/engine/src/cards/alpha/gear/sandevistan.test.ts"],
  async run(pom) {
    const unitInHand = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    const gearInHand = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaSandevistan.id,
    );
    const rivalTarget = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectEddies(CYBERPUNK_P1, 6);

    await pom.playCardFromHand(unitInHand.instanceId, CYBERPUNK_P1);
    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    await pom.attachGearFromHand(gearInHand.instanceId, host.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 0);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, host.instanceId, 8);
    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P1,
      host.instanceId,
      "canAttackOnPlayedTurnAgainstUnits",
      true,
    );

    await pom.attackUnit(host.instanceId, rivalTarget.instanceId, CYBERPUNK_P1);

    const attack = await pom.getAttackState();
    if (!attack) {
      throw new Error("Expected Sandevistan host to attack a spent rival unit.");
    }
    expectEqual("Sandevistan attack kind", attack.kind, "fight");
    expectEqual("Sandevistan attack step", attack.step, "offensive");
    expectEqual("Sandevistan attack defender", attack.defenderId, rivalTarget.instanceId);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, host.instanceId, true);
  },
};
