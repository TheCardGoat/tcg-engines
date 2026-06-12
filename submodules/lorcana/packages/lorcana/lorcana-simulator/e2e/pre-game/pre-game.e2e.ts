import {
  expect,
  test,
  PLAYER_ONE,
  PLAYER_TWO,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

test("mulligan phase: clicking hand cards in UI selects them for mulliganing", async ({ page }) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.goto({ fixtureId: "pre-game", view: "playerOne" });

  await pom.asBottomPlayer().chooseFirstPlayer(PLAYER_ONE);
  await expect(pom.asBottomPlayer()).toBeInPhase("mulligan");

  const handCards = await pom.asBottomPlayer().getHandCardIds(PLAYER_ONE);
  expect(handCards.length).toBeGreaterThan(0);

  // Before selecting any cards, confirm button shows 0 and is disabled
  await expect(page.getByRole("button", { name: "Alter 0 Cards" })).toBeDisabled();

  // Click the first hand card via UI — should select it for mulliganing, not open inspect
  const [firstCard, secondCard] = handCards;
  await pom.asBottomPlayer().clickHandCard(firstCard);
  await expect(page.getByRole("button", { name: "Alter 1 Cards" })).toBeEnabled();

  // Click a second card
  await pom.asBottomPlayer().clickHandCard(secondCard);
  await expect(page.getByRole("button", { name: "Alter 2 Cards" })).toBeEnabled();

  // Clicking a selected card deselects it
  await pom.asBottomPlayer().clickHandCard(firstCard);
  await expect(page.getByRole("button", { name: "Alter 1 Cards" })).toBeEnabled();

  // Confirm — should submit the mulligan with 1 card
  await page.getByRole("button", { name: "Alter 1 Cards" }).click();
  await expect(pom.asBottomPlayer()).toHavePendingMulligan([PLAYER_TWO]);
});

test("chooseFirstPlayer keeps pregame browser state aligned with the Lorcana test engine", async ({
  page,
}) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.goto({ fixtureId: "pre-game", view: "playerOne" });

  await pom.asBottomPlayer().chooseFirstPlayer(PLAYER_ONE);

  await expect(pom.asBottomPlayer()).toHaveOpeningTurnPlayer(PLAYER_ONE);
  await expect(pom.asBottomPlayer()).toHavePendingMulligan([PLAYER_ONE, PLAYER_TWO]);
  await expect(pom.asBottomPlayer()).toHavePriorityPlayer(PLAYER_ONE);
  await expect(pom.asBottomPlayer()).toHaveChoosingFirstPlayer(PLAYER_ONE);
  await expect(pom.asBottomPlayer()).toBeInPhase("mulligan");
  await expect(pom.asBottomPlayer()).toHaveCardCountInZone({
    zone: "hand",
    player: PLAYER_ONE,
    count: 7,
  });
  await expect(pom.asTopPlayer()).toHaveCardCountInZone({
    zone: "hand",
    player: PLAYER_TWO,
    count: 7,
  });

  // Select 3 Cards to mulligan and confirm the move
  const p1HandCards = await pom.asBottomPlayer().getHandCardIds(PLAYER_ONE);
  const p1CardsToMulligan = p1HandCards.slice(0, 3);
  await pom.asBottomPlayer().mulligan(p1CardsToMulligan);

  await expect(pom.asBottomPlayer()).toHavePendingMulligan([PLAYER_TWO]);
  await expect(pom.asBottomPlayer()).toHavePriorityPlayer(PLAYER_TWO);

  // Swap Players, using the debug bubble
  await pom.swapPlayers();

  // Select 4 cards from hand and mulligan as player two
  const p2HandCards = await pom.asBottomPlayer().getHandCardIds(PLAYER_TWO);
  const p2CardsToMulligan = p2HandCards.slice(0, 4);
  await pom.asBottomPlayer().mulligan(p2CardsToMulligan);

  // Assert that player one has the turn and the priority
  await expect(pom.asBottomPlayer()).toBeInGameSegment("mainGame");
  await expect(pom.asBottomPlayer()).toBeInPhase("main");
  await expect(pom.asBottomPlayer()).toHavePriorityPlayer(PLAYER_ONE);

  // Swap player again
  await pom.swapPlayers();

  await expect(pom.asBottomPlayer()).toHaveCardCountInZone({
    zone: "hand",
    player: PLAYER_ONE,
    count: 7,
  });
  await expect(pom.asTopPlayer()).toHaveCardCountInZone({
    zone: "hand",
    player: PLAYER_TWO,
    count: 7,
  });

  // After asserting both players still have 7 cards in hand, ink any card and pass turn.
  const p1HandAfterMulligan = await pom.asBottomPlayer().getHandCardIds(PLAYER_ONE);
  await pom.asBottomPlayer().inkCard(p1HandAfterMulligan[0]);
  await pom.asBottomPlayer().passTurn();

  // Verify player two has the priority
  await expect(pom.asBottomPlayer()).toHavePriorityPlayer(PLAYER_TWO);
});
