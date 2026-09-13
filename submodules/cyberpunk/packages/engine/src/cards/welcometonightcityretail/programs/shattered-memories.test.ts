import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailShatteredMemories,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const memories = welcomeToNightCityRetailShatteredMemories;

describe("Shattered Memories", () => {
  it("is a red Braindance program", () => {
    expect(memories).toMatchObject({
      type: "program",
      color: "red",
      classifications: ["Braindance"],
      cost: 4,
      printNumber: "035",
    });
  });

  it("makes each player discard their hand and then choose whether to draw 5", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [memories, welcomeToNightCityRetailCorpoSecurity],
        deck: Array.from({ length: 20 }, () => welcomeToNightCityRetailFieldOperator),
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        hand: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      },
    );

    engine.playCard(memories, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);

    const first = engine.getState().G.turnMetadata.pendingChoice;
    expect(first?.type).toBe("chooseEffect");
    engine.resolveChooseEffect("draw", { as: first?.chooserId === P2 ? P2 : P1 });
    const second = engine.getState().G.turnMetadata.pendingChoice;
    if (second?.type === "chooseEffect") {
      engine.resolveChooseEffect("skip", { as: second.chooserId });
    }

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      memories.id,
    );
  });

  it("draws 2 extra when the discarded total equals a friendly Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [memories, welcomeToNightCityRetailCorpoSecurity],
        deck: Array.from({ length: 20 }, () => welcomeToNightCityRetailFieldOperator),
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        hand: [welcomeToNightCityRetailFieldOperator],
      },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(memories, { as: P1 });
    let guard = 0;
    while (engine.getState().G.turnMetadata.pendingChoice && guard < 4) {
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (choice?.type !== "chooseEffect") break;
      engine.resolveChooseEffect("skip", { as: choice.chooserId });
      guard += 1;
    }

    expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 2);
  });
});
