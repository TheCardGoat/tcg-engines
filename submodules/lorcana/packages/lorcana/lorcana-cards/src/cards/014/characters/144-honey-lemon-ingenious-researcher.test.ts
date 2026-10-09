import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockCharacter,
  PLAYER_TWO,
  createMockAction,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { honeyLemonIngeniousResearcher } from "./144-honey-lemon-ingenious-researcher";
import { honeyLemonTestingTheLimits } from "./093-honey-lemon-testing-the-limits";

// CR 8.10.1–8.10.7 (Shift); 6.1.5.1 (if you do); 6.1.3 (choices at resolution).
const shiftBase = createMockCharacter({
  id: "hl-shift-base",
  name: "Honey Lemon",
  cost: 5,
  strength: 4,
  willpower: 6,
});

const discardItem = createMockItem({ id: "hl-item", name: "Chem Vial", cost: 2 });

describe("Honey Lemon - Ingenious Researcher", () => {
  it("Player Two shifts using four ink and one drop, retains state, then returns and spends the new drop", () => {
    const location = createMockLocation({ id: "honey-location", name: "Lab", cost: 1 });
    const purchase = createMockItem({ id: "honey-purchase", name: "Purchase", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [shiftBase], deck: 4 },
      {
        hand: [honeyLemonIngeniousResearcher, purchase, shiftBase],
        play: [location, { card: shiftBase, isDrying: false, damage: 2, atLocation: location }],
        inkwell: 4,
        inkDrops: 1,
        discard: [discardItem],
        deck: 4,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = g.findCardInstanceId(shiftBase, "play", PLAYER_TWO);
    for (const shiftTarget of [
      g.findCardInstanceId(shiftBase, "play", PLAYER_ONE),
      g.findCardInstanceId(shiftBase, "hand", PLAYER_TWO),
    ]) {
      expect(
        g.asPlayerTwo().playCard(honeyLemonIngeniousResearcher, {
          cost: { cost: "shift", shiftTarget },
          inkDrops: 1,
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(4);
    }
    expect(
      g.asPlayerTwo().playCard(honeyLemonIngeniousResearcher, {
        cost: { cost: "shift", shiftTarget: own },
        inkDrops: 1,
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toBeAtLocation({ card: honeyLemonIngeniousResearcher, location });
    expect(g.asPlayerTwo().getDamage(honeyLemonIngeniousResearcher)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerTwo().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [discardItem],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [discardItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getCardZone(discardItem)).toBe("hand");
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("another character does not trigger Synthesize and Player Two copies independently decline or return", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 4 },
      {
        play: [
          { card: honeyLemonIngeniousResearcher, isDrying: false },
          { card: honeyLemonIngeniousResearcher, isDrying: false },
          { card: shiftBase, isDrying: false },
        ],
        discard: [discardItem],
        deck: 4,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(shiftBase)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    if (!first || !second) throw new Error("Expected two Researcher copies");
    expect(g.asPlayerTwo().quest(first)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(first, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getCardZone(discardItem)).toBe("discard");
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerTwo().quest(second)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(second, { resolveOptional: true, targets: [discardItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getCardZone(discardItem)).toBe("hand");
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("rejects in-play and hidden items without consuming the return or awarding a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discardItem],
      play: [{ card: honeyLemonIngeniousResearcher, isDrying: false }, discardItem],
      discard: [discardItem],
    });
    expect(g.asPlayerOne().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    for (const zone of ["play", "hand"] as const) {
      const target = g.findCardInstanceId(discardItem, zone, PLAYER_ONE);
      expect(
        g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
          resolveOptional: true,
          targets: [target],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    }
    const target = g.findCardInstanceId(discardItem, "discard", PLAYER_ONE);
    expect(
      g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [target],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getCardZone(target)).toBe("hand");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("Player Two independent copies finish without an eligible own item", () => {
    const action = createMockAction({ id: "honey-action", name: "Action", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [discardItem], deck: 4 },
      {
        play: [
          { card: honeyLemonIngeniousResearcher, isDrying: false },
          { card: honeyLemonIngeniousResearcher, isDrying: false },
        ],
        discard: [action, shiftBase],
        inkDrops: 2,
        deck: 4,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const id of g.getCardInstanceIdsInZone("play", PLAYER_TWO)) {
      expect(g.asPlayerTwo().quest(id)).toBeSuccessfulCommand();
      if (g.asPlayerTwo().getBagCount() > 0)
        expect(
          g.asPlayerTwo().resolvePendingByCard(id, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerTwo().getBagCount()).toBe(0);
    }
    expect(g.asServer().getCardZone(discardItem)).toBe("discard");
  });

  for (const inkwell of [4, 5]) {
    it(`rejects an illegal Shift with ${inkwell} ink without spending resources`, () => {
      const wrongName = createMockCharacter({ id: "honey-wrong-name", name: "Baymax", cost: 3 });
      const target = inkwell === 4 ? shiftBase : wrongName;
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [honeyLemonIngeniousResearcher],
        inkwell,
        play: [{ card: target, isDrying: false }],
      });
      const shiftTarget = g.findCardInstanceId(target, "play", PLAYER_ONE);
      expect(
        g
          .asPlayerOne()
          .playCard(honeyLemonIngeniousResearcher, { cost: { cost: "shift", shiftTarget } }),
      ).not.toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(inkwell);
      expect(g.asPlayerOne().getCardZone(honeyLemonIngeniousResearcher)).toBe("hand");
      expect(g.asPlayerOne().getCardZone(target)).toBe("play");
    });
  }
  for (const isDrying of [false, true]) {
    for (const exerted of [false, true]) {
      it(`Shift pays five and inherits drying ${isDrying}, exerted ${exerted}, and damage`, () => {
        const g = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [honeyLemonIngeniousResearcher],
          inkwell: 5,
          play: [{ card: shiftBase, isDrying, exerted, damage: 2 }],
          discard: [discardItem],
        });
        const shiftTarget = g.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
        expect(
          g
            .asPlayerOne()
            .playCard(honeyLemonIngeniousResearcher, { cost: { cost: "shift", shiftTarget } }),
        ).toBeSuccessfulCommand();
        expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
        expect(g.asPlayerOne().getDamage(honeyLemonIngeniousResearcher)).toBe(2);
        expect(g.isExerted(honeyLemonIngeniousResearcher)).toBe(exerted);
        const result = g.asPlayerOne().quest(honeyLemonIngeniousResearcher);
        if (isDrying || exerted) {
          expect(result).not.toBeSuccessfulCommand();
          expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
        } else {
          expect(result).toBeSuccessfulCommand();
          expect(g.getLore(PLAYER_ONE)).toBe(2);
          expect(
            g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
              resolveOptional: true,
              targets: [discardItem],
            }),
          ).toBeSuccessfulCommand();
          expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
        }
      });
    }
  }
  it("normal play costs seven and does not return an item or grant a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [honeyLemonIngeniousResearcher],
      inkwell: 7,
      discard: [discardItem],
    });
    expect(g.asPlayerOne().playCard(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(discardItem)).toBe("discard");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().quest(honeyLemonIngeniousResearcher)).not.toBeSuccessfulCommand();
  });
  it("does not gain a drop when there is no item in the controller's discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: honeyLemonIngeniousResearcher, isDrying: false }], discard: [shiftBase] },
      { discard: [discardItem] },
    );
    expect(g.asPlayerOne().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    if (g.asPlayerOne().getBagCount() > 0) {
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(honeyLemonIngeniousResearcher, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
    }
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().getCardZone(discardItem)).toBe("discard");
  });
  it("returns only an exact own discarded item and can earn another drop next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: honeyLemonIngeniousResearcher, isDrying: false }],
        discard: [discardItem, discardItem, shiftBase],
        deck: 6,
      },
      { discard: [discardItem], deck: 6 },
    );
    const own = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
    const enemy = g.getCardInstanceIdsInZone("discard", PLAYER_TWO)[0]!;
    expect(g.asPlayerOne().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [enemy],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [own[2]!],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [own[1]!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(own[1]!)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(own[0]!)).toBe("discard");
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [own[0]!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
  });
  it("on quest, returning an item from discard to hand grants an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [honeyLemonIngeniousResearcher],
        inkwell: 10,
        play: [honeyLemonTestingTheLimits],
        discard: [discardItem],
      },
      {},
    );

    // Shift onto the base so she can quest this turn.
    const shiftTarget = testEngine.findCardInstanceId(
      honeyLemonTestingTheLimits,
      "play",
      PLAYER_ONE,
    );
    expect(
      testEngine.asPlayerOne().playCard(honeyLemonIngeniousResearcher, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: true,
        targets: [discardItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardItem)).toBe("hand");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("declining the return grants no ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [honeyLemonIngeniousResearcher],
        inkwell: 10,
        play: [honeyLemonTestingTheLimits],
        discard: [discardItem],
      },
      {},
    );

    const shiftTarget = testEngine.findCardInstanceId(
      honeyLemonTestingTheLimits,
      "play",
      PLAYER_ONE,
    );
    expect(
      testEngine.asPlayerOne().playCard(honeyLemonIngeniousResearcher, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(honeyLemonIngeniousResearcher)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(honeyLemonIngeniousResearcher, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardItem)).toBe("discard");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
