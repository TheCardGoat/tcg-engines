import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { theHornedKingMercilessMaster } from "@tcg/lorcana-cards/cards/013";
import { expect, findCardIdByLabel, LorcanaSimulatorPom, test } from "../support/lorcana-test.js";

const PLAYER_ONE_ID = "player_one";
const PLAYER_ONE_VIEW = "playerOne" as const;

const cardLabel = (card: { name: string; version?: string }) =>
  card.version ? `${card.name} - ${card.version}` : card.name;

const THE_HORNED_KING_FIXTURE = {
  id: "set13-the-horned-king-merciless-master-interaction",
  name: "Set 13 The Horned King Merciless Master Interaction",
  description:
    "The Horned King is exerted with a playable character in discard for simulator visual proof.",
  playerOne: {
    inkwell: 10,
    play: [{ card: theHornedKingMercilessMaster, exerted: true }],
    discard: [mickeyMouseTrueFriend],
    deck: 5,
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

test.describe("The Horned King - Merciless Master visual flow", () => {
  test("shows playable discard characters in the hand lane and logs playing from discard", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();

    await pom.goto({ fixture: THE_HORNED_KING_FIXTURE, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const discardCardId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "discard",
      cardLabel(mickeyMouseTrueFriend),
    );

    const playableDiscardCard = page.locator(
      `[data-card-id="${discardCardId}"][data-display-zone="playable-discard"]`,
    );
    await expect(playableDiscardCard).toBeVisible();
    await expect(playableDiscardCard).toHaveClass(/hand-card--from-discard/);

    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: discardCardId });
    expect(playResult.success).toBe(true);

    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(mickeyMouseTrueFriend),
      zone: "play",
    });

    const eventLog = page.getByRole("region", { name: "Event log" });
    await expect(eventLog).toContainText("Played Mickey Mouse - True Friend from discard.");

    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });
});
