import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Gundam035 } from "./035-gundam.ts";

describe("Ξ Gundam (GD04-035)", () => {
  function setup({ extraHand = 0 }: { extraHand?: number } = {}) {
    const chosen = createMockUnit({ name: "Chosen Mafty", traits: ["mafty"], ap: 3, hp: 5 });
    const otherMafty = createMockUnit({ name: "Other Mafty", traits: ["mafty"], ap: 3, hp: 5 });
    const defender = createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 });
    const deckCard = createMockUnit({ name: "Deck Card" });
    const handFillers = Array.from({ length: extraHand }, (_, index) =>
      createMockUnit({ name: `Hand Filler ${index + 1}` }),
    );
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Gundam035, ...handFillers],
        deck: [deckCard],
        play: [chosen, otherMafty],
        resourceArea: activeResources(6),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, otherMaftyId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    return {
      engine,
      p1,
      chosenId: chosenId!,
      otherMaftyId: otherMaftyId!,
      defenderId,
    };
  }

  it("draws after the chosen Mafty Unit destroys an enemy Unit with battle damage while hand is 3 or less", () => {
    const { engine, p1, chosenId, defenderId } = setup();

    expectSuccess(p1.deployUnit(gd04Gundam035, { targets: [chosenId] }));
    expect(p1.getHand()).toHaveLength(0);
    expectSuccess(engine.resolveCombat({ attackerId: chosenId, target: defenderId }));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when a different Mafty Unit destroys the enemy Unit", () => {
    const { engine, p1, chosenId, otherMaftyId, defenderId } = setup();

    expectSuccess(p1.deployUnit(gd04Gundam035, { targets: [chosenId] }));
    expectSuccess(engine.resolveCombat({ attackerId: otherMaftyId, target: defenderId }));

    expect(p1.getHand()).toHaveLength(0);
  });

  it("does not draw if you have more than 3 cards in hand when the chosen Unit destroys", () => {
    const { engine, p1, chosenId, defenderId } = setup({ extraHand: 4 });

    expectSuccess(p1.deployUnit(gd04Gundam035, { targets: [chosenId] }));
    expect(p1.getHand()).toHaveLength(4);
    expectSuccess(engine.resolveCombat({ attackerId: chosenId, target: defenderId }));

    expect(p1.getHand()).toHaveLength(4);
  });
});
