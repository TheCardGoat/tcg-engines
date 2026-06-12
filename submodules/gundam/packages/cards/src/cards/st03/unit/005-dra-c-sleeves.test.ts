import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { st03DraCSleeves005 } from "./005-dra-c-sleeves.ts";

describe("Dra-C (Sleeves) (ST03-005)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [st03DraCSleeves005] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(st03DraCSleeves005.type).toBe("unit");
    expect(st03DraCSleeves005.level).toBe(1);
    expect(st03DraCSleeves005.cost).toBe(1);
    expect(st03DraCSleeves005.ap).toBe(1);
    expect(st03DraCSleeves005.hp).toBe(2);
  });
});
