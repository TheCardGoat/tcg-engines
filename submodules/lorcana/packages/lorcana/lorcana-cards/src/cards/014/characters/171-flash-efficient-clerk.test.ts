import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mushusRocket } from "../../010/items/134-mushus-rocket";
import { rush } from "../../../helpers/abilities/rush";
import { flashEfficientClerk } from "./171-flash-efficient-clerk";

const rushAlly = createMockCharacter({
  id: "flash-rush-ally",
  name: "Rush Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [rush],
});

const plainAlly = createMockCharacter({
  id: "flash-plain-ally",
  name: "Plain Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const strongOpponent = createMockCharacter({
  id: "flash-strong-opponent",
  name: "Strong Opponent",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Flash - Efficient Clerk", () => {
  it("a prior this-turn Rush grant expires while suppressed and does not return after opposing removal", () => {
    const grant = createMockAction({
      id: "flash-expiring-grant",
      name: "Grant Rush",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "gain-keyword",
            keyword: "Rush",
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        },
      ],
    });
    const remove = createMockAction({
      id: "flash-expiry-remove",
      name: "Remove Flash",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [grant, flashEfficientClerk], play: [plainAlly], inkwell: 2, deck: 3 },
      { hand: [remove], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(grant, { targets: [plainAlly] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(true);
    expect(g.asPlayerOne().playCard(flashEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().playCard(remove, { targets: [flashEfficientClerk] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("discard");
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
  });

  it("rejects an unpaid play without spending ink or applying abilities", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [flashEfficientClerk],
      inkwell: 1,
    });
    expect(g.asPlayerOne().playCard(flashEfficientClerk)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("a Rush grant attempted while Flash is present does not appear after Flash leaves", () => {
    const removal = createMockAction({
      id: "flash-grant-remove",
      name: "Remove",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flashEfficientClerk, plainAlly],
      hand: [mushusRocket, removal],
      inkwell: mushusRocket.cost,
    });
    expect(g.asPlayerOne().playCard(mushusRocket)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
    expect(
      g.asPlayerOne().playCard(removal, { targets: [flashEfficientClerk] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
  });

  it("Rush granted before Flash enters returns when Flash leaves", () => {
    const removal = createMockAction({
      id: "flash-prior-remove",
      name: "Remove",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [plainAlly],
      hand: [mushusRocket, flashEfficientClerk, removal],
      inkwell: mushusRocket.cost + flashEfficientClerk.cost,
    });
    expect(g.asPlayerOne().playCard(mushusRocket)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(true);
    expect(g.asPlayerOne().playCard(flashEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
    expect(
      g.asPlayerOne().playCard(removal, { targets: [flashEfficientClerk] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(true);
  });

  it("ordinary Rush loss does not prevent a new grant from surviving the loss source", () => {
    const lossOnly = createMockCharacter({
      id: "flash-loss-control",
      name: "Loss Only",
      cost: 0,
      abilities: [
        {
          type: "static",
          effect: { type: "lose-keyword", keyword: "Rush", target: "ALL_CHARACTERS" },
        },
      ],
    });
    const removal = createMockAction({
      id: "flash-loss-remove",
      name: "Remove",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [lossOnly, plainAlly],
      hand: [mushusRocket, removal],
      inkwell: mushusRocket.cost,
    });
    expect(g.asPlayerOne().playCard(mushusRocket)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
    expect(g.asPlayerOne().playCard(removal, { targets: [lossOnly] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(true);
  });

  it("a remaining Flash still blocks Rush after the first copy leaves", () => {
    const removal = createMockAction({
      id: "flash-two-remove",
      name: "Remove",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flashEfficientClerk, flashEfficientClerk, rushAlly],
      hand: [removal, removal],
    });
    const [first, second] = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === flashEfficientClerk.id);
    const [firstRemoval, secondRemoval] = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(firstRemoval!, { targets: [first!] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(rushAlly, "Rush")).toBe(false);
    expect(
      g.asPlayerOne().playCard(secondRemoval!, { targets: [second!] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(rushAlly, "Rush")).toBe(true);
  });

  for (const amount of [1, 2, 3]) {
    it(`Resist reduces ${amount} effect damage to ${amount - 1}`, () => {
      const damage = createMockAction({
        id: `flash-damage-${amount}`,
        name: "Damage",
        cost: 0,
        abilities: [
          {
            type: "action",
            effect: {
              type: "deal-damage",
              amount,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flashEfficientClerk],
        hand: [damage],
      });
      expect(
        g.asPlayerOne().playCard(damage, { targets: [flashEfficientClerk] }),
      ).toBeSuccessfulCommand();
      if (amount < 3) {
        expect(g.asPlayerOne()).toHaveDamage({ card: flashEfficientClerk, value: amount - 1 });
        expect(g.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("play");
      } else {
        expect(g.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("discard");
      }
    });
  }

  it("printed Rush returns immediately when Flash leaves play", () => {
    const removeFlash = createMockAction({
      id: "flash-remove",
      name: "Remove Flash",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [flashEfficientClerk], hand: [rushAlly, removeFlash], inkwell: 2 },
      { play: [{ card: strongOpponent, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(rushAlly)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(rushAlly, "Rush")).toBe(false);
    expect(g.asPlayerOne().challenge(rushAlly, strongOpponent)).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().playCard(removeFlash, { targets: [flashEfficientClerk] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("discard");
    expect(g.asPlayerOne().hasKeyword(rushAlly, "Rush")).toBe(true);
    expect(g.asPlayerOne().challenge(rushAlly, strongOpponent)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveDamage({ card: strongOpponent, value: 2 });
  });

  it("normal play costs two and later quests for two lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flashEfficientClerk], inkwell: 2, deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(flashEfficientClerk)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().quest(flashEfficientClerk)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(flashEfficientClerk)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("Flash cannot be inked normally", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [flashEfficientClerk] });
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, flashEfficientClerk),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("the same Rocket effect grants Rush when Flash is absent", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [plainAlly],
      hand: [mushusRocket],
      inkwell: mushusRocket.cost,
      deck: 2,
    });
    expect(
      g.asPlayerOne().playCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(true);
  });

  it("without Flash the same fresh Rush character can challenge the exerted defender", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: plainAlly, exerted: true }], deck: 2 },
      { hand: [rushAlly], inkwell: 2, deck: 2 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(rushAlly)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().hasKeyword(rushAlly, "Rush")).toBe(true);
    expect(g.asPlayerTwo().challenge(rushAlly, plainAlly)).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: plainAlly, value: 2 });
  });

  it("has Resist +1 and reduces challenge damage by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: flashEfficientClerk, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: strongOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(strongOpponent, flashEfficientClerk),
    ).toBeSuccessfulCommand();

    // 2 damage dealt minus Resist +1 — without the Resist he would be banished.
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: flashEfficientClerk, value: 1 });
    expect(testEngine.asPlayerOne().getCardZone(flashEfficientClerk)).toBe("play");
  });

  it("all characters lose Rush, including ones already in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [flashEfficientClerk, rushAlly],
        deck: 1,
      },
      {
        play: [{ card: rushAlly, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(rushAlly, "Rush")).toBe(false);
    expect(testEngine.asPlayerTwo().hasKeyword(rushAlly, "Rush")).toBe(false);
  });

  it("a character played this turn loses Rush and cannot challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [flashEfficientClerk, { card: plainAlly, exerted: true }],
        deck: 1,
      },
      {
        hand: [rushAlly],
        inkwell: rushAlly.cost,
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(rushAlly)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().hasKeyword(rushAlly, "Rush")).toBe(false);
    expect(testEngine.asPlayerTwo().challenge(rushAlly, plainAlly)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(plainAlly)).toBe("play");
  });

  it("characters can't gain Rush while Flash is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flashEfficientClerk, plainAlly],
      hand: [mushusRocket],
      inkwell: mushusRocket.cost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().playCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mushusRocket, { targets: [plainAlly] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(plainAlly, "Rush")).toBe(false);
  });
});
