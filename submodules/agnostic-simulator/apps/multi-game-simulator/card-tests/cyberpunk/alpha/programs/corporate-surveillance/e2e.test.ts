import { test } from "@playwright/test";

import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Corporate Surveillance - rival field has targets", async ({ page }) => {
  await page.goto(
    "/cyberpunk/simulator/tests/progCorporateSurveillance?ai=off&auto-advance-attack=off",
  );

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 3);

  const program = expectDefined(
    "Corporate Surveillance in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );
  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  await pom.expectHandSize(CYBERPUNK_P1, 0);
  await pom.expectEddies(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Corporate Surveillance eligible target count", eligible.length, 2);
  const targetId = expectDefined("Corporate Surveillance target", eligible[0]);

  await pom.resolveEffectTarget([targetId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldCardSpent(CYBERPUNK_P2, targetId, true);
  await pom.expectFieldSize(CYBERPUNK_P2, 3);

  await pom.expectStructuralState();
});
