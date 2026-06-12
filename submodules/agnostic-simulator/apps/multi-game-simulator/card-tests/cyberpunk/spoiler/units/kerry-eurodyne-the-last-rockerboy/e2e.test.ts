import { test } from "@playwright/test";

import { spoilerKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitKerryEurodyneTheLastRockerboy } from "@cyberpunk/testing/e2e-fixtures";

test("Kerry Eurodyne - max-value gig ability draws two", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitKerryEurodyneTheLastRockerboy);

  const kerry = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    spoilerKerryEurodyneTheLastRockerboy.id,
  );
  const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
  if (!abilityCandidates.includes(`${kerry.instanceId}:0`)) {
    throw new Error("Expected Kerry's activated ability to be visible.");
  }

  const handBefore = await pom.getHandSize(CYBERPUNK_P1);
  const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

  await pom.activateAbility(kerry.instanceId, 0, CYBERPUNK_P1);

  await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
  await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
  expectEqual("Kerry deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 2);

  await pom.expectStructuralState();
});
