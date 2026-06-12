import { test } from "@playwright/test";
import { alphaFloorIt, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";

import { createPlaywrightCyberpunkSimulatorPom } from "../../poms/CyberpunkPlaywrightHarnessClient";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../../src/games/cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

test("openingMain starts with first player in main phase and second player in view mode", async ({
  page,
}) => {
  await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  expectEqual("openingMain phase", await pom.getPhase(), "main");
  expectEqual("openingMain turn", await pom.getTurnNumber(), 1);
  expectEqual("openingMain active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
  await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
  await pom.expectBoardMode(CYBERPUNK_P2, "view");
  await pom.expectHandSize(CYBERPUNK_P1, 3);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectEddies(CYBERPUNK_P1, 5);
});

test("openingMain first player sells Floor It from hand for one eddie", async ({ page }) => {
  await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  const floorIt = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaFloorIt.id);

  await pom.sellCard(floorIt.instanceId, CYBERPUNK_P1);

  await pom.expectHandSize(CYBERPUNK_P1, 2);
  await pom.expectEddies(CYBERPUNK_P1, 6);
  await pom.getCardInZoneByDefinitionId("eddieArea", CYBERPUNK_P1, alphaFloorIt.id);
});

test("openingMain first player sells a card, plays Ruthless Lowlife, then passes the turn", async ({
  page,
}) => {
  await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

  const pom = createPlaywrightCyberpunkSimulatorPom(page);
  await pom.waitForReady();
  const floorIt = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaFloorIt.id);
  await pom.sellCard(floorIt.instanceId, CYBERPUNK_P1);

  const lowlife = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    alphaRuthlessLowlife.id,
  );
  await pom.playCardFromHand(lowlife.instanceId, CYBERPUNK_P1);

  await pom.expectFieldSize(CYBERPUNK_P1, 3);
  await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaRuthlessLowlife.id);
  await pom.expectEddies(CYBERPUNK_P1, 4);

  await pom.passPhase(CYBERPUNK_P1);

  expectEqual("phase after P1 passes", await pom.getPhase(), "start");
  expectEqual("active player after P1 passes", await pom.getActivePlayerId(), CYBERPUNK_P2);
  expectEqual("turn after P1 passes", await pom.getTurnNumber(), 2);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, "gainGig");
  await pom.expectBoardMode(CYBERPUNK_P1, "view");
  await pom.expectBoardMode(CYBERPUNK_P2, "select-target");
});
