import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd04Trinity111 } from "./111-trinity.ts";

describe("Trinity (GD04-111)", () => {
  it("【Main】/【Action】gives 1 to 3 friendly CB Units AP+2 this turn", () => {
    const cbA = createMockUnit({ traits: ["cb"] });
    const cbB = createMockUnit({ traits: ["cb"] });
    const engine = GundamTestEngine.create({
      hand: [gd04Trinity111],
      play: [cbA, cbB],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [cbAId, cbBId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd04Trinity111, { targets: [cbAId!, cbBId!] }));

    expect(findStatModifier(engine, cbAId!, "ap")?.modifier).toBe(2);
    expect(findStatModifier(engine, cbBId!, "ap")?.modifier).toBe(2);
  });
});
