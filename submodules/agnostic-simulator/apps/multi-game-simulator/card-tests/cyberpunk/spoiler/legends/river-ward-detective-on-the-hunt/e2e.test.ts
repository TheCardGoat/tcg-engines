import { test } from "@playwright/test";

import {
  alphaKiroshiOptics,
  alphaSecondhandBombus,
  alphaTBugAmateurPhilosopher,
  spoilerRiverWardDetectiveOnTheHunt,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendRiverWardDetectiveOnTheHunt } from "@cyberpunk/testing/e2e-fixtures";

test("River Ward - attack trigger equips free gear", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendRiverWardDetectiveOnTheHunt);

  const river = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    spoilerRiverWardDetectiveOnTheHunt.id,
  );
  const attacker = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaTBugAmateurPhilosopher.id,
  );
  const host = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    alphaSecondhandBombus.id,
  );
  const kiroshi = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    alphaKiroshiOptics.id,
  );

  await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

  await pom.expectLegendCardSpent(CYBERPUNK_P1, river.instanceId, true);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
  const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
  if (!choices.includes(kiroshi.instanceId)) {
    throw new Error("Expected River Ward to offer Kiroshi Optics as the free gear.");
  }

  await pom.resolveCardToPlay(kiroshi.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectEddies(CYBERPUNK_P1, 4);
  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  const attached = await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P1, kiroshi.instanceId);
  expectEqual("Kiroshi attached to River target", attached.attachedToId, host.instanceId);

  await pom.expectStructuralState();
});
