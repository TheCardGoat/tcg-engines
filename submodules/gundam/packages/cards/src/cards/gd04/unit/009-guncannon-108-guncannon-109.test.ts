import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Guncannon108Guncannon109009 } from "./009-guncannon-108-guncannon-109.ts";

describe("Guncannon (108) & Guncannon (109) (GD04-009)", () => {
  it("【When Linked】 sets a chosen friendly (White Base Team) Unit (Lv.4+) as active", () => {
    const kai = createMockPilot({ name: "Kai Shiden", level: 4, cost: 1 });
    const otherWbt = createMockUnit({
      ap: 3,
      hp: 4,
      level: 5,
      traits: ["white base team"],
    });

    const engine = GundamTestEngine.create({
      hand: [kai],
      play: [gd04Guncannon108Guncannon109009, { card: otherWbt, exhausted: true }],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [guncannonId, otherWbtId] = p1.getCardsInZone("battleArea");

    expect(engine.getG().exhausted[otherWbtId!]).toBe(true);

    expectSuccess(p1.assignPilot(kai, guncannonId!));
    while (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [otherWbtId!] }));
    }

    expect(engine.getG().exhausted[otherWbtId!]).toBeFalsy();
  });
});
