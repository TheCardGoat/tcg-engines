import { test } from "@playwright/test";

import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";

test("gameStart starts both players in setup with six cards, private legends, fixer dice, and no gigs", async ({
  page,
}) => {
  await page.goto("/cyberpunk/simulator/tests/gameStart?ai=off&auto-advance-attack=off");

  const pom = await createPlaywrightCyberpunkSimulatorPom(page, { skipStructuralState: true });

  expectEqual("initial phase", await pom.getPhase(), "setup");

  for (const player of [CYBERPUNK_P1, CYBERPUNK_P2]) {
    await pom.expectHandSize(player, 6);
    await pom.expectFaceDownLegendsCount(player, 3);
    await pom.expectFixerDiceCount(player, 6);
    await pom.expectGigCount(player, 0);
    expectEqual("setup eddies", await pom.getEddies(player), 0);
  }
});

test("gameStart first player mulligans their hand and the game stays in setup for the second player", async ({
  page,
}) => {
  await page.goto("/cyberpunk/simulator/tests/gameStart?ai=off&auto-advance-attack=off");

  const pom = await createPlaywrightCyberpunkSimulatorPom(page);

  const first = await pom.getActivePlayerId();

  await pom.clearDispatchLog();
  await pom.mulligan(first);

  await pom.expectLastDispatch({ type: "mulligan", as: first });
  await pom.expectHandSize(first, 6);
  expectEqual("phase after first mulligan", await pom.getPhase(), "setup");
});

test("gameStart second player keeps their hand and the game advances to the start phase", async ({
  page,
}) => {
  await page.goto("/cyberpunk/simulator/tests/gameStart?ai=off&auto-advance-attack=off");

  const pom = await createPlaywrightCyberpunkSimulatorPom(page);

  const first = await pom.getActivePlayerId();
  const second = await pom.getOpponentOf(first);

  await pom.mulligan(first);
  await pom.clearDispatchLog();
  await pom.keepHand(second);

  await pom.expectLastDispatch({ type: "keepHand", as: second });
  expectEqual("phase after setup choices", await pom.getPhase(), "start");
  await pom.expectHandSize(first, 7);
  await pom.expectHandSize(second, 6);
  await pom.expectFaceDownLegendsCount(first, 3);
  await pom.expectFaceDownLegendsCount(second, 3);
});
