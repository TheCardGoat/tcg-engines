import { test } from "@playwright/test";
import { welcomeToNightCityRetailOctant } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { unitOctantRetail } from "@cyberpunk/testing/e2e-fixtures";

test("Octant - friendly 8+ Gigs reduce its play cost", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitOctantRetail);
  const octant = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, welcomeToNightCityRetailOctant.id);
  await pom.playCardFromHand(octant.instanceId, CYBERPUNK_P1);
  await pom.expectEddies(CYBERPUNK_P1, 0);
  await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, welcomeToNightCityRetailOctant.id);
  await pom.expectStructuralState();
});
