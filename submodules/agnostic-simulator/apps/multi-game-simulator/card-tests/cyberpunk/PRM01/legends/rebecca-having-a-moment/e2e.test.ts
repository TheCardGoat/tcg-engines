import { expect, test } from "@playwright/test";

import { prm01RebeccaHavingAMoment } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { legendRebeccaHavingAMomentPrm01 } from "@cyberpunk/testing/e2e-fixtures";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

test("Rebecca - Having a Moment (PRM01) - base Legend call", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendRebeccaHavingAMomentPrm01);
  const rebecca = await pom.getCardInZoneByDefinitionId(
    "legendArea",
    CYBERPUNK_P1,
    prm01RebeccaHavingAMoment.id,
  );

  expect(rebecca.faceDown).toBe(true);
  await pom.callLegend(rebecca.instanceId, CYBERPUNK_P1);

  const calledRebecca = await pom.getCardInZoneByInstanceId(
    "legendArea",
    CYBERPUNK_P1,
    rebecca.instanceId,
  );
  expect(calledRebecca.faceDown).toBe(false);
  await pom.expectEddies(CYBERPUNK_P1, 1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectStructuralState();
});
