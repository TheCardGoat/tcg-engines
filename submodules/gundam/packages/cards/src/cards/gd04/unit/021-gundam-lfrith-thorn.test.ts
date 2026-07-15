import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "../command/106-indiscriminate-violence.ts";
import { gd04GundamLfrithThorn021 } from "./021-gundam-lfrith-thorn.ts";

describe("Gundam Lfrith Thorn (GD04-021)", () => {
  it("<Breach 3> deals 3 damage to the enemy Base after destroying a Unit in battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamLfrithThorn021] },
      { play: [{ card: defender, exhausted: true }], baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const thornId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(thornId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(baseId)).toBe(3);
  });

  it("may pair the EX-paid Dawn of Fold Command from trash with a Gundam Lfrith Unit", () => {
    const resources = [
      ...activeResources(4).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false, isToken: true },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithThorn021],
      resourceArea: resources,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const thornId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [thornId] }));
    expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice?.kind).toBe("targetSelection");
    expectSuccess(p1.resolveEffect({ targets: [thornId] }));

    expect(p1.getPilotId(thornId)).toBe(commandId);
    expect(p1.getCardsInZone("battleArea")).toContain(commandId);
  });

  it("does not pair the Command when it was not paid with an EX Resource", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithThorn021],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const thornId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [thornId] }));

    expect(p1.getPilotId(thornId)).toBeUndefined();
  });

  it("allows the player to leave the EX-paid Command in trash instead of pairing it", () => {
    const resources = [
      ...activeResources(4).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false, isToken: true },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithThorn021],
      resourceArea: resources,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const thornId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [thornId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getPilotId(thornId)).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toContain(commandId);
  });
});
