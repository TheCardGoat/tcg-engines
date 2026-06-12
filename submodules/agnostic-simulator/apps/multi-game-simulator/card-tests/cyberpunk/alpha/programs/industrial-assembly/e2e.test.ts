import { test } from "@playwright/test";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progIndustrialAssembly } from "@cyberpunk/testing/e2e-fixtures";

test("Industrial Assembly - low Street Cred", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progIndustrialAssembly);

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
