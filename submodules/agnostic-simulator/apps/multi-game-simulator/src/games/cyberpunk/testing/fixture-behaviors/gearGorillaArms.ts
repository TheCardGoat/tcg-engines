import { alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const gearGorillaArmsBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearGorillaArms",
  label: "Gorilla Arms - extra same-sided gig steal",
  references: ["packages/engine/src/cards/spoiler/gear/gorilla-arms.test.ts"],
  async run(pom) {
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaTBugAmateurPhilosopher.id,
    );
    const firstD4 = expectDefined(
      "Gorilla Arms first rival d4",
      (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d4"),
    );

    await pom.expectGigCount(CYBERPUNK_P1, 1);
    await pom.expectGigCount(CYBERPUNK_P2, 3);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 9);

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [firstD4.id] });

    expectEqual("Gorilla Arms attack cleared", await pom.getAttackState(), null);
    await pom.expectGigCount(CYBERPUNK_P1, 3);
    await pom.expectGigCount(CYBERPUNK_P2, 1);
    const remainingRivalD4s = (await pom.getGigDice(CYBERPUNK_P2)).filter(
      (die) => die.dieType === "d4",
    );
    expectEqual("Gorilla Arms remaining rival d4 count", remainingRivalD4s.length, 0);
  },
};
