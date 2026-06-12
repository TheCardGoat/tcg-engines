import { test } from "@playwright/test";

import {
  alphaSwordwiseHuscle,
  spoilerAfterpartyAtLizzieS,
  spoilerVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { legendVStreetkid } from "@cyberpunk/testing/e2e-fixtures";

test("V - Streetkid - GO SOLO defeated trigger", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, legendVStreetkid);

  const v = await pom.getCardInZoneByDefinitionId("legendArea", CYBERPUNK_P1, spoilerVStreetkid.id);
  const defender = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    alphaSwordwiseHuscle.id,
  );

  await pom.goSolo(v.instanceId, CYBERPUNK_P1);
  await pom.attackUnit(v.instanceId, defender.instanceId, CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
  await pom.resolveAttack(CYBERPUNK_P1);
  await pom.resolveAttack(CYBERPUNK_P1);

  expectEqual(
    "V Streetkid removed after GO SOLO defeat",
    await pom.getCardInstanceExists(v.instanceId),
    false,
  );
  expectEqual("V Streetkid attack cleared", await pom.getAttackState(), null);
  await pom.expectFieldSize(CYBERPUNK_P1, 1);
  await pom.expectHandSize(CYBERPUNK_P1, 1);
  await pom.expectTrashSize(CYBERPUNK_P1, 4);
  await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerAfterpartyAtLizzieS.id);
  expectEqual("V Streetkid deck after mill", await pom.getDeckSize(CYBERPUNK_P1), 3);

  await pom.expectStructuralState();
});
