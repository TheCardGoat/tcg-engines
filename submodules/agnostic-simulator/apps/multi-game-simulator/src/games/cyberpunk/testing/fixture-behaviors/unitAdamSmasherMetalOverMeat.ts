import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";
import { expectIncludes, getZoneDefinitionIds } from "./cyberpunk-unit-fixture-helpers";

export const unitAdamSmasherMetalOverMeatBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitAdamSmasherMetalOverMeat",
  label: "Adam Smasher - play trigger defeats every other unit",
  references: [
    "packages/engine/src/cards/welcometonightcityretail/units/adam-smasher-metal-over-meat.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const adam = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
    );

    await pom.playCardFromHand(adam.instanceId, CYBERPUNK_P1);

    await pom.expectFieldSize(CYBERPUNK_P1, 1);
    await pom.expectFieldSize(CYBERPUNK_P2, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P2, 3);
    await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailAdamSmasherMetalOverMeat.id,
    );

    const p1Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
    expectIncludes("Adam P1 trash", p1Trash, welcomeToNightCityRetailSwordwiseHuscle.id);
    expectIncludes("Adam P1 trash", p1Trash, welcomeToNightCityRetailSecondhandBombus.id);

    const p2Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P2);
    expectIncludes("Adam P2 trash", p2Trash, welcomeToNightCityRetailCorpoSecurity.id);
    expectIncludes("Adam P2 trash", p2Trash, embracingPowerRetailStarterDeckMinotaur.id);
    expectIncludes("Adam P2 trash", p2Trash, welcomeToNightCityRetailJackieWellesRideOrDieChoom.id);
  },
};
