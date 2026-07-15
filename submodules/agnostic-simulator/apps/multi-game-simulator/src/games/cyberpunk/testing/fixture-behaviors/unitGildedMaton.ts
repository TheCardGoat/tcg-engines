import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailGildedMatoN,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
} from "./cyberpunk-unit-fixture-helpers";

export const unitGildedMatonBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitGildedMaton",
  label: "Gilded Maton - defeats friendly gear to defeat cheap rival unit",
  references: [
    "packages/engine/src/cards/welcometonightcityretail/units/gilded-mato-n.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const maton = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      welcomeToNightCityRetailGildedMatoN.id,
    );
    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
    const gear = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    const cheapTarget = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );

    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
    await pom.playCardFromHand(maton.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
    const gearChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    expectEqual("Gilded Maton gear choice count", gearChoices.length, 1);
    expectEqual("Gilded Maton gear choice", gearChoices[0], gear.instanceId);

    await pom.resolveCardToMove(gear.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectIncludes(
      "Gilded Maton eligible targets",
      eligibleDefinitions,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expectExcludes(
      "Gilded Maton eligible targets",
      eligibleDefinitions,
      embracingPowerRetailStarterDeckMinotaur.id,
    );

    await pom.resolveEffectTarget([cheapTarget.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 0);
    await pom.expectFieldSize(CYBERPUNK_P1, 2);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId(
      "trash",
      CYBERPUNK_P1,
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    await pom.getCardInZoneByDefinitionId(
      "trash",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  },
};
