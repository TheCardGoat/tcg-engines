import {
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearDyingNightLowCredBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearDyingNightLowCred",
  label: "Dying Night - low Street Cred does not defeat gear",
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

    expectEqual("Dying Night low-cred Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 4);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectTrashSize(CYBERPUNK_P2, 0);
    await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, alphaKiroshiOptics.id);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);
  },
};
