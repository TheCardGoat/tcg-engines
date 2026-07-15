import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03UnheraldedAttack121 } from "./121-unheralded-attack.ts";

describe("Unheralded Attack (GD03-121)", () => {
  it("【Action】 rests a friendly Base and an enemy Unit with 3 or less HP", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03UnheraldedAttack121],
        baseSection: [createMockBase()],
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [baseId, enemyId] }));

    expect(p1.isExhausted(baseId)).toBe(true);
    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("cannot target an enemy Unit with more than 3 HP", () => {
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03UnheraldedAttack121],
        baseSection: [createMockBase()],
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(commandId, { targets: [baseId, enemyId] }), "INVALID_TARGET");
  });

  it("can be played as Katz Kobayashi and visibly grants AP+1", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd03UnheraldedAttack121],
      play: [host],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });
});
