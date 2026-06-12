import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GundamKimaris070 } from "./070-gundam-kimaris.ts";

describe("Gundam Kimaris (GD02-070)", () => {
  it("data gates deploy draw/discard on 4+ Gjallarhorn cards in trash", () => {
    expect(gd02GundamKimaris070.effects?.[0]?.activation.conditions).toEqual([
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        comparison: "gte",
        count: 4,
        hasTrait: "gjallarhorn",
      },
    ]);
  });

  it("draws 2 on deploy when there are 4 Gjallarhorn cards in trash", () => {
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const engine = GundamTestEngine.create({
      hand: [gd02GundamKimaris070, createMockUnit(), createMockUnit()],
      trash,
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.deployUnit(gd02GundamKimaris070));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 2);
  });
});
