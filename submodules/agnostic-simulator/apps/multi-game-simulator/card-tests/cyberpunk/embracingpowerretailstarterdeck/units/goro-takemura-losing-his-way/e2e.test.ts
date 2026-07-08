import { test } from "@playwright/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { unitEmbracingGoroTakemuraLosingHisWay } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Goro Takemura - Losing His Way (Embracing Power) - all face-up Legends attack bonus", async ({
  page,
}) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    unitEmbracingGoroTakemuraLosingHisWay,
  );
  const goro = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.id,
  );
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 4);
  await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

  await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 9);
  expectEqual("Goro Losing His Way attack kind", (await pom.getAttackState())?.kind, "fight");
  await pom.expectStructuralState();
});
