import { test } from "@playwright/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { progLiveWithTheAftermathRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Live with the Aftermath - each player defeats their own Unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progLiveWithTheAftermathRetail);
  const program = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, welcomeToNightCityRetailLiveWithTheAftermath.id);
  const friendly = await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, welcomeToNightCityRetailMoxInciters.id);
  const rival = await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, welcomeToNightCityRetailCorpoSecurity.id);
  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
  await pom.resolveEffectTarget([friendly.instanceId], CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");
  await pom.resolveEffectTarget([rival.instanceId], CYBERPUNK_P2);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, welcomeToNightCityRetailMoxInciters.id);
  await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, welcomeToNightCityRetailCorpoSecurity.id);
  await pom.expectStructuralState();
});
