import { test } from "@playwright/test";

import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Industrial Assembly - low Street Cred", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/progIndustrialAssembly?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const targetGig = expectDefined(
    "Industrial Assembly friendly gig",
    (await pom.getGigDice(CYBERPUNK_P1))[0],
  );
  expectEqual("initial Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 3);
  const program = expectDefined(
    "Industrial Assembly in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
  expectEqual(
    "Industrial Assembly eligible gig count",
    (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
    1,
  );

  await pom.resolveEffectTarget([targetGig.id], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectGigValue(targetGig.id, 4);
  expectEqual("Street Cred after low-credit assembly", await pom.getStreetCred(CYBERPUNK_P1), 4);
  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  await pom.expectStructuralState();
});
