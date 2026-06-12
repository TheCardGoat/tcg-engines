import { test } from "@playwright/test";

import {
  alphaMantisBlades,
  alphaSwordwiseHuscle,
  spoilerPanamPalmerNomadCavalry,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendPanamPalmerNomadCavalry } from "@cyberpunk/testing/e2e-fixtures";

test("Panam Palmer - transfers legend gear to attacker", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendPanamPalmerNomadCavalry);

  const panam = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    spoilerPanamPalmerNomadCavalry.id,
  );
  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSwordwiseHuscle.id,
  );
  const mantis = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    alphaMantisBlades.id,
  );

  await pom.expectLegendCardAttachedGearCount(CYBERPUNK_P1, panam.instanceId, 1);
  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

  await pom.expectLegendCardSpent(CYBERPUNK_P1, panam.instanceId, true);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, true);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");

  const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
  expectEqual("Panam gear choice count", choices.length, 1);
  expectEqual("Panam gear choice", choices[0], mantis.instanceId);

  await pom.resolveCardToMove(mantis.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectLegendCardAttachedGearCount(CYBERPUNK_P1, panam.instanceId, 0);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, attacker.instanceId, 1);
  await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, false);
  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 7);
  const moved = await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P1, mantis.instanceId);
  expectEqual("Mantis moved to attacker", moved.attachedToId, attacker.instanceId);

  await pom.expectStructuralState();
});
