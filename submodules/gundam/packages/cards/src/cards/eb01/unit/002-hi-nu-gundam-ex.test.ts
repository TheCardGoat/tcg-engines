import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01HiNuGundamEx002 } from "./002-hi-nu-gundam-ex.ts";

describe("Hi-Nu Gundam (EX) (EB01-002)", () => {
  it("【Deploy】 with another G Generation Unit rests exactly one chosen enemy Unit", () => {
    const companion = createMockUnit({ traits: ["g generation"] });
    const first = createMockUnit();
    const second = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [eb01HiNuGundamEx002],
        play: [companion],
        resourceArea: activeResources(8),
      },
      { play: [first, second] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstId, secondId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(eb01HiNuGundamEx002));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstId, secondId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

    expect(p2.isExhausted(firstId!)).toBe(false);
    expect(p2.isExhausted(secondId!)).toBe(true);
  });

  it("does not trigger without another friendly G Generation Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [eb01HiNuGundamEx002],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(eb01HiNuGundamEx002));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【During Link】【Attack】readies itself only with three other rested Units", () => {
    const linkPilot = createMockPilot({ traits: ["g generation"], cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [linkPilot],
      play: [
        eb01HiNuGundamEx002,
        { card: createMockUnit(), exhausted: true },
        { card: createMockUnit(), exhausted: true },
        { card: createMockUnit(), exhausted: true },
      ],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hiNuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(linkPilot, hiNuId));
    expectSuccess(p1.enterBattle(hiNuId, "direct"));

    expect(p1.isExhausted(hiNuId)).toBe(false);
  });
});
