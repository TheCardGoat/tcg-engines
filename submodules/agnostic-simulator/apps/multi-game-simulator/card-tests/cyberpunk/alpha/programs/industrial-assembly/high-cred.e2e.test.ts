import { test } from "@playwright/test";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progIndustrialAssemblyHighCred } from "@cyberpunk/testing/e2e-fixtures";

test("Industrial Assembly - 7+ Street Cred triggers draw", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progIndustrialAssemblyHighCred);

  const targetGig = expectDefined(
    "Industrial Assembly high-credit d8",
    (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
  );
  expectEqual("initial high-credit Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 9);
  const program = expectDefined(
    "Industrial Assembly in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
  expectEqual(
    "Industrial Assembly high-credit eligible count",
    (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
    3,
  );

  await pom.resolveEffectTarget([targetGig.id], CYBERPUNK_P1);

  await pom.expectGigValue(targetGig.id, 5);
  expectEqual("Street Cred after high-credit assembly", await pom.getStreetCred(CYBERPUNK_P1), 13);
  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  await pom.expectStructuralState();
});
