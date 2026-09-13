import { expect, findCardIdByLabel, LorcanaSimulatorPom, test } from "../support/lorcana-test.js";
import {
  hundredAcreWoodHunnyCampsite,
  kangaHunnyBard,
  winnieThePoohPigletHunnyMages,
} from "@tcg/lorcana-cards/cards/013";
import { pigletCocoaMaker } from "@tcg/lorcana-cards/cards/011";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";

async function executeWithRetry(
  pom: LorcanaSimulatorPom,
  moveId: string,
  params: Record<string, unknown>,
): Promise<{ success: boolean; reason?: string; code?: string }> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await pom.execute(PLAYER_ONE_VIEW, moveId, params);
    if (result.success || result.code !== "MOVE_PENDING") {
      return result;
    }
    await pom.page.waitForTimeout(50);
  }

  return pom.execute(PLAYER_ONE_VIEW, moveId, params);
}

test.describe("Hunny Campsite location layout", () => {
  test("keeps three effect-bearing characters readable at Hundred Acre Wood", async ({
    page,
  }, testInfo) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "hunny-campsite-location-layout",
        name: "Hunny Campsite - three character layout",
        description:
          "Kanga, Winnie the Pooh & Piglet, and Piglet move to Hundred Acre Wood so their effect and stat bands can be visually checked together.",
        playerOne: {
          play: [
            { card: kangaHunnyBard, isDrying: false },
            { card: winnieThePoohPigletHunnyMages, isDrying: false },
            { card: pigletCocoaMaker, isDrying: false },
            hundredAcreWoodHunnyCampsite,
          ],
          inkwell: hundredAcreWoodHunnyCampsite.moveCost * 3,
          deck: [],
        },
        playerTwo: { deck: [] },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const startingBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const locationId = findCardIdByLabel(
      startingBoard,
      PLAYER_ONE_ID,
      "play",
      "Hundred Acre Wood - Hunny Campsite",
    );
    const characterIds = [
      findCardIdByLabel(startingBoard, PLAYER_ONE_ID, "play", "Kanga - Hunny Bard"),
      findCardIdByLabel(
        startingBoard,
        PLAYER_ONE_ID,
        "play",
        "Winnie the Pooh & Piglet - Hunny Mages",
      ),
      findCardIdByLabel(startingBoard, PLAYER_ONE_ID, "play", "Piglet - Cocoa Maker"),
    ];

    let currentBoard = startingBoard;
    for (const characterId of characterIds) {
      const moveResult = await executeWithRetry(pom, "moveCharacterToLocation", {
        characterId,
        locationId,
      });
      expect(moveResult.success, JSON.stringify(moveResult)).toBe(true);
      await pom.waitForStateChange(currentBoard.stateID, PLAYER_ONE_VIEW);
      currentBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    }

    for (const characterId of characterIds) {
      expect(currentBoard.cards[characterId]?.atLocationId).toBe(locationId);
    }

    const locationCluster = page.locator(
      `section.location-cluster[data-location-cluster-id="${locationId}"]`,
    );
    await expect(locationCluster).toHaveCount(1);
    await locationCluster
      .locator(`.location-cluster__slot--occupant[data-card-id="${characterIds[2]}"]`)
      .waitFor({ state: "visible" });

    const occupantLayout = await locationCluster.evaluate((cluster) =>
      [...cluster.querySelectorAll<HTMLElement>(".location-cluster__slot--occupant")].map(
        (slot) => {
          const cardFace = slot.querySelector<HTMLElement>(".card-face");
          const statusBand = slot.querySelector<HTMLElement>("[data-testid=play-zone-status-band]");
          const statBand = slot.querySelector<HTMLElement>("[data-testid=play-zone-stats-band]");
          const cardRect = cardFace?.getBoundingClientRect();
          const statusRect = statusBand?.getBoundingClientRect();
          const statRect = statBand?.getBoundingClientRect();

          return {
            card: cardRect ? { left: cardRect.left, right: cardRect.right } : undefined,
            status: statusRect ? { left: statusRect.left, right: statusRect.right } : undefined,
            stats: statRect ? { left: statRect.left, right: statRect.right } : undefined,
          };
        },
      ),
    );

    expect(occupantLayout).toHaveLength(3);
    for (const occupant of occupantLayout) {
      expect(occupant.card).toBeDefined();
      expect(occupant.status).toBeDefined();
      expect(occupant.stats).toBeDefined();
    }
    for (let index = 1; index < occupantLayout.length; index += 1) {
      expect(occupantLayout[index]!.card!.left).toBeGreaterThanOrEqual(
        occupantLayout[index - 1]!.card!.right - 0.5,
      );
      expect(occupantLayout[index]!.status!.left).toBeGreaterThanOrEqual(
        occupantLayout[index - 1]!.status!.right - 0.5,
      );
      expect(occupantLayout[index]!.stats!.left).toBeGreaterThanOrEqual(
        occupantLayout[index - 1]!.stats!.right - 0.5,
      );
    }

    await page.screenshot({
      path: testInfo.outputPath("hunny-campsite-three-characters.png"),
      fullPage: true,
    });
  });
});
