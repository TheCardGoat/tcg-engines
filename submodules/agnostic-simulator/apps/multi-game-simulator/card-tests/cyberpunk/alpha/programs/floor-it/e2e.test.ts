import { test } from "@playwright/test";

import { alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "../../../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "../../../../../e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Floor It - spent units to bounce", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/progFloorIt?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  await pom.expectStructuralState();

  const rivalTarget = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaCorpoSecurity.id,
  );
  await pom.expectFieldCardSpent(CYBERPUNK_P2, rivalTarget.instanceId, true);

  const program = expectDefined(
    "Floor It in hand",
    (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
  );
  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
  expectEqual("Floor It eligible target count", eligible.length, 2);
  if (!eligible.includes(rivalTarget.instanceId)) {
    throw new Error("Expected spent rival Corpo Security to be eligible for Floor It.");
  }

  await pom.resolveEffectTarget([rivalTarget.instanceId], CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectFieldSize(CYBERPUNK_P2, 1);
  await pom.expectHandSize(CYBERPUNK_P2, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 1);
  await pom.expectEddies(CYBERPUNK_P1, 1);

  await pom.expectStructuralState();
});
