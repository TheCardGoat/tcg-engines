import { test } from "@playwright/test";

import { welcomeToNightCityRetailKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitKerryEurodyneTheLastRockerboyRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Kerry Eurodyne (Retail) - spend without 8+ value gig does not draw", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitKerryEurodyneTheLastRockerboyRetail,
  );

  const kerry = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailKerryEurodyneTheLastRockerboy.id,
  );
  const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
  if (!abilityCandidates.includes(`${kerry.instanceId}:0`)) {
    throw new Error("Expected Kerry's activated ability to be visible.");
  }

  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

  await pom.activateAbility(kerry.instanceId, 0, CYBERPUNK_P1);

  await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore);
  expectEqual("Kerry deck unchanged", await pom.getDeckSize(CYBERPUNK_P1), deckBefore);

  await pom.expectStructuralState();
});
