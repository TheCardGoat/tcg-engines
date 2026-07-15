import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";
import { expectIncludes, getChoiceDefinitionIds } from "./cyberpunk-unit-fixture-helpers";

export const unitMeredithStoutStoneColdCorpoBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitMeredithStoutStoneColdCorpo",
  label: "Meredith Stout - rival gig decrease recovers from trash",
  references: [
    "packages/engine/src/cards/spoiler/units/meredith-stout-stone-cold-corpo.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo.id,
    );
    const evelyn = await pom.getCardInZoneByIndex("legendArea", CYBERPUNK_P2, 0);
    const p1Gig = (await pom.getGigDice(CYBERPUNK_P1))[0];
    if (!p1Gig) {
      throw new Error("Expected Meredith fixture to start with a friendly gig.");
    }

    await pom.expectTrashSize(CYBERPUNK_P1, 2);
    await pom.callLegend(evelyn.instanceId, CYBERPUNK_P2);
    const calledEvelyn = await pom.getCardInZoneByInstanceId(
      "legendArea",
      CYBERPUNK_P2,
      evelyn.instanceId,
    );
    expectEqual(
      "Evelyn definition after call",
      calledEvelyn.definitionId,
      welcomeToNightCityRetailEvelynParkerBeautifulEnigma.id,
    );

    await pom.expectGigValue(p1Gig.id, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
    const recoverChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    const recoverDefinitions = await getChoiceDefinitionIds(pom, recoverChoices);
    expectIncludes(
      "Meredith recovery choices",
      recoverDefinitions,
      welcomeToNightCityRetailKiroshiOptics.id,
    );

    const kiroshiId =
      recoverChoices[recoverDefinitions.indexOf(welcomeToNightCityRetailKiroshiOptics.id)];
    if (!kiroshiId) {
      throw new Error("Expected Kiroshi Optics to be recoverable by Meredith.");
    }
    await pom.resolveCardToMove(kiroshiId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P2, 4);
    await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expectEqual("Meredith active player remains P2", await pom.getActivePlayerId(), CYBERPUNK_P2);
  },
};
