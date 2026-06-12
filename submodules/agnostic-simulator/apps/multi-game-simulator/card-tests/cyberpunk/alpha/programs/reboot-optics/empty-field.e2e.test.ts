import { test } from "@playwright/test";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progRebootOpticsEmptyField } from "@cyberpunk/testing/e2e-fixtures";

test("Reboot Optics - no friendly units", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progRebootOpticsEmptyField);

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
