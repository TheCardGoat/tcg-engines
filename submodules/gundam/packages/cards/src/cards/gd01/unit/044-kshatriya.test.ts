import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd01Kshatriya044 } from "./044-kshatriya.ts";

describe("Kshatriya (GD01-044)", () => {
  it("data encodes Cyber-Newtype/Newtype pilot qualification and 1-to-2 enemy damage", () => {
    expect(gd01Kshatriya044.effects?.[0]?.activation.qualification).toEqual({
      attribute: "or",
      filters: [
        { attribute: "trait", comparison: "includes", value: "Cyber-Newtype" },
        { attribute: "trait", comparison: "includes", value: "Newtype" },
      ],
    });
    expect(gd01Kshatriya044.effects?.[0]?.directives[0]).toEqual({
      action: {
        action: "dealDamage",
        amount: 1,
        target: { owner: "opponent", cardType: "unit", count: { min: 1, max: 2 } },
      },
    });
  });

  it("deals 1 damage to up to two chosen enemy Units when paired with a Newtype pilot", () => {
    const marida = createMockPilot({ name: "Marida Cruz", traits: ["newtype"], cost: 1 });
    const enemy1 = createMockUnit({ hp: 5 });
    const enemy2 = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [marida],
        play: [gd01Kshatriya044],
        resourceArea: activeResources(5),
      },
      { play: [enemy1, enemy2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemy1Id, enemy2Id] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(marida, gd01Kshatriya044));
    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemy1Id!, enemy2Id!] }));
    }

    expect(getDamageCounter(engine, enemy1Id!)).toBe(1);
    expect(getDamageCounter(engine, enemy2Id!)).toBe(1);
  });
});
