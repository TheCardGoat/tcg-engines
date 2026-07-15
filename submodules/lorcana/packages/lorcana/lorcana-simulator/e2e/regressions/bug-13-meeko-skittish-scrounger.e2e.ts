import {
  expect,
  test,
  buildRegressionFixturePath,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("bug-13-meeko-skittish-scrounger", {
  view: PLAYER_ONE_VIEW,
});

async function executeWithRetry(
  pom: LorcanaSimulatorPom,
  view: "playerOne" | "playerTwo",
  moveId: string,
  params: Record<string, unknown>,
): Promise<{ success: boolean; reason?: string; code?: string }> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await pom.execute(view, moveId, params);
    if (result.success || result.code !== "OPTIMISTIC_MOVE_PENDING") {
      return result;
    }
    await pom.page.waitForTimeout(50);
  }
  return pom.execute(view, moveId, params);
}

test.describe("Bug 13 - Meeko Skittish Scrounger BOTTOMLESS PIT (multi-instance)", () => {
  test("second Meeko's BOTTOMLESS PIT auto-resolves to banish when discard branch becomes illegal", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const initialBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const meekoIds = initialBoard.players[PLAYER_ONE_ID]?.play.filter(
      (cardId) => initialBoard.cards[cardId]?.fullName === "Meeko - Skittish Scrounger",
    );
    expect(meekoIds).toBeDefined();
    expect(meekoIds!.length).toBe(2);
    const discardCardId = findCardIdByLabel(
      initialBoard,
      PLAYER_ONE_ID,
      "hand",
      "Madam Mim - Snake",
    );

    // Both Meekos start exerted per the fixture.
    expect(initialBoard.cards[meekoIds![0]!]?.exerted).toBe(true);
    expect(initialBoard.cards[meekoIds![1]!]?.exerted).toBe(true);

    const passStateId = initialBoard.stateID;
    const passResult = await pom.execute(PLAYER_ONE_VIEW, "passTurn", {});
    expect(passResult.success).toBe(true);
    await pom.waitForStateChange(passStateId, PLAYER_ONE_VIEW);

    // Both Meekos should put a BOTTOMLESS PIT entry into the bag. Wait until
    // both triggers have settled into the projection — the async transport may
    // still be applying optimistic confirmations at this point.
    await page.waitForFunction(async () => {
      const harness = (
        window as unknown as {
          __lorcanaTestHarness?: {
            getBoard(view: string): Promise<{ bagEffects: unknown[] }>;
          };
        }
      ).__lorcanaTestHarness;
      if (!harness) return false;
      const projected = await harness.getBoard("playerOne");
      return projected.bagEffects.length >= 2;
    });

    const boardAfterPass = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(boardAfterPass.bagEffects.length).toBeGreaterThanOrEqual(2);

    // Resolve the first Meeko's choice: discard Belle (choiceIndex 0).
    // Retry briefly while the client still has an optimistic move pending.
    const firstBag = boardAfterPass.bagEffects[0]!;
    const firstResolveStateId = boardAfterPass.stateID;
    const firstResolve = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", {
      bagId: firstBag.id,
      params: {
        choiceIndex: 0,
        targets: [discardCardId],
      },
    });
    expect(firstResolve.success).toBe(true);
    await pom.waitForStateChange(firstResolveStateId, PLAYER_ONE_VIEW);

    const boardAfterFirst = await pom.getBoard(PLAYER_ONE_VIEW);
    // The chosen hand card was discarded.
    expect(boardAfterFirst.cards[discardCardId]?.zone ?? null).toBe("discard");
    expect(boardAfterFirst.players[PLAYER_ONE_ID]?.hand).not.toContain(discardCardId);

    // Player one's hand is now empty so the second Meeko's discard branch is
    // illegal. The "or" effect must auto-resolve to banish — the regression
    // was that it was incorrectly cancelled with "no-valid-targets".
    const meekoZones = meekoIds!.map((id) => boardAfterFirst.cards[id]?.zone ?? null);
    const banishedCount = meekoZones.filter((zone) => zone === "discard").length;
    const inPlayCount = meekoZones.filter((zone) => zone === "play").length;
    expect(banishedCount).toBe(1);
    expect(inPlayCount).toBe(1);

    // No leftover bag entry should remain stuck for the second Meeko.
    expect(boardAfterFirst.bagEffects.length).toBe(0);

    // The DOM must agree with the projection: the player's play zone must
    // render exactly one Meeko card, not two. Reported regression: the log
    // says "Meeko was banished" but the card is still visible.
    const survivingMeekoId = meekoIds!.find((id) => boardAfterFirst.cards[id]?.zone === "play");
    const banishedMeekoId = meekoIds!.find((id) => boardAfterFirst.cards[id]?.zone === "discard");
    expect(survivingMeekoId).toBeDefined();
    expect(banishedMeekoId).toBeDefined();

    const playZone = page.getByRole("region", { name: "Play for Player One" });
    // The surviving Meeko stays rendered.
    await expect(playZone.locator(`[data-card-id="${survivingMeekoId}"]`)).not.toHaveCount(0);
    // The banished Meeko must be removed from the play zone DOM.
    await expect(playZone.locator(`[data-card-id="${banishedMeekoId}"]`)).toHaveCount(0);
  });

  test("visible UI disables the discard branch once the hand is empty", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    await page.getByRole("button", { name: "Pass Turn" }).click();
    await page.getByRole("button", { name: "Confirm Pass Turn" }).click();
    await expect(page.getByText("Resolving Meeko - Skittish Scrounger").first()).toBeVisible();

    await page.locator("button").filter({ hasText: "Effects" }).click();
    await page.getByRole("button", { name: "Resolve triggered ability" }).first().click();
    await page.getByRole("button", { name: "choose and discard a card" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    const handTarget = page.locator('.card-face--valid-target[data-zone-id="hand"]');
    await expect(handTarget).toHaveCount(1);
    await handTarget.click();
    await expect(
      page.getByText("Resolved Meeko - Skittish Scrounger by discarding Madam Mim - Snake"),
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "choose and discard a card" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "banish him" })).toBeEnabled();
    await page.getByRole("button", { name: "banish him" }).click();
    await expect(
      page.getByText(
        "Resolved BOTTOMLESS PIT from Meeko - Skittish Scrounger. Meeko - Skittish Scrounger was banished.",
      ),
    ).toBeVisible();

    const boardAfterBanish = await pom.getBoard(PLAYER_ONE_VIEW);
    const meekoZones = Object.values(boardAfterBanish.cards)
      .filter((card) => card.fullName === "Meeko - Skittish Scrounger")
      .map((card) => card.zone);
    expect(meekoZones.filter((zone) => zone === "play")).toHaveLength(1);
    expect(meekoZones.filter((zone) => zone === "discard")).toHaveLength(1);
  });
});
