import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03JachinDue127 } from "../base/127-jachin-due.ts";
import { gd03RauLeCreuset091 } from "./091-rau-le-creuset.ts";

describe("Rau Le Creuset (GD03-091)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03RauLeCreuset091] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03RauLeCreuset091)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Linked】 offers only a ZAFT Base in trash and adds the chosen Base to hand", () => {
    const linkHost = createMockUnit({ linkCondition: "[Rau Le Creuset]" });
    const wrongBase = createMockBase({ name: "Zeon Base", traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd03RauLeCreuset091],
      play: [linkHost],
      trash: [wrongBase, gd03JachinDue127],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [wrongBaseId, zaftBaseId] = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(gd03RauLeCreuset091, hostId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [zaftBaseId],
    });
    expectSuccess(p1.resolveEffect({ targets: [zaftBaseId!] }));

    expect(p1.getCardsInZone("hand")).toContain(zaftBaseId);
    expect(p1.getCardsInZone("trash")).toEqual([wrongBaseId]);
  });

  it("does not retrieve a ZAFT Base when Rau's paired Unit is not linked", () => {
    const host = createMockUnit({ linkCondition: "[Athrun Zala]" });
    const engine = GundamTestEngine.create({
      hand: [gd03RauLeCreuset091],
      play: [host],
      trash: [gd03JachinDue127],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(gd03RauLeCreuset091, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toContain(baseId);
  });
});
