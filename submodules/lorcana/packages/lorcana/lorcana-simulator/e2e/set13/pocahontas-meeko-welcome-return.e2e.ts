import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { heiheiBoatSnack, reflection } from "@tcg/lorcana-cards/cards/001";
import { julietaMadrigalExcellentCook } from "@tcg/lorcana-cards/cards/004";
import { pocahontasMeekoAdventurousFriends } from "@tcg/lorcana-cards/cards/013";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const HEIHEI_LABEL = "HeiHei - Boat Snack";

function findCardIdByLabel(
  board: LorcanaProjectedBoardView,
  playerId: string,
  zone: "hand" | "play",
  label: string,
): string {
  const cardId = board.players[playerId]?.[zone].find(
    (candidate) => board.cards[candidate]?.fullName === label,
  );
  if (!cardId) {
    throw new Error(`Card "${label}" not found in ${zone} for ${playerId}.`);
  }
  return String(cardId);
}

function meekoFixture() {
  return {
    id: "pocahontas-meeko-welcome-return",
    name: "Pocahontas & Meeko Welcome Return",
    description: "Ready Meeko + cost-1 board/hand for WELCOME RETURN proofs",
    playerOne: {
      play: [
        { card: pocahontasMeekoAdventurousFriends, isDrying: false },
        // Cost-1 character in play for the return-to-hand may.
        { card: heiheiBoatSnack, isDrying: false },
      ],
      // Cost-1 character in hand for the free-play may.
      hand: [heiheiBoatSnack],
      deck: [reflection, reflection],
    },
    playerTwo: {
      deck: [reflection, reflection],
    },
    skipPreGame: true,
  };
}

test.describe("Pocahontas & Meeko WELCOME RETURN", () => {
  test("human peels nested mays: return cost 1 then free-play cost 1", async ({ page }) => {
    test.setTimeout(60_000);
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: meekoFixture(), view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const meekoId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Pocahontas & Meeko - Adventurous Friends",
    );
    const costOnePlayId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", HEIHEI_LABEL);
    const costOneHandId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", HEIHEI_LABEL);

    const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: meekoId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const afterQuest = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = afterQuest.bagEffects[0];
    expect(bagEffect).toBeDefined();

    const acceptReturn = await pom.execute(PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        resolveOptional: true,
        targets: [costOnePlayId],
      },
    });
    expect(acceptReturn.success).toBe(true);
    await pom.waitForStateChange(afterQuest.stateID, PLAYER_ONE_VIEW);

    const afterReturn = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterReturn.cards[costOnePlayId]?.zone).toBe("hand");

    // Second may surfaces as pending optional free-play (or residual bag).
    const pendingId = afterReturn.pendingEffects?.[0]?.id;
    const freePlayMove = pendingId ? "resolveEffect" : "resolveBag";
    const freePlayPromptId = pendingId ?? afterReturn.bagEffects[0]?.id;
    expect(freePlayPromptId).toBeTruthy();

    const freePlayParams =
      freePlayMove === "resolveEffect"
        ? {
            effectId: freePlayPromptId,
            params: {
              resolveOptional: true,
              targets: [costOneHandId],
            },
          }
        : {
            bagId: freePlayPromptId,
            params: {
              resolveOptional: true,
              targets: [costOneHandId],
            },
          };

    const acceptPlay = await pom.execute(PLAYER_ONE_VIEW, freePlayMove, freePlayParams);
    expect(acceptPlay.success).toBe(true);
    await pom.waitForStateChange(afterReturn.stateID, PLAYER_ONE_VIEW);

    const finalBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(finalBoard.cards[costOneHandId]?.zone).toBe("play");
    expect(finalBoard.cards[costOnePlayId]?.zone).toBe("hand");
    expect(finalBoard.bagEffects ?? []).toHaveLength(0);
    expect(finalBoard.pendingEffects ?? []).toHaveLength(0);
  });

  test("bot drains WELCOME RETURN nested mays without conceding", async ({ page }) => {
    test.setTimeout(60_000);
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: meekoFixture(), view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const meekoId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Pocahontas & Meeko - Adventurous Friends",
    );

    const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: meekoId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    let sawResolution = false;
    for (let step = 0; step < 8; step += 1) {
      const result = await pom.takeAutomatedActionForCurrentActor();
      if (result.bagCount > 0 || result.pendingCount > 0 || sawResolution) {
        sawResolution = true;
      }
      expect(result.fallbackTaken).not.toBe("concede");
      expect(result.gameOver).toBe(false);
      expect(result.success).toBe(true);

      if (sawResolution && result.bagCount === 0 && result.pendingCount === 0) {
        break;
      }
    }

    expect(sawResolution).toBe(true);
    const finalBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(finalBoard.bagEffects ?? []).toHaveLength(0);
    expect(finalBoard.pendingEffects ?? []).toHaveLength(0);
  });
});

function julietaFixture() {
  return {
    id: "julieta-signature-recipe-nested-may",
    name: "Julieta Signature Recipe",
    description: "Julieta + damaged ally for dual-may SIGNATURE RECIPE bot drain",
    playerOne: {
      hand: [julietaMadrigalExcellentCook],
      inkwell: julietaMadrigalExcellentCook.cost,
      play: [{ card: heiheiBoatSnack, damage: 1, isDrying: false }],
      deck: [reflection, reflection, reflection],
    },
    playerTwo: {
      deck: [reflection, reflection],
    },
    skipPreGame: true,
  };
}

test.describe("Julieta SIGNATURE RECIPE nested mays", () => {
  test("bot drains double-may play trigger without conceding", async ({ page }) => {
    test.setTimeout(60_000);
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: julietaFixture(), view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const julietaId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "hand",
      "Julieta Madrigal - Excellent Cook",
    );

    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: julietaId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    let sawResolution = false;
    for (let step = 0; step < 8; step += 1) {
      const result = await pom.takeAutomatedActionForCurrentActor();
      if (result.bagCount > 0 || result.pendingCount > 0 || sawResolution) {
        sawResolution = true;
      }
      expect(result.fallbackTaken).not.toBe("concede");
      expect(result.gameOver).toBe(false);
      expect(result.success).toBe(true);

      if (sawResolution && result.bagCount === 0 && result.pendingCount === 0) {
        break;
      }
    }

    expect(sawResolution).toBe(true);
    const finalBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(finalBoard.bagEffects ?? []).toHaveLength(0);
    expect(finalBoard.pendingEffects ?? []).toHaveLength(0);
  });
});
