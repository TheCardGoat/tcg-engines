import { test, expect } from "@playwright/test";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailPsychoSquad,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test.describe("Bonnie and Clyde - Playwright e2e", () => {
  test("single-target: gig differential not met, only 1 target allowed", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/progBonnieAndClydeSingleTarget?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const program = expectDefined(
      "Bonnie and Clyde in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    // Psycho Squad has power 6 — should not be a valid target.
    await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailPsychoSquad.id,
    );

    // Card renders in hand with the expected definition id; cost is asserted at the engine unit-test level.
    expectEqual(
      "Bonnie and Clyde name",
      program.definitionId,
      welcomeToNightCityRetailBonnieAndClyde.id,
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    // Only Corpo Security (power 2) is eligible — Psycho Squad (power 6) excluded.
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Bonnie single-target eligible count", eligible.length, 1);
    if (!eligible.includes(corpoSecurity.instanceId)) {
      throw new Error("Expected Corpo Security to be the only eligible target.");
    }

    await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId(
      "trash",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    await pom.expectStructuralState();
  });

  test("multi-target: gig differential met, up to 2 targets allowed", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progBonnieAndClyde?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const program = expectDefined(
      "Bonnie and Clyde in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    const wraithMarauders = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailWraithMarauders.id,
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    // Both rival units (power 2 and power 4) are eligible — gig differential is met.
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Bonnie multi-target eligible count", eligible.length, 2);
    if (!eligible.includes(corpoSecurity.instanceId)) {
      throw new Error("Expected Corpo Security to be eligible.");
    }
    if (!eligible.includes(wraithMarauders.instanceId)) {
      throw new Error("Expected Wraith Marauders to be eligible.");
    }

    // Player chooses to defeat BOTH targets (up to 2 allowed).
    await pom.resolveEffectTarget(
      [corpoSecurity.instanceId, wraithMarauders.instanceId],
      CYBERPUNK_P1,
    );

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 0);
    await pom.expectTrashSize(CYBERPUNK_P2, 2);
    await pom.getCardInZoneByDefinitionId(
      "trash",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    await pom.getCardInZoneByDefinitionId(
      "trash",
      CYBERPUNK_P2,
      welcomeToNightCityRetailWraithMarauders.id,
    );
    await pom.expectStructuralState();
  });

  test("multi-target: player may choose only 1 of 2 allowed targets", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progBonnieAndClyde?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const program = expectDefined(
      "Bonnie and Clyde in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    const wraithMarauders = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailWraithMarauders.id,
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    // Even though up to 2 are allowed, the player chooses just 1.
    await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);
    await page.getByTestId("prompt-target-confirm").click();

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    // Wraith Marauders should remain on the field.
    await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P2, wraithMarauders.instanceId);
    await pom.expectStructuralState();
  });

  test("choice prompt UI allows selecting both eligible Units", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progBonnieAndClyde?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const program = expectDefined(
      "Bonnie and Clyde in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    // The resolving program should be visible.
    await expect(
      page.locator(`[data-testid="resolving-program"][data-card-id="${program.instanceId}"]`),
    ).toHaveCount(1);

    // Eligible targets should be highlighted with the target-eligible indicator.
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    const corpoSecurityTarget = page.locator(
      `[data-testid="card"][data-card-id="${corpoSecurity.instanceId}"][data-choice-eligible="true"]`,
    );
    await expect(corpoSecurityTarget).toHaveCount(1);

    const wraithMarauders = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      welcomeToNightCityRetailWraithMarauders.id,
    );
    const wraithMaraudersTarget = page.locator(
      `[data-testid="card"][data-card-id="${wraithMarauders.instanceId}"][data-choice-eligible="true"]`,
    );
    await expect(wraithMaraudersTarget).toHaveCount(1);

    await corpoSecurityTarget.click({ force: true });
    await expect(corpoSecurityTarget).toHaveAttribute("data-choice-selected", "true");
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    await wraithMaraudersTarget.click({ force: true });
    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 0);
    await pom.expectTrashSize(CYBERPUNK_P2, 2);
  });
});
