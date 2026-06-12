import {
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerRoyceDonTCallMeSimon,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "./cyberpunk-unit-fixture-helpers";

export const unitRoyceDonTCallMeSimonLowCredBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitRoyceDonTCallMeSimonLowCred",
  label: "Royce - low Street Cred targets power two or less",
  references: [
    "packages/engine/src/cards/spoiler/units/royce-don-t-call-me-simon.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const royce = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerRoyceDonTCallMeSimon.id,
    );
    const lowlife = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaRuthlessLowlife.id,
    );

    expectEqual("Royce low P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 2);
    expectEqual("Royce low P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 6);
    await pom.playCardFromHand(royce.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectEqual("Royce low eligible count", eligible.length, 1);
    expectIncludes("Royce low eligible targets", eligibleDefinitions, alphaRuthlessLowlife.id);
    expectExcludes("Royce low eligible targets", eligibleDefinitions, alphaSwordwiseHuscle.id);

    await pom.resolveEffectTarget([lowlife.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);
  },
};
