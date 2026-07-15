import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockResource,
  expectSuccess,
} from "../../index.ts";

const placeRestedResource: CardEffect = {
  type: "command",
  activation: { timing: ["main"] },
  directives: [{ action: { action: "placeResource", state: "rested" } }],
  sourceText: "【Main】Place 1 rested Resource.",
};

describe("placeResource", () => {
  it("places the top Resource from the resource deck rested and trashes the Command", () => {
    const command = createMockCommand({
      name: "Resource Placement",
      level: 0,
      cost: 0,
      effects: [placeRestedResource],
    });
    const engine = GundamTestEngine.create({
      hand: [command],
      resourceArea: activeResources(1),
      resourceDeck: [createMockResource()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourceDeckBefore = p1.getBoardView().players[PLAYER_ONE]?.resourceDeckCount ?? 0;

    expectSuccess(p1.playCommand(command));

    expect(p1.getBoardView().players[PLAYER_ONE]?.resourceDeckCount).toBe(resourceDeckBefore - 1);
    expect(p1.getCardsInZone("resourceArea")).toHaveLength(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.resourceArea).toEqual([
      expect.objectContaining({ exhausted: false }),
      expect.objectContaining({ exhausted: true }),
    ]);
    expect(p1.getCardZone(command)).toBe(`trash:${PLAYER_ONE}`);
  });
});
