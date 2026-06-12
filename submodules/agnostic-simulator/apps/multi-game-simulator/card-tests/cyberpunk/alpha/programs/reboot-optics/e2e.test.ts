import { test } from "@playwright/test";

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Reboot Optics - friendly units on field", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/progRebootOptics?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const target = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const program = expectDefined(
    "Reboot Optics in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Reboot Optics eligible target count", eligible.length, 2);
  if (!eligible.includes(target.instanceId)) {
    throw new Error("Expected Swordwise Huscle to be eligible for Reboot Optics.");
  }

  await pom.resolveEffectTarget([target.instanceId], CYBERPUNK_P1);

  await pom.expectRenderedFieldCardPower(CYBERPUNK_P1, target.instanceId, 9);
  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  await pom.expectStructuralState();
});
