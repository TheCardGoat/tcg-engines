import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  hasGrantAttackTargetOption,
} from "@tcg/gundam-engine";
import { st06OrtegaSRickDomGq007 } from "./007-ortega-s-rick-dom-gq.ts";

describe("Ortega's Rick Dom (GQ) (ST06-007)", () => {
  it("【Deploy】grants another friendly (Clan) Unit the option to attack an active enemy Unit with AP ≤ 3", () => {
    const clanTarget = createMockUnit({ ap: 2, hp: 3, traits: ["clan"] });
    const enemyUnit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [st06OrtegaSRickDomGq007],
        play: [clanTarget],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(st06OrtegaSRickDomGq007, { targets: [targetId] }));

    expect(hasGrantAttackTargetOption(engine, targetId)).toBe(true);
  });
});
