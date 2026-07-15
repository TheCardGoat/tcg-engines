import {
  mickeyMouseTrueFriend,
  minnieMouseAlwaysClassy,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import {
  all013Cards,
  buzzLightyearGrounded,
  gopherHunnyCook,
  meridaWispConjurer,
  mickeyMouseMinnieMouseAdventuringDuo,
  startle,
  woodyHelpingAFriend,
} from "@tcg/lorcana-cards/cards/013";
import {
  cardByName,
  expect,
  findCardIdByLabel,
  test,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const SET_13_CARD_COUNT = 140;
const SET_13_GALLERY_FIXTURE_ID = "set13-card-gallery";
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";
const PLAYER_ONE_VIEW = "playerOne" as const;
const HAND_ZONE = "hand";
const SET_13_CHARACTER_BOARD_FIXTURE_IDS = [
  "set13-characters-amber-board",
  "set13-characters-amethyst-board",
  "set13-characters-emerald-board",
  "set13-characters-ruby-board",
  "set13-characters-sapphire-board",
  "set13-characters-steel-board",
] as const;

const cardLabel = (card: { name: string; version?: string }) =>
  card.version ? `${card.name} - ${card.version}` : card.name;

const SET_13_DEFINITION_IDS = new Set(all013Cards.map((card) => card.id));

const SET_13_INTERACTION_FIXTURE = {
  id: "set13-startle-interaction",
  name: "Set 13 Startle Interaction",
  description: "Set 13 prompt and event-log browser proof.",
  playerOne: {
    inkwell: 10,
    hand: [startle],
    play: [mickeyMouseTrueFriend, minnieMouseAlwaysClassy],
    deck: 5,
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

const SET_13_WOODY_HELPING_FIXTURE = {
  id: "set13-woody-helping-a-friend-interaction",
  name: "Set 13 Woody Helping a Friend Interaction",
  description: "Woody branch selection and sequential optional effect browser proof.",
  playerOne: {
    inkwell: 10,
    hand: [woodyHelpingAFriend, minnieMouseAlwaysClassy],
    play: [],
    discard: [simbaProtectiveCub],
    deck: 5,
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

const SET_13_WOODY_WITH_TOY_FIXTURE = {
  ...SET_13_WOODY_HELPING_FIXTURE,
  id: "set13-woody-helping-a-friend-with-toy-interaction",
  name: "Set 13 Woody Helping a Friend With Toy Interaction",
  playerOne: {
    ...SET_13_WOODY_HELPING_FIXTURE.playerOne,
    play: [buzzLightyearGrounded],
  },
} as const;

const SET_13_MERIDA_GOPHER_FIXTURE = {
  id: "set13-merida-gopher-enter-exerted-interaction",
  name: "Set 13 Merida and Gopher Enter Exerted Interaction",
  description: "Merida and Gopher may-enter-play-exerted browser proof.",
  playerOne: {
    inkwell: meridaWispConjurer.cost + gopherHunnyCook.cost,
    hand: [meridaWispConjurer, gopherHunnyCook],
    deck: [mickeyMouseTrueFriend],
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

const SET_13_DUO_SHIFT_FIXTURE = {
  id: "set13-mickey-minnie-duo-shift-interaction",
  name: "Set 13 Mickey Mouse and Minnie Mouse Duo Shift Interaction",
  description: "Mickey Mouse & Minnie Mouse slotted Duo Shift browser proof.",
  playerOne: {
    inkwell: 1,
    hand: [mickeyMouseMinnieMouseAdventuringDuo],
    play: [mickeyMouseTrueFriend, minnieMouseAlwaysClassy],
    deck: 5,
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

async function playCardFromHand(
  pom: LorcanaSimulatorPom,
  cardName: string,
  cost: number,
): Promise<void> {
  const card = cardByName(pom.page, cardName);
  await expect(card).toBeVisible();
  await card.click({ force: true });
  await pom.page.getByRole("button", { name: `Play: ${cost} ink` }).click();
}

async function playCardFromHandExerted(
  pom: LorcanaSimulatorPom,
  cardName: string,
  cost: number,
): Promise<void> {
  const previousStatus = await pom.getStatus(PLAYER_ONE_VIEW);
  await playCardFromHand(pom, cardName, cost);

  const guidance = pom.page.getByRole("region", { name: "Active player guidance" });
  await expect(
    guidance.getByText(new RegExp(`Choose how ${cardName} enters play`, "i")),
  ).toBeVisible();
  await guidance.getByRole("button", { name: "Play Exerted" }).click();
  await pom.waitForStateChange(previousStatus.stateID, PLAYER_ONE_VIEW);
}

async function chooseWoodyBranch(pom: LorcanaSimulatorPom, optionName: string): Promise<void> {
  const overlay = pom.page.getByTestId("choice-resolution-overlay");
  await expect(overlay).toBeVisible();
  await expect(overlay).toContainText("Woody - Helping a Friend");
  const beforeChoice = await pom.getBoard(PLAYER_ONE_VIEW);
  await overlay.getByRole("button", { name: optionName }).click();
  await pom.waitForStateChange(beforeChoice.stateID, PLAYER_ONE_VIEW);
}

async function chooseCardFromTargetDialog(
  pom: LorcanaSimulatorPom,
  cardName: RegExp | string,
): Promise<void> {
  const picker = pom.page.locator(".card-target-dialog");
  await expect(picker).toBeVisible();
  await picker.locator(".card-button", { hasText: cardName }).first().click();
}

async function resolveWoodyDiscardReturn(
  pom: LorcanaSimulatorPom,
  cardName: RegExp | string,
): Promise<void> {
  const beforeChoice = await pom.getBoard(PLAYER_ONE_VIEW);
  await chooseCardFromTargetDialog(pom, cardName);
  await pom.waitForStateChange(beforeChoice.stateID, PLAYER_ONE_VIEW);
}

async function resolveWoodyFreePlay(
  pom: LorcanaSimulatorPom,
  cardName: RegExp | string,
  options: { inlineTarget?: boolean } = {},
): Promise<void> {
  const beforeChoice = await pom.getBoard(PLAYER_ONE_VIEW);
  if (options.inlineTarget) {
    const target =
      typeof cardName === "string" ? cardByName(pom.page, cardName) : pom.page.getByLabel(cardName);
    await target.click({ force: true });
  } else {
    await chooseCardFromTargetDialog(pom, cardName);
  }
  await pom.waitForStateChange(beforeChoice.stateID, PLAYER_ONE_VIEW);
}

async function expectPlayerOneCardVisuallyInPlayExerted(
  pom: LorcanaSimulatorPom,
  cardName: string,
  cost: number,
): Promise<void> {
  const playZone = pom.page.getByRole("region", { name: "Play for Player One" });
  await expect(
    playZone.getByRole("button", {
      name: `Fresh Ink Exerted ${cardName}, cost ${cost}`,
    }),
  ).toBeVisible();
}

test.describe("Set 13 visual card gallery", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(90_000);

  test("renders every fetched Set 13 card in the simulator browser", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const expectedDefinitionIds = all013Cards.map((card) => card.id).sort();
    expect(expectedDefinitionIds).toHaveLength(SET_13_CARD_COUNT);

    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SET_13_GALLERY_FIXTURE_ID, view: "playerOne" });

    await expect(page.getByTestId("lorcana-test-harness")).toBeVisible();

    const board = await pom.getBoard("playerOne");
    const handCardIds = board.players[PLAYER_ONE_ID]?.hand ?? [];
    expect(handCardIds).toHaveLength(SET_13_CARD_COUNT);

    const projectedDefinitionIds = handCardIds
      .map((cardId) => board.cards[cardId]?.definitionId)
      .filter((definitionId): definitionId is string => typeof definitionId === "string")
      .sort();
    expect(projectedDefinitionIds).toEqual(expectedDefinitionIds);

    const renderedCards = page.locator(
      `[data-zone-id="${HAND_ZONE}"][data-player-id="${PLAYER_ONE_ID}"][data-card-id]`,
    );
    await expect(renderedCards.first()).toBeVisible();

    const renderedCardIds = await renderedCards.evaluateAll((elements) =>
      [...new Set(elements.map((element) => element.getAttribute("data-card-id") ?? ""))]
        .filter((cardId) => cardId.length > 0)
        .sort(),
    );
    expect(renderedCardIds).toEqual([...handCardIds].map(String).sort());

    const badRenderedCards = await renderedCards.evaluateAll((elements) => {
      const renderedByCardId = new Map<
        string,
        { cardId: string; hasAccessibleLabel: boolean; height: number; width: number }
      >();

      for (const element of elements) {
        const cardId = element.getAttribute("data-card-id") ?? "";
        if (cardId.length === 0) {
          continue;
        }

        const existing = renderedByCardId.get(cardId);
        const box = element.getBoundingClientRect();
        renderedByCardId.set(cardId, {
          cardId,
          hasAccessibleLabel:
            (existing?.hasAccessibleLabel ?? false) ||
            (element.getAttribute("aria-label") ?? "").length > 0,
          height: Math.max(existing?.height ?? 0, box.height),
          width: Math.max(existing?.width ?? 0, box.width),
        });
      }

      return [...renderedByCardId.values()].filter(
        (card) =>
          card.cardId.length === 0 ||
          !card.hasAccessibleLabel ||
          card.width <= 0 ||
          card.height <= 0,
      );
    });
    expect(badRenderedCards).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("plays a Set 13 card through prompts and records the event log", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();

    await pom.goto({ fixture: SET_13_INTERACTION_FIXTURE, view: PLAYER_ONE_VIEW });

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    const eventLog = page.getByRole("region", { name: "Event log" });

    await expect(eventLog.getByText("No moves recorded yet.")).toBeVisible();

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const startleId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", cardLabel(startle));
    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: startleId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    await expect(
      guidance.getByText(/Select the required target or player for\s+Startle/i),
    ).toBeVisible();
    const mickeyCard = cardByName(page, cardLabel(mickeyMouseTrueFriend));
    await expect(mickeyCard).toHaveClass(/card-face--valid-target/);

    const beforeTarget = await pom.getStatus(PLAYER_ONE_VIEW);
    await mickeyCard.click({ force: true });
    await pom.waitForStateChange(beforeTarget.stateID, PLAYER_ONE_VIEW);

    await expect(playerOne).toHaveCardStrength({
      card: cardLabel(mickeyMouseTrueFriend),
      value: mickeyMouseTrueFriend.strength - 3,
    });
    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(startle),
      zone: "discard",
    });

    await expect(eventLog.getByText("No moves recorded yet.")).toHaveCount(0);
    await expect(eventLog).toContainText("Startle");
    await expect(eventLog).toContainText("Mickey Mouse");
    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });

  test("plays Merida and Gopher through the enter-exerted prompt", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);

    await pom.goto({ fixture: SET_13_MERIDA_GOPHER_FIXTURE, view: PLAYER_ONE_VIEW });

    await playCardFromHandExerted(pom, cardLabel(meridaWispConjurer), meridaWispConjurer.cost);
    await expectPlayerOneCardVisuallyInPlayExerted(
      pom,
      cardLabel(meridaWispConjurer),
      meridaWispConjurer.cost,
    );

    await playCardFromHandExerted(pom, cardLabel(gopherHunnyCook), gopherHunnyCook.cost);
    await expectPlayerOneCardVisuallyInPlayExerted(
      pom,
      cardLabel(gopherHunnyCook),
      gopherHunnyCook.cost,
    );

    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });

  test("plays Mickey Mouse & Minnie Mouse through slotted Duo Shift target selection", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: SET_13_DUO_SHIFT_FIXTURE, view: PLAYER_ONE_VIEW });

    const initialBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const duoCardId = findCardIdByLabel(
      initialBoard,
      PLAYER_ONE_ID,
      HAND_ZONE,
      cardLabel(mickeyMouseMinnieMouseAdventuringDuo),
    );
    const mickeyTargetId = findCardIdByLabel(
      initialBoard,
      PLAYER_ONE_ID,
      "play",
      cardLabel(mickeyMouseTrueFriend),
    );
    const minnieTargetId = findCardIdByLabel(
      initialBoard,
      PLAYER_ONE_ID,
      "play",
      cardLabel(minnieMouseAlwaysClassy),
    );
    await page
      .locator(`[data-card-id="${duoCardId}"]`)
      .first()
      .getByRole("button", { name: "Shift" })
      .dispatchEvent("click");
    await page.getByRole("button", { name: /Shift: 0 ink/i }).click();

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    await expect(guidance).toContainText("Mickey Mouse");
    await expect(guidance).toContainText("Minnie Mouse");
    await expect(guidance.getByText("Choosing now")).toHaveCount(2);
    await guidance.getByRole("button", { name: "Move guidance to top" }).click();

    await page.locator(`[data-card-id="${mickeyTargetId}"]`).first().click({ force: true });
    await expect(guidance.getByText("Selected", { exact: true })).toHaveCount(1);

    await page.locator(`[data-card-id="${minnieTargetId}"]`).first().click({ force: true });
    await expect(guidance.getByText("Selected", { exact: true })).toHaveCount(2);

    const beforeConfirm = await pom.getBoard(PLAYER_ONE_VIEW);
    await guidance.getByRole("button", { name: /confirm shift/i }).click();
    await pom.waitForStateChange(beforeConfirm.stateID, PLAYER_ONE_VIEW);

    await expect(
      page.getByRole("button", {
        name: /Shifted 2 cards under Mickey Mouse & Minnie Mouse - Adventuring Duo/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Event log" })).toContainText(
      "Mickey Mouse & Minnie Mouse - Adventuring Duo",
    );
    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(mickeyMouseMinnieMouseAdventuringDuo),
      zone: "play",
    });

    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });

  test("Woody Helping a Friend can return from discard when no other Toy is in play", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: SET_13_WOODY_HELPING_FIXTURE, view: PLAYER_ONE_VIEW });

    await playCardFromHand(pom, cardLabel(woodyHelpingAFriend), woodyHelpingAFriend.cost);
    await chooseWoodyBranch(pom, "Option 1");
    await resolveWoodyDiscardReturn(pom, simbaProtectiveCub.name);

    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(simbaProtectiveCub),
      zone: "hand",
    });
    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(minnieMouseAlwaysClassy),
      zone: "hand",
    });

    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });

  test("Woody Helping a Friend can play a cheap character when no other Toy is in play", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: SET_13_WOODY_HELPING_FIXTURE, view: PLAYER_ONE_VIEW });

    await playCardFromHand(pom, cardLabel(woodyHelpingAFriend), woodyHelpingAFriend.cost);
    await chooseWoodyBranch(pom, "Option 2");

    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(minnieMouseAlwaysClassy),
      zone: "play",
    });
    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(simbaProtectiveCub),
      zone: "discard",
    });

    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });

  test("Woody Helping a Friend resolves both actions when another Toy is in play", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: SET_13_WOODY_WITH_TOY_FIXTURE, view: PLAYER_ONE_VIEW });

    await playCardFromHand(pom, cardLabel(woodyHelpingAFriend), woodyHelpingAFriend.cost);
    await expect(page.getByTestId("choice-resolution-overlay")).toHaveCount(0);
    await resolveWoodyDiscardReturn(pom, simbaProtectiveCub.name);
    await resolveWoodyFreePlay(pom, cardLabel(minnieMouseAlwaysClassy), {
      inlineTarget: true,
    });

    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(simbaProtectiveCub),
      zone: "hand",
    });
    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(minnieMouseAlwaysClassy),
      zone: "play",
    });
    await expect(pom.asBottomPlayer()).toHaveCardInZone({
      card: cardLabel(buzzLightyearGrounded),
      zone: "play",
    });

    expect(
      pageErrors.filter(
        (message) =>
          !message.includes("ResizeObserver loop completed with undelivered notifications"),
      ),
    ).toEqual([]);
  });

  for (const fixtureId of SET_13_CHARACTER_BOARD_FIXTURE_IDS) {
    test(`quests every Set 13 character in ${fixtureId} and records readable logs`, async ({
      page,
    }) => {
      test.setTimeout(180_000);

      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const pom = new LorcanaSimulatorPom(page);
      const checkedCards: string[] = [];

      await pom.goto({ fixtureId, view: PLAYER_ONE_VIEW });
      const fixtureBoard = await pom.getBoard(PLAYER_ONE_VIEW);
      const set13Cards = fixtureBoard.players[PLAYER_ONE_ID].play
        .map((cardId) => fixtureBoard.cards[cardId])
        .filter((card) => card && SET_13_DEFINITION_IDS.has(card.definitionId ?? ""))
        .map((card) => ({
          definitionId: card.definitionId,
          fullName: card.fullName,
        }));

      expect(
        set13Cards.length,
        `${fixtureId} should include Set 13 character cards`,
      ).toBeGreaterThan(0);

      for (const targetCard of set13Cards) {
        await pom.reset();
        const beforeBoard = await pom.getBoard(PLAYER_ONE_VIEW);
        const cardId = beforeBoard.players[PLAYER_ONE_ID].play.find(
          (candidate) => beforeBoard.cards[candidate]?.definitionId === targetCard.definitionId,
        );
        expect(cardId, `${fixtureId} should expose ${targetCard.fullName}`).toBeTruthy();
        const card = beforeBoard.cards[cardId!];
        expect(card, `${fixtureId} should expose ${cardId}`).toBeTruthy();
        expect(card.exerted, `${card.fullName} should start ready in ${fixtureId}`).toBe(false);

        const previousLore = beforeBoard.players[PLAYER_ONE_ID].lore;
        const result = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: cardId! });
        if (result.success) {
          await pom.waitForStateChange(beforeBoard.stateID, PLAYER_ONE_VIEW);

          const afterBoard = await pom.getBoard(PLAYER_ONE_VIEW);
          expect(
            afterBoard.players[PLAYER_ONE_ID].lore,
            `${card.fullName} should gain at least printed quest lore in ${fixtureId}`,
          ).toBeGreaterThanOrEqual(previousLore + (card.lore ?? 0));

          await expect
            .poll(() => page.evaluate(() => document.body.innerText), {
              message: `${card.fullName} quest log should be visible in ${fixtureId}`,
              timeout: 10_000,
            })
            .toContain(`Quested with ${card.fullName} for ${card.lore ?? 0} lore.`);
        } else {
          const defenderId = beforeBoard.players[PLAYER_TWO_ID].play.find((candidate) => {
            const defender = beforeBoard.cards[candidate];
            return defender?.cardType === "character" && defender.exerted;
          });
          expect(
            defenderId,
            `${card.fullName} needs an exerted opposing character for challenge fallback in ${fixtureId}`,
          ).toBeTruthy();
          const defender = beforeBoard.cards[defenderId!];
          expect(defender, `${fixtureId} should expose ${defenderId}`).toBeTruthy();

          const challengeResult = await pom.execute(PLAYER_ONE_VIEW, "challenge", {
            attackerId: cardId!,
            defenderId: defenderId!,
          });
          expect(
            challengeResult.success,
            `${card.fullName} should challenge ${defender.fullName} after quest was rejected in ${fixtureId}: ${result.reason ?? result.code ?? "unknown rejection"}`,
          ).toBe(true);
          await pom.waitForStateChange(beforeBoard.stateID, PLAYER_ONE_VIEW);

          await expect
            .poll(() => page.evaluate(() => document.body.innerText), {
              message: `${card.fullName} challenge log should be visible in ${fixtureId}`,
              timeout: 10_000,
            })
            .toContain(`Challenged ${defender.fullName} with ${card.fullName}.`);
        }
        checkedCards.push(`${fixtureId}: ${card.fullName}`);
      }

      expect(checkedCards.length, `${fixtureId} checked cards`).toBe(set13Cards.length);
      expect(
        pageErrors.filter(
          (message) =>
            !message.includes("ResizeObserver loop completed with undelivered notifications"),
        ),
      ).toEqual([]);
    });
  }
});
