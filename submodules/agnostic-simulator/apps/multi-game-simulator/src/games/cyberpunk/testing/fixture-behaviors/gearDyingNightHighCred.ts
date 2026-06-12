import {
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearDyingNightHighCredBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearDyingNightHighCred",
  label: "Dying Night - high Street Cred defeats rival gear",
  references: ["packages/engine/src/cards/alpha/gear/dying-night-v-s-pistol.test.ts"],
  async run(pom) {
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaTBugAmateurPhilosopher.id,
    );
    const rivalHost = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );
    const rivalGear = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaKiroshiOptics.id,
    );

    expectEqual("Dying Night high-cred Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 8);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 7);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Dying Night eligible rival gear count", eligible.length, 1);
    if (!eligible.includes(rivalGear.instanceId)) {
      throw new Error("Expected rival Kiroshi Optics to be the Dying Night target.");
    }

    await pom.resolveEffectTarget([rivalGear.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaKiroshiOptics.id);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 0);
  },
};
