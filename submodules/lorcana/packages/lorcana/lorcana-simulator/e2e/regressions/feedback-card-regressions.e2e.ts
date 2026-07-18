import {
  buildRegressionFixturePath,
  expect,
  findCardIdByLabel,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";
import {
  fireTheCannons,
  grammaTalaStoryteller,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { sailTheAzuriteSea } from "@tcg/lorcana-cards/cards/006";
import { annaIceBreaker } from "@tcg/lorcana-cards/cards/007";
import { palaceGuardSpectralSentry } from "@tcg/lorcana-cards/cards/008";
import {
  angelExperiment624,
  scroogesCountingHouseEbenezersOffice,
} from "@tcg/lorcana-cards/cards/011";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_TWO_VIEW = "playerTwo" as const;
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";

async function executeWithRetry(
  pom: LorcanaSimulatorPom,
  view: typeof PLAYER_ONE_VIEW | typeof PLAYER_TWO_VIEW,
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

test.describe("feedback card regressions", () => {
  test("the choose-first controls use grammatical player labels", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: "pre-game", view: PLAYER_ONE_VIEW });

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    await expect(guidance).toContainText("Choose who goes first.");
    await expect(guidance.getByRole("button", { name: "You" })).toBeVisible();
    await expect(guidance.getByRole("button", { name: "Opponent" })).toBeVisible();
    await expect(page.getByText("You goes first", { exact: true })).toHaveCount(0);
  });

  test("Grandmother Fa's this-turn Strength bonus expires before the opponent's turn", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-58-grandmother-fa-this-turn-duration", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const grandmotherFaId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Grandmother Fa - Spirited Elder",
    );
    const chiefTuiId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Chief Tui - Respected Leader",
    );
    const printedStrength = setupBoard.cards[chiefTuiId]?.strength;
    expect(printedStrength).toBeDefined();

    const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", {
      cardId: grandmotherFaId,
    });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    const boardWithTrigger = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = boardWithTrigger.bagEffects[0];
    expect(bagEffect).toBeDefined();
    const resolveResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        resolveOptional: true,
        targets: [chiefTuiId],
      },
    });
    expect(resolveResult.success).toBe(true);
    await pom.waitForStateChange(boardWithTrigger.stateID, PLAYER_ONE_VIEW);

    const boostedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(boostedBoard.cards[chiefTuiId]?.strength).toBe(printedStrength! + 2);

    const passResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "passTurn", {});
    expect(passResult.success).toBe(true);
    await pom.waitForStateChange(boostedBoard.stateID, PLAYER_ONE_VIEW);

    const opponentTurnBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(opponentTurnBoard.cards[chiefTuiId]?.strength).toBe(printedStrength);
  });

  test("Bodyguard does not prevent an opponent from challenging a location", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-44-broadway-bodyguard-location", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const broadwayId = findCardIdByLabel(
      setupBoard,
      PLAYER_TWO_ID,
      "play",
      "Broadway - Sturdy and Strong",
    );
    const locationId = findCardIdByLabel(
      setupBoard,
      PLAYER_TWO_ID,
      "play",
      "Castle Wyvern - Above the Clouds",
    );
    const peteId = findCardIdByLabel(setupBoard, PLAYER_ONE_ID, "play", "Pete - Bad Guy");

    const challengeResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "challenge", {
      attackerId: peteId,
      defenderId: locationId,
    });
    expect(challengeResult.success, JSON.stringify(challengeResult)).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.cards[locationId]?.damage).toBeGreaterThan(0);
    expect(resolvedBoard.players[PLAYER_TWO_ID]?.play).toContain(broadwayId);
  });

  test("a ready Tiana Restaurant Owner does not create a phantom challenge trigger", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-43-tiana-restaurant-owner", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Prince Eric - Noble Swordsman",
    );
    const defenderId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Monterey Jack - Watchful Ranger",
    );

    const challengeResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "challenge", {
      attackerId,
      defenderId,
    });
    expect(challengeResult.success, JSON.stringify(challengeResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.bagEffects).toHaveLength(0);
  });

  test("Tinker Bell deals 2 damage after banishing another character in a challenge", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-37-tinker-bell-giant-fairy", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const tinkerBellId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Tinker Bell - Giant Fairy",
    );
    const peteId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Pete - Bad Guy");
    const grammaTalaId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Gramma Tala - Storyteller",
    );

    const challengeResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "challenge", {
      attackerId: tinkerBellId,
      defenderId: peteId,
    });
    expect(challengeResult.success, JSON.stringify(challengeResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.players[PLAYER_TWO_ID]?.play).not.toContain(peteId);
    const bagEffect = resolvedBoard.bagEffects[0];
    expect(bagEffect).toBeDefined();
    const resolveResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        resolveOptional: true,
        targets: [grammaTalaId],
      },
    });
    expect(resolveResult.success, JSON.stringify(resolveResult)).toBe(true);
    await pom.waitForStateChange(resolvedBoard.stateID, PLAYER_ONE_VIEW);

    const damagedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(damagedBoard.players[PLAYER_TWO_ID]?.discard).toContain(grammaTalaId);
  });

  test("Belle Accomplished Mystic moves the selected damage between visible characters", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-36-belle-accomplished-mystic", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const belleId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Belle - Accomplished Mystic");
    const sourceId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Chief Tui - Respected Leader",
    );
    const destinationId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Chief Tui - Respected Leader",
    );
    expect(board.cards[sourceId]?.damage).toBe(2);
    expect(board.cards[destinationId]?.damage).toBe(0);

    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: belleId,
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const boardWithTrigger = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = boardWithTrigger.bagEffects[0];
    expect(bagEffect).toBeDefined();
    const resolveResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        targets: [sourceId, destinationId],
        amount: 2,
      },
    });
    expect(resolveResult.success, JSON.stringify(resolveResult)).toBe(true);
    await pom.waitForStateChange(boardWithTrigger.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.cards[sourceId]?.damage).toBe(0);
    expect(resolvedBoard.cards[destinationId]?.damage).toBe(2);
  });

  test("Retro Evolution Device banishes Belle and plays eligible Genie for free", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("retro-evolution-device-genie", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const deviceId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Retro Evolution Device");
    const belleId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Belle - Strange but Special");
    const genieId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Genie - On the Job");

    const result = await executeWithRetry(pom, PLAYER_ONE_VIEW, "activateAbility", {
      cardId: deviceId,
      abilityIndex: 0,
      effectSelections: {
        effectBanishCharacterIds: [belleId],
        effectPlayCardFromHandIds: [genieId],
      },
    });
    expect(result.success, JSON.stringify(result)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.discard).toContain(belleId);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.play).toContain(genieId);
    expect(resolvedBoard.cards[deviceId]?.exerted).toBe(true);
  });

  test("Royal Guard stacks Challenger for every card Demona draws", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-29-demona-royal-guard", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const demonaId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "hand",
      "Demona - Scourge of the Wyvern Clan",
    );
    const royalGuardId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Royal Guard - Octopus Soldier",
    );

    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: demonaId,
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);

    expect(resolvedBoard.players[PLAYER_ONE_ID]?.hand).toHaveLength(3);
    expect(
      resolvedBoard.cards[royalGuardId]?.keywordValues?.challenger,
      JSON.stringify(resolvedBoard.cards[royalGuardId]),
    ).toBe(2);
  });

  test("Palace Guard vanishes after Fire the Cannons chooses it", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-palace-guard-fire-the-cannons",
        name: "Feedback - Palace Guard / Fire the Cannons",
        description: "Fire the Cannons chooses an opposing Vanish character.",
        playerOne: {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          deck: 2,
        },
        playerTwo: {
          play: [{ card: palaceGuardSpectralSentry, isDrying: false }],
          deck: 2,
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const actionId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Fire the Cannons!");
    const palaceGuardId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Palace Guard - Spectral Sentry",
    );

    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: actionId,
      targets: [palaceGuardId],
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.players[PLAYER_TWO_ID]?.discard).toContain(palaceGuardId);
  });

  test("Scrooge's Counting House gains effective boosted lore at the next Set step", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-scrooges-counting-house-effective-lore",
        name: "Feedback - Scrooge's Counting House effective lore",
        description: "Four cards under the location make its next Set-step lore value 5.",
        playerOne: { deck: 2 },
        playerTwo: {
          play: [
            {
              card: scroogesCountingHouseEbenezersOffice,
              cardsUnder: [
                grammaTalaStoryteller,
                mickeyMouseTrueFriend,
                peteBadGuy,
                palaceGuardSpectralSentry,
              ],
            },
          ],
          deck: 2,
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const countingHouseId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Scrooge's Counting House - Ebenezer's Office",
    );
    expect(board.cards[countingHouseId]?.lore).toBe(5);
    expect(board.players[PLAYER_TWO_ID]?.lore).toBe(0);

    const passResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "passTurn", {});
    expect(passResult.success, JSON.stringify(passResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.players[PLAYER_TWO_ID]?.lore).toBe(5);
  });

  test("Anna Ice Breaker targets an opposing character and prevents its next ready", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-anna-ice-breaker-ready-restriction",
        name: "Feedback - Anna Ice Breaker ready restriction",
        description: "Anna chooses an exerted opposing character for WINTER AMBUSH.",
        playerOne: {
          hand: [annaIceBreaker],
          inkwell: annaIceBreaker.cost,
          deck: 2,
        },
        playerTwo: {
          play: [{ card: mickeyMouseTrueFriend, exerted: true, isDrying: false }],
          deck: 2,
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const annaId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Anna - Ice Breaker");
    const mickeyId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Mickey Mouse - True Friend");
    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: annaId,
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const boardWithTrigger = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = boardWithTrigger.bagEffects[0];
    expect(bagEffect).toBeDefined();
    const resolveResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: { targets: [mickeyId] },
    });
    expect(resolveResult.success, JSON.stringify(resolveResult)).toBe(true);
    await pom.waitForStateChange(boardWithTrigger.stateID, PLAYER_ONE_VIEW);

    const restrictedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const passResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "passTurn", {});
    expect(passResult.success, JSON.stringify(passResult)).toBe(true);
    await pom.waitForStateChange(restrictedBoard.stateID, PLAYER_ONE_VIEW);

    const opponentTurnBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(opponentTurnBoard.cards[mickeyId]?.exerted).toBe(true);
  });

  test("Angel Experiment 624 accepts a selected discard cost and deals 2 damage", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-angel-624-discard-cost",
        name: "Feedback - Angel 624 discard cost",
        description: "Angel discards Gramma Tala to activate GOOD AIM against Mickey.",
        playerOne: {
          hand: [grammaTalaStoryteller],
          play: [{ card: angelExperiment624, isDrying: false }],
          deck: 2,
        },
        playerTwo: {
          play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
          deck: 2,
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const angelId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Angel - Experiment 624");
    const discardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Gramma Tala - Storyteller");
    const targetId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Mickey Mouse - True Friend");

    const abilityResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "activateAbility", {
      cardId: angelId,
      abilityIndex: 0,
      costs: { discardCards: [discardId] },
      targets: [targetId],
    });
    expect(abilityResult.success, JSON.stringify(abilityResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.discard).toContain(discardId);
    expect(resolvedBoard.cards[targetId]?.damage).toBe(2);
  });

  test("an exerted character can move to a location", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-exerted-character-location-move",
        name: "Feedback - exerted character location move",
        description: "An exerted Mickey can pay to move to Hidden Cove.",
        playerOne: {
          play: [
            { card: mickeyMouseTrueFriend, exerted: true, isDrying: false },
            hiddenCoveTranquilHaven,
          ],
          inkwell: hiddenCoveTranquilHaven.moveCost,
          deck: 2,
        },
        playerTwo: { deck: 2 },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const characterId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Mickey Mouse - True Friend",
    );
    const locationId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Hidden Cove - Tranquil Haven",
    );
    expect(board.cards[characterId]?.exerted).toBe(true);

    const moveResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "moveCharacterToLocation", {
      characterId,
      locationId,
    });
    expect(moveResult.success, JSON.stringify(moveResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.cards[characterId]?.exerted).toBe(true);
    expect(resolvedBoard.cards[characterId]?.atLocationId).toBe(locationId);
  });

  test("Sail the Azurite Sea exposes and spends the additional inkwell action", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-sail-the-azurite-sea-additional-ink",
        name: "Feedback - Sail the Azurite Sea additional ink",
        description: "Ink once, play Sail, then ink a second card this turn.",
        playerOne: {
          hand: [sailTheAzuriteSea, grammaTalaStoryteller, mickeyMouseTrueFriend],
          inkwell: sailTheAzuriteSea.cost,
          deck: [peteBadGuy],
        },
        playerTwo: { deck: 2 },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const sailId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Sail the Azurite Sea");
    const firstInkId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Gramma Tala - Storyteller");
    const secondInkId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "hand",
      "Mickey Mouse - True Friend",
    );

    const firstInkResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "putCardIntoInkwell", {
      cardId: firstInkId,
    });
    expect(firstInkResult.success, JSON.stringify(firstInkResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const afterFirstInk = await pom.getBoard(PLAYER_ONE_VIEW);
    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: sailId,
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(afterFirstInk.stateID, PLAYER_ONE_VIEW);

    const afterSail = await pom.getBoard(PLAYER_ONE_VIEW);
    const secondInkResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "putCardIntoInkwell", {
      cardId: secondInkId,
    });
    expect(secondInkResult.success, JSON.stringify(secondInkResult)).toBe(true);
    await pom.waitForStateChange(afterSail.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.inkwell).toHaveLength(4);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.hand).toHaveLength(1);
  });

  for (const viewport of [
    { name: "iPhone portrait", width: 393, height: 852 },
    { name: "iPhone landscape", width: 852, height: 393 },
  ]) {
    test(`${viewport.name} keeps the opponent board and Pass Turn reachable`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const pom = new LorcanaSimulatorPom(page);
      await pom.gotoPath(
        buildRegressionFixturePath("bug-44-broadway-bodyguard-location", {
          view: PLAYER_ONE_VIEW,
        }),
      );

      const passTurn = page.getByRole("button", { name: "Pass Turn" });
      const opponentPlay = page.getByRole("region", { name: "Play for Player Two" });
      await expect(passTurn).toBeVisible();
      await expect(opponentPlay).toBeVisible();

      const passTurnBox = await passTurn.boundingBox();
      const opponentBox = await opponentPlay.boundingBox();
      expect(passTurnBox).not.toBeNull();
      expect(opponentBox).not.toBeNull();
      expect(passTurnBox!.x).toBeGreaterThanOrEqual(0);
      expect(passTurnBox!.y).toBeGreaterThanOrEqual(0);
      expect(passTurnBox!.x + passTurnBox!.width).toBeLessThanOrEqual(viewport.width);
      expect(passTurnBox!.y + passTurnBox!.height).toBeLessThanOrEqual(viewport.height);
      expect(opponentBox!.y + opponentBox!.height).toBeGreaterThan(0);
      expect(opponentBox!.y).toBeLessThan(viewport.height);
    });
  }

  test("desktop card preview does not cover the hovered play card", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-44-broadway-bodyguard-location", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const broadwayId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Broadway - Sturdy and Strong",
    );
    const card = page.locator(`[data-card-id="${broadwayId}"][data-zone-id="play"]`).last();
    await card.hover();

    const preview = page.getByRole("dialog", { name: "Card preview panel" });
    await expect(preview).toBeVisible();
    const cardBox = await card.boundingBox();
    const previewBox = await preview.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    const overlaps = !(
      previewBox!.x + previewBox!.width <= cardBox!.x ||
      cardBox!.x + cardBox!.width <= previewBox!.x ||
      previewBox!.y + previewBox!.height <= cardBox!.y ||
      cardBox!.y + cardBox!.height <= previewBox!.y
    );
    expect(overlaps).toBe(false);
  });

  test("Fresh Ink uses a compact icon tag instead of covering card characteristics", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "feedback-fresh-ink-compact-tag",
        name: "Feedback - compact Fresh Ink tag",
        description: "A drying character displays Fresh Ink as a compact tag.",
        playerOne: {
          play: [{ card: angelExperiment624, isDrying: true }],
          deck: 2,
        },
        playerTwo: { deck: 2 },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const angelId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Angel - Experiment 624");
    const card = page.locator(`[data-card-id="${angelId}"][data-zone-id="play"]`).last();
    await expect(card).toBeVisible();
    const freshInkTag = page.getByRole("button", { name: "Fresh Ink", exact: true });
    await expect(freshInkTag).toBeVisible();
    const tagBox = await freshInkTag.boundingBox();
    expect(tagBox).not.toBeNull();
    expect(tagBox!.width).toBeLessThanOrEqual(30);
    expect(tagBox!.height).toBeLessThanOrEqual(30);
  });

  test("Beyond the Horizon names each player-target choice instead of generic options", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixtureId: "triage-2026-05-18-beyond-the-horizon-empty-hand",
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const songId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Beyond the Horizon");
    const moanaId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Moana - Chosen by the Ocean");
    const mickeyId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Mickey Mouse - Detective");
    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: songId,
      cost: "singTogether",
      singers: [moanaId, mickeyId],
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    await expect(
      page.getByRole("button", {
        name: "All players discard their hands and draw 3 cards",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "You discard your hand and draw 3 cards",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Chosen opponent discards their hand and draws 3 cards",
      }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Option [123]$/ })).toHaveCount(0);
  });

  test("King Candy sends Sweet Revenge's optional choice to the opponent", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-52-king-candy-opponent-chooser", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const board = await pom.getBoard("authoritative");
    const smashId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Smash");
    const candleheadId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Candlehead - Dedicated Racer",
    );
    const kingCandyId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "King Candy - Royal Racer");
    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: smashId,
      targets: [candleheadId],
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    const triggeringBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const sweetRevenge = triggeringBoard.bagEffects.find(
      (effect) => effect.sourceId === kingCandyId,
    );
    expect(sweetRevenge, JSON.stringify(triggeringBoard.bagEffects)).toBeDefined();
    // The controller orders/resolves their triggered ability from the bag first.
    // SWEET REVENGE then suspends into an opponent-owned optional choice.
    expect(sweetRevenge?.chooserId).toBe(PLAYER_ONE_ID);
    expect(sweetRevenge?.selectionContext).toBeUndefined();
    await expect(
      page.getByRole("button", { name: /Effects.*King Candy - Royal Racer/ }),
    ).toBeVisible();

    const resolveTriggerResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "resolveBag", {
      bagId: sweetRevenge!.id,
    });
    expect(resolveTriggerResult.success, JSON.stringify(resolveTriggerResult)).toBe(true);
    await pom.waitForStateChange(triggeringBoard.stateID, PLAYER_ONE_VIEW);

    await expect
      .poll(async () => (await pom.getBoard(PLAYER_TWO_VIEW)).pendingChoice?.playerID)
      .toBe(PLAYER_TWO_ID);

    const opponentPromptBoard = await pom.getBoard(PLAYER_TWO_VIEW);
    expect(opponentPromptBoard.pendingChoice?.playerID).toBe(PLAYER_TWO_ID);
    const sweetRevengePrompt = opponentPromptBoard.pendingEffects.find(
      (effect) => effect.sourceId === kingCandyId,
    );
    expect(sweetRevengePrompt, JSON.stringify(opponentPromptBoard.pendingEffects)).toBeDefined();
    expect(sweetRevengePrompt?.selectionContext?.chooserId).toBe(PLAYER_TWO_ID);

    const declineResult = await executeWithRetry(pom, PLAYER_TWO_VIEW, "resolveEffect", {
      effectId: sweetRevengePrompt!.id,
      params: { resolveOptional: false },
    });
    expect(declineResult.success, JSON.stringify(declineResult)).toBe(true);
  });

  test("Undo restores a play that created triggered abilities", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("bug-52-king-candy-opponent-chooser", {
        view: PLAYER_ONE_VIEW,
      }),
    );

    const before = await pom.getBoard("authoritative");
    const smashId = findCardIdByLabel(before, PLAYER_ONE_ID, "hand", "Smash");
    const candleheadId = findCardIdByLabel(
      before,
      PLAYER_ONE_ID,
      "play",
      "Candlehead - Dedicated Racer",
    );
    const playResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: smashId,
      targets: [candleheadId],
    });
    expect(playResult.success, JSON.stringify(playResult)).toBe(true);
    await pom.waitForStateChange(before.stateID, PLAYER_ONE_VIEW);

    const afterPlay = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterPlay.bagEffects.length).toBeGreaterThan(0);
    await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByRole("button", { name: "Confirm Undo" })).toBeVisible();
    await page.getByRole("button", { name: "Confirm Undo" }).click();
    await pom.waitForStateChange(afterPlay.stateID, PLAYER_ONE_VIEW);

    await expect
      .poll(async () => (await pom.getBoard(PLAYER_ONE_VIEW)).cards[smashId]?.zone)
      .toBe("hand");

    const afterUndo = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterUndo.cards[smashId]?.zone).toBe("hand");
    expect(afterUndo.cards[candleheadId]?.zone).toBe("play");
    expect(afterUndo.bagEffects).toHaveLength(0);
  });

  test("Grandmother Willow leaves the lore badge readable", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("feedback-ui-legibility", { view: PLAYER_ONE_VIEW }),
    );

    const loreBadge = page.getByLabel("Lore: 7");
    const willowCard = page
      .getByRole("button", { name: /Grandmother Willow - Ancient Advisor, cost 2/ })
      .last();
    await expect(loreBadge).toBeVisible();
    await expect(willowCard).toBeVisible();

    const loreBox = await loreBadge.boundingBox();
    const cardBox = await willowCard.boundingBox();
    expect(loreBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    expect(
      cardBox!.x < loreBox!.x + loreBox!.width &&
        cardBox!.x + cardBox!.width > loreBox!.x &&
        cardBox!.y < loreBox!.y + loreBox!.height &&
        cardBox!.y + cardBox!.height > loreBox!.y,
    ).toBe(false);
  });

  test("a populated item zone remains visible and selectable", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("feedback-ui-legibility", { view: PLAYER_ONE_VIEW }),
    );

    for (const cardName of ["Fishbone Quill", "Pawpsicle", "Lucky Dime"]) {
      const item = page.getByRole("button", { name: new RegExp(`${cardName}, cost`) }).last();
      await expect(item).toBeVisible();
      const box = await item.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(48);
      expect(box!.height).toBeGreaterThanOrEqual(60);
    }
  });

  test("four ink cannot pay for two cost-three actions", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      buildRegressionFixturePath("feedback-ui-legibility", { view: PLAYER_ONE_VIEW }),
    );

    const before = await pom.getBoard("authoritative");
    const smashId = findCardIdByLabel(before, PLAYER_ONE_ID, "hand", "Smash");
    const stormId = findCardIdByLabel(before, PLAYER_ONE_ID, "hand", "Let the Storm Rage On");
    const willowId = findCardIdByLabel(
      before,
      PLAYER_ONE_ID,
      "play",
      "Grandmother Willow - Ancient Advisor",
    );
    const firstPlay = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: smashId,
      targets: [willowId],
    });
    expect(firstPlay.success, JSON.stringify(firstPlay)).toBe(true);
    await pom.waitForStateChange(before.stateID, PLAYER_ONE_VIEW);

    const afterFirstPlay = await pom.getBoard(PLAYER_ONE_VIEW);
    const exertedInkCount = afterFirstPlay.players[PLAYER_ONE_ID]!.inkwell.filter(
      (cardId) => afterFirstPlay.cards[cardId]?.exerted,
    ).length;
    expect(exertedInkCount).toBe(3);

    const secondPlay = await executeWithRetry(pom, PLAYER_ONE_VIEW, "playCard", {
      cardId: stormId,
      targets: [willowId],
    });
    expect(secondPlay.success).toBe(false);
    const afterRejectedPlay = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(afterRejectedPlay.cards[stormId]?.zone).toBe("hand");
  });
});
