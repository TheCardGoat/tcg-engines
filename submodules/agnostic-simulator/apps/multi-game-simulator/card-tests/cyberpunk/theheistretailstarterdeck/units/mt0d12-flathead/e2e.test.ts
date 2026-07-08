import { test } from "@playwright/test";

import { theHeistRetailStarterDeckMt0d12Flathead } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { unitTheHeistMt0d12Flathead } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("MT0D12 Flathead (The Heist) - lower Street Cred grants cantBeBlocked", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, unitTheHeistMt0d12Flathead);
  const flathead = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    theHeistRetailStarterDeckMt0d12Flathead.id,
  );

  expectEqual("Flathead P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 1);
  expectEqual("Flathead P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 7);
  await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, flathead.instanceId, "cantBeBlocked", true);
  await pom.attackRival(flathead.instanceId, CYBERPUNK_P1);

  expectEqual("Flathead attack kind", (await pom.getAttackState())?.kind, "direct");
  await pom.expectStructuralState();
});
