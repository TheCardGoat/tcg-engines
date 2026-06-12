import type { Page } from "@playwright/test";
import {
  expect,
  test,
  cardByName,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_TWO_VIEW = "playerTwo" as const;
const AUTHORITATIVE_VIEW = "authoritative" as const;
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";

const FIXTURES = {
  blackCauldron: "triage-2026-05-18-black-cauldron-mufasa",
  cheshireCat: "triage-2026-05-17-cheshire-cat-boost-move-one",
  educationOrElimination: "triage-2026-05-18-education-or-elimination-choice",
  fireflySwarm: "triage-2026-05-18-firefly-swarm-choice",
  fireflySwarmDiscardMetric: "triage-2026-05-18-firefly-swarm-discard-metric",
  fireflySwarmRobinHood: "triage-2026-05-18-firefly-swarm-robin-hood-free-play",
  hadesTargetClarity: "triage-2026-05-17-hades-target-clarity",
  luisa: "triage-2026-05-18-luisa-undamaged-source",
  megaBot: "triage-2026-05-18-megabot-destroy-choice",
} as const;

async function chooseChoiceOption(page: Page, optionName: RegExp | string): Promise<void> {
  const overlay = page.getByTestId("choice-resolution-overlay");
  await expect(overlay).toBeVisible();
  await overlay.getByRole("button", { name: optionName }).click();

  const confirm = overlay.getByRole("button", { name: /^Confirm$/ });
  const confirmIsActionable =
    (await confirm
      .first()
      .isVisible()
      .catch(() => false)) &&
    (await confirm
      .first()
      .isEnabled()
      .catch(() => false));

  if (confirmIsActionable) {
    await confirm.first().click();
  }
}

async function playActionCard(page: Page, cardName: string, inkCost: number): Promise<void> {
  await cardByName(page, cardName).click({ force: true });
  await page.getByRole("button", { name: `Play: ${inkCost} ink` }).click();
}

async function activateVisibleAbility(
  page: Page,
  cardName: string,
  abilityName: string,
): Promise<void> {
  await cardByName(page, cardName).click({ force: true });
  await page.locator("button").filter({ hasText: abilityName }).click();
}

async function getCardDamage(
  pom: LorcanaSimulatorPom,
  playerId: string,
  label: string,
): Promise<number> {
  const board = await pom.getBoard(PLAYER_ONE_VIEW);
  const cardId = findCardIdByLabel(board, playerId, "play", label);
  return board.cards[cardId]?.damage ?? 0;
}

test.describe("2026-05-18 daily feedback visual regressions", () => {
  test("Hades Looking for a Deal shows the chosen character to the opponent", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.hadesTargetClarity, view: PLAYER_TWO_VIEW });

    const initialBoard = await pom.getBoard(AUTHORITATIVE_VIEW);
    const hadesId = findCardIdByLabel(
      initialBoard,
      PLAYER_ONE_ID,
      "hand",
      "Hades - Looking for a Deal",
    );
    const simbaId = findCardIdByLabel(
      initialBoard,
      PLAYER_TWO_ID,
      "play",
      "Simba - Protective Cub",
    );

    const playStateId = initialBoard.stateID;
    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: hadesId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(playStateId, PLAYER_TWO_VIEW);

    const boardAfterPlay = await pom.getBoard(PLAYER_TWO_VIEW);
    const bagEffect = boardAfterPlay.bagEffects[0];
    expect(bagEffect).toBeDefined();

    const resolveStateId = boardAfterPlay.stateID;
    const resolveResult = await pom.execute(PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        resolveOptional: true,
        targets: [simbaId],
      },
    });
    expect(resolveResult.success).toBe(true);
    await pom.waitForStateChange(resolveStateId, PLAYER_TWO_VIEW);

    const overlay = page.getByTestId("choice-resolution-overlay");
    await expect(overlay).toBeVisible();
    await expect(overlay).toContainText("Choose outcome");
    await expect(overlay).toContainText("Hades - Looking for a Deal");
    await expect(overlay).toContainText("WHAT D'YA SAY?");
    await expect(overlay).toContainText("Simba - Protective Cub");
    await expect(overlay).toContainText("put that character on the bottom of their deck");
    await expect(overlay).toContainText("you draw 2 cards");
    await expect(page.getByText("Opponent's time expired")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Drop Opponent" })).toHaveCount(0);
  });

  test("Hades visual route shows the choice prompt only after taking over the opponent", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(
      `/tests/test?fixtureId=${FIXTURES.hadesTargetClarity}&view=${PLAYER_ONE_VIEW}&visual=hades-target-clarity&aiPlayMode=step`,
    );

    await expect(page.getByTestId("choice-resolution-overlay")).toHaveCount(0);
    await page.getByRole("button", { name: "Take Control" }).click();
    await expect(page.getByRole("button", { name: "Release to AI" })).toBeVisible();

    const overlay = page.getByTestId("choice-resolution-overlay");
    await expect(overlay).toBeVisible();
    await expect(overlay).toContainText("Choose outcome");
    await expect(overlay).toContainText("Simba - Protective Cub");
    await expect(overlay).toContainText("put that character on the bottom of their deck");
  });

  test("Firefly Swarm shows distinct mode labels and highlights Dale as a legal target", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.fireflySwarm, view: PLAYER_ONE_VIEW });

    await playActionCard(page, "Firefly Swarm", 3);

    const overlay = page.getByTestId("choice-resolution-overlay");
    await expect(overlay).toContainText("Banish chosen character with 2 or less");
    await expect(overlay).toContainText(
      "If 2 or more other cards were put into your discard this turn, banish chosen character",
    );

    await chooseChoiceOption(page, /Banish chosen character with 2/);
    await expect(
      page.getByText(/Select the required target or player for\s+Firefly Swarm/i),
    ).toBeVisible();
    await expect(cardByName(page, "Dale - Ready for His Shot")).toHaveClass(
      /card-face--valid-target/,
    );
  });

  test("Firefly Swarm discard-metric mode visually banishes a high-strength character", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.fireflySwarmDiscardMetric, view: PLAYER_ONE_VIEW });

    const befuddle = await pom.asBottomPlayer().findCard("Befuddle");
    const developYourBrain = await pom.asBottomPlayer().findCard("Develop Your Brain");
    for (const card of [befuddle, developYourBrain]) {
      const result = await pom.execute(PLAYER_ONE_VIEW, "manualMoveCard", {
        cardId: card.id,
        targetZoneId: "discard:player_one",
      });
      expect(result.success).toBe(true);
    }

    await playActionCard(page, "Firefly Swarm", 3);
    await chooseChoiceOption(
      page,
      /If 2 or more other cards were put into your discard this turn, banish chosen character/i,
    );

    await expect(
      page.getByText(/Select the required target or player for\s+Firefly Swarm/i),
    ).toBeVisible();
    await expect(cardByName(page, "Mickey Mouse - True Friend")).toHaveClass(
      /card-face--valid-target/,
    );

    await cardByName(page, "Mickey Mouse - True Friend").click({ force: true });

    await expect(pom.asTopPlayer()).toHaveCardInZone({
      card: "Mickey Mouse - True Friend",
      zone: "discard",
    });
  });

  test("Firefly Swarm played free by Robin Hood visually advances into target selection", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.fireflySwarmRobinHood, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const robinHoodId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Robin Hood - Sharpshooter",
    );
    const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: robinHoodId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible();
    const fireflyScryCard = page.locator(".scry-card", { hasText: "Firefly Swarm" });
    await expect(fireflyScryCard).toBeVisible();
    await fireflyScryCard.click();
    await page.getByTestId("scry-confirm-button").click();

    await expect(page.getByTestId("choice-resolution-overlay")).toBeVisible();
    await chooseChoiceOption(page, /Banish chosen character with 2/);

    await expect(
      page.getByText(/Select the required target or player for\s+Firefly Swarm/i),
    ).toBeVisible();
    await expect(cardByName(page, "Dale - Ready for His Shot")).toHaveClass(
      /card-face--valid-target/,
    );
  });

  test("Education or Elimination mode 2 visually targets only damaged characters", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.educationOrElimination, view: PLAYER_ONE_VIEW });

    await playActionCard(page, "Education or Elimination", 4);
    await chooseChoiceOption(page, /Banish chosen damaged character/i);

    await expect(
      page.getByText(/Select the required target or player for\s+Education or Elimination/i),
    ).toBeVisible();
    await expect(cardByName(page, "Simba - Protective Cub")).toHaveClass(/card-face--valid-target/);
    await expect(cardByName(page, "Mickey Mouse - True Friend")).toHaveClass(
      /card-face--invalid-target/,
    );
  });

  test("MegaBot DESTROY choice advances into damaged-character visual targeting", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.megaBot, view: PLAYER_ONE_VIEW });

    await activateVisibleAbility(page, "MegaBot", "DESTROY!");
    await chooseChoiceOption(page, /Banish chosen damaged character/i);

    await expect(
      page.getByText(/Select the required target or player for\s+MegaBot/i),
    ).toBeVisible();
    await expect(cardByName(page, "Simba - Protective Cub")).toHaveClass(/card-face--valid-target/);
  });

  test("The Black Cauldron exposes Mufasa from under the item as playable", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.blackCauldron, view: PLAYER_ONE_VIEW });

    await activateVisibleAbility(page, "The Black Cauldron", "RISE AND JOIN ME!");

    await expect(cardByName(page, "Mufasa - Ruler of Pride Rock")).toHaveClass(
      /card-face--playable/,
    );
  });

  test("Luisa can visually select an undamaged friendly source before moving her damage", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.luisa, view: PLAYER_ONE_VIEW });

    await activateVisibleAbility(page, "Luisa Madrigal - Confident Climber", "I CAN TAKE IT");

    await expect(
      page.getByText(
        /Select the required target or player for\s+Luisa Madrigal - Confident Climber/i,
      ),
    ).toBeVisible();
    await expect(cardByName(page, "Simba - Protective Cub")).toHaveClass(/card-face--valid-target/);
    await expect(cardByName(page, "Mickey Mouse - True Friend")).toHaveClass(
      /card-face--invalid-target/,
    );
  });

  test("Cheshire Cat can visually move only one damage from an up-to-2 ability", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: FIXTURES.cheshireCat, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const cheshireCatId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Cheshire Cat - Inexplicable",
    );
    const liloId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Lilo - Making a Wish");
    const mickeyId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Mickey Mouse - True Friend");

    expect(await getCardDamage(pom, PLAYER_ONE_ID, "Lilo - Making a Wish")).toBe(2);
    expect(await getCardDamage(pom, PLAYER_TWO_ID, "Mickey Mouse - True Friend")).toBe(0);

    const boostResult = await pom.execute(PLAYER_ONE_VIEW, "activateAbility", {
      cardId: cheshireCatId,
      abilityIndex: 0,
      preventAutoResolveTriggeredEffects: true,
    });
    expect(boostResult.success, boostResult.reason).toBe(true);

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    await expect(guidance).toContainText(/Choose up to 2 targets/i);

    await page.locator(`[data-card-id="${liloId}"][data-zone-id="play"]`).last().click({
      force: true,
    });
    await expect(guidance).toContainText("Lilo - Making a Wish");

    const amountInput = guidance.getByRole("spinbutton");
    const amountSlider = guidance.getByRole("slider");
    await expect(amountInput).toHaveValue("2");
    await expect(amountSlider).toHaveAttribute("max", "2");

    await amountInput.fill("1");
    await expect(amountInput).toHaveValue("1");

    await page.locator(`[data-card-id="${mickeyId}"][data-zone-id="play"]`).last().click({
      force: true,
    });
    await expect(guidance).toContainText("Mickey Mouse - True Friend");

    await guidance.getByRole("button", { name: /^Confirm \(2\/2\)$/ }).click();

    await expect.poll(() => getCardDamage(pom, PLAYER_ONE_ID, "Lilo - Making a Wish")).toBe(1);
    await expect
      .poll(() => getCardDamage(pom, PLAYER_TWO_ID, "Mickey Mouse - True Friend"))
      .toBe(1);
  });
});
