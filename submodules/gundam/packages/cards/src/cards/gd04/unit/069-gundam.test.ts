import { describe, it, expect } from "vite-plus/test";
import type { UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd04LoranCehack097 } from "../pilot/097-loran-cehack.ts";
import { gd04Gundam069 } from "./069-gundam.ts";

describe("∀ Gundam (GD04-069)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04Gundam069.keywordEffects.map((effect) => effect.keyword)).toEqual(["Blocker"]);
  });

  it("sets a friendly Militia Unit active after paying for another Militia Unit effect while linked", () => {
    const restedMilitia = createMockUnit({ traits: ["militia"] });
    const payer: UnitCard = createMockUnit({
      traits: ["militia"],
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { payResources: 1 },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "【Activate･Main】①：Draw 1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [gd04LoranCehack097],
      play: [gd04Gundam069, { card: restedMilitia, exhausted: true }, payer],
      resourceArea: activeResources(6),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [turnAId, restedMilitiaId, payerId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd04LoranCehack097, turnAId!));
    expectSuccess(p1.activateAbility(payerId!, 0));

    expect(isCardExhausted(engine, restedMilitiaId!)).toBe(false);
  });
});
