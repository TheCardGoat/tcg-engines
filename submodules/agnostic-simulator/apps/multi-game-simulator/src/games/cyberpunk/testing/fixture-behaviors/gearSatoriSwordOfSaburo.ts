import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearSatoriSwordOfSaburoBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearSatoriSwordOfSaburo",
  label: "Satori - draw after winning a fight",
  references: [
    "packages/engine/src/cards/welcometonightcityretail/gear/satori-sword-of-saburo.test.ts",
  ],
  async run(pom) {
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailTBugAmateurPhilosopher.id,
    );
    const defender = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );

    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 6);

    await pom.attackUnit(attacker.instanceId, defender.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1);

    expectEqual("Satori attack cleared", await pom.getAttackState(), null);
    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId(
      "trash",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  },
};
