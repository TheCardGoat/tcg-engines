import { ladyFamilyDog } from "@tcg/lorcana-cards/cards/008";
import { heiheiBoatSnack, lefouBumbler } from "@tcg/lorcana-cards/cards/001";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;

const cardLabel = (card: { name: string; version?: string }) =>
  card.version ? `${card.name} - ${card.version}` : card.name;

const EXPENSIVE_CHAR_COST = 5;

/**
 * Fixture: Lady in hand alongside two cheap characters (cost ≤ 2) and one
 * expensive character (cost 5).  Lady costs 3 so inkwell = 3 suffices.
 * Enough deck cards to avoid running out.
 */
const LADY_FIXTURE = {
  id: "lady-family-dog-play-from-hand",
  name: "Lady - Family Dog: Play from Hand",
  description: "Verifies SOMEONE TO CARE FOR prompts the player to choose a ≤2-cost character.",
  playerOne: {
    inkwell: 10,
    hand: [ladyFamilyDog, heiheiBoatSnack, lefouBumbler],
    deck: 5,
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

test.describe("Lady - Family Dog: SOMEONE TO CARE FOR", () => {
  test("prompts the player to choose a ≤2-cost character from hand after accepting", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();

    await pom.goto({ fixture: LADY_FIXTURE, view: PLAYER_ONE_VIEW });

    const panel = page.getByRole("region", { name: "Available Moves" });
    const handZone = page.getByTestId("hand-zone-playerOne");

    // Play Lady - Family Dog
    await handZone.getByLabel(new RegExp(`${cardLabel(ladyFamilyDog)}, cost`, "i")).hover();
    await page.getByRole("button", { name: "Play", exact: true }).click();

    // Lady's triggered ability puts a bag effect in the bag
    await expect(panel.getByRole("button", { name: "Resolve triggered ability" })).toBeVisible();
    await panel.getByRole("button", { name: "Resolve triggered ability" }).click();

    // Optional-selection: accept the effect
    await expect(panel.getByRole("button", { name: "Yes" })).toBeVisible();
    await panel.getByRole("button", { name: "Yes" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve triggered ability" }).click();

    // After accepting, bag state advances to target-selection.
    // The panel should now show eligible hand cards (cost ≤ 2) as candidates.
    await expect(
      panel.getByRole("button", {
        name: new RegExp(`${cardLabel(heiheiBoatSnack)}`, "i"),
      }),
    ).toBeVisible();
    await expect(
      panel.getByRole("button", {
        name: new RegExp(`${cardLabel(lefouBumbler)}`, "i"),
      }),
    ).toBeVisible();

    // Choose Heihei (cost 1) to play for free
    await panel
      .getByRole("button", {
        name: new RegExp(`${cardLabel(heiheiBoatSnack)}`, "i"),
      })
      .click();
    await panel.getByRole("button", { name: "Confirm Resolve triggered ability" }).click();

    // Heihei should now be in play
    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(heiheiBoatSnack),
      zone: "play",
    });

    // LeFou should still be in hand (was not selected)
    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(lefouBumbler),
      zone: "hand",
    });
  });

  test("allows declining the optional without playing any card", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();

    await pom.goto({ fixture: LADY_FIXTURE, view: PLAYER_ONE_VIEW });

    const panel = page.getByRole("region", { name: "Available Moves" });
    const handZone = page.getByTestId("hand-zone-playerOne");

    // Play Lady
    await handZone.getByLabel(new RegExp(`${cardLabel(ladyFamilyDog)}, cost`, "i")).hover();
    await page.getByRole("button", { name: "Play", exact: true }).click();

    await expect(panel.getByRole("button", { name: "Resolve triggered ability" })).toBeVisible();
    await panel.getByRole("button", { name: "Resolve triggered ability" }).click();

    // Decline the optional
    await expect(panel.getByRole("button", { name: "No" })).toBeVisible();
    await panel.getByRole("button", { name: "No" }).click();
    await panel.getByRole("button", { name: "Confirm Resolve triggered ability" }).click();

    // No card should have been played for free
    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(heiheiBoatSnack),
      zone: "hand",
    });
    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(lefouBumbler),
      zone: "hand",
    });
  });
});
