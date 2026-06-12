import { describe, expect, it } from "bun:test";
import type { ActionCard, I18nProperties, Languages } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  johnSilverAlienPirate,
  simbaProtectiveCub,
  stealFromTheRich,
} from "@tcg/lorcana-cards/cards/001";
import { mauiHalfshark } from "@tcg/lorcana-cards/cards/006";
import { donKarnageAirPirateLeader } from "@tcg/lorcana-cards/cards/008";

function createCardI18n(
  name: string,
  overrides: Partial<Record<Languages, I18nProperties>> = {},
): Record<Languages, I18nProperties> {
  const english = overrides.en ?? { name };

  return {
    en: english,
    de: overrides.de ?? english,
    fr: overrides.fr ?? english,
    it: overrides.it ?? english,
  };
}

function createMockActionCard(params: {
  id: string;
  name: string;
  cost: number;
  text: string;
  abilities: ActionCard["abilities"];
}): ActionCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "action",
    name: params.name,
    cost: params.cost,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    text: params.text,
    abilities: params.abilities,
    i18n: createCardI18n(params.name, {
      en: {
        name: params.name,
        text: params.text,
      },
    }),
    cardNumber: 778,
  };
}

const quester = createMockCharacter({
  id: "auto-resolve-quester",
  name: "Auto Resolve Quester",
  cost: 2,
  lore: 1,
});

const optionalQuestWatcher = createMockCharacter({
  id: "optional-quest-watcher",
  name: "Optional Quest Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "optional-quest-watcher-1",
      name: "Optional Quest Watcher",
      text: "Whenever one of your characters quests, you may gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
        type: "optional",
      },
    },
  ],
});

const opponentActionWatcher = createMockCharacter({
  id: "opponent-action-watcher",
  name: "Opponent Action Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "opponent-action-watcher-1",
      name: "Opponent Action Watcher",
      text: "Whenever an opponent plays an action, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "opponent",
        },
        timing: "whenever",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const optionalAction = createMockActionCard({
  id: "optional-action",
  name: "Optional Action",
  cost: 1,
  text: "You may gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
        type: "optional",
      },
    },
  ],
});

const impossibleTargetWatcher = createMockCharacter({
  id: "impossible-target-watcher",
  name: "Impossible Target Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "impossible-target-watcher-1",
      name: "Impossible Target Watcher",
      text: "Whenever one of your characters quests, chosen opposing character gets Reckless this turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

describe("LorcanaEngineBase bag auto-resolution", () => {
  it("auto-resolves a single mandatory no-target triggered bag effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark, quester],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("keeps the triggered bag effect manual when action auto-resolution is explicitly disabled", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(stealFromTheRich, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("preserves suppression through suspended action resolution", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [optionalAction],
      inkwell: optionalAction.cost,
      play: [mauiHalfshark],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(optionalAction, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("does not auto-resolve when multiple same-player mandatory no-target bag effects are pending", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark, mauiHalfshark],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("keeps mandatory targeted triggers manual", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [johnSilverAlienPirate],
        inkwell: johnSilverAlienPirate.cost,
        deck: 2,
      },
      {
        play: [simbaProtectiveCub],
        deck: 2,
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(johnSilverAlienPirate)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [simbaId],
        }),
    ).toBeSuccessfulCommand();
  });

  it("auto-resolves a single mandatory targeted bag effect when no legal targets exist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: quester, isDrying: false }, impossibleTargetWatcher],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    // No opposing characters — effect fizzles; no bag row and no pending target picker.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects().length).toBe(0);
  });

  it("keeps optional no-target triggers manual", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [quester, optionalQuestWatcher],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);
  });

  it("auto-resolves a remaining deterministic bag effect after a manual bag resolution", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        play: [mauiHalfshark, donKarnageAirPirateLeader],
        deck: 2,
      },
      {
        play: [simbaProtectiveCub],
        deck: 2,
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    const donBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find(
        (bagEffect) =>
          bagEffect.sourceId ===
          testEngine.findCardInstanceId(donKarnageAirPirateLeader, "play", PLAYER_ONE),
      );
    expect(donBag).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donBag!.sourceId, {
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not auto-resolve bag effects controlled by another player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        deck: 2,
      },
      {
        play: [opponentActionWatcher],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);

    expect(
      testEngine
        .asPlayerTwo()
        .resolvePendingByCard(testEngine.asPlayerTwo().getBagEffects()[0]!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);
  });
});
