import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailBootlegBlackSapphireShow,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progBootlegBlackSapphireShowRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Bootleg Black Sapphire Show (Retail) - play sells deck and draws from odd/even gigs", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progBootlegBlackSapphireShowRetail);

  const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

  const bootleg = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailBootlegBlackSapphireShow.id,
  );

  await pom.playCardFromHand(bootleg.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 4);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
  expectEqual(
    "Bootleg deck after sell and draw",
    await pom.getDeckSize(CYBERPUNK_P1),
    deckBefore - 3,
  );

  await pom.getCardInZoneByDefinitionId(
    "eddieArea",
    CYBERPUNK_P1,
    welcomeToNightCityRetailCorpoSecurity.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMoxInciters.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailSwordwiseHuscle.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailBootlegBlackSapphireShow.id,
  );

  await pom.expectStructuralState();
});
