import { test } from "@playwright/test";

import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Reboot Optics - no friendly units", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/progRebootOpticsEmptyField?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  await pom.expectFieldSize(CYBERPUNK_P1, 0);
  const program = expectDefined(
    "Reboot Optics in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  expectEqual(
    "Reboot Optics empty-field eligible count",
    (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
    0,
  );
  await pom.expectFieldSize(CYBERPUNK_P1, 0);
  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  await pom.expectStructuralState();
});
