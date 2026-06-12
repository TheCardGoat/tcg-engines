import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progRebootOpticsBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progRebootOptics",
  label: "Reboot Optics - friendly units on field",
  references: ["packages/engine/src/cards/alpha/programs/reboot-optics.test.ts"],
  async run(pom) {
    const target = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    const program = expectDefined(
      "Reboot Optics in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Reboot Optics eligible target count", eligible.length, 2);
    if (!eligible.includes(target.instanceId)) {
      throw new Error("Expected Swordwise Huscle to be eligible for Reboot Optics.");
    }

    await pom.resolveEffectTarget([target.instanceId], CYBERPUNK_P1);

    await pom.expectRenderedFieldCardPower(CYBERPUNK_P1, target.instanceId, 9);
    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
  },
};
