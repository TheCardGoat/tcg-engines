import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03GundamNt1FullArmor007 } from "../unit/007-gundam-nt-1-full-armor.ts";
import { gd03ChristinaMackenzie085 } from "./085-christina-mackenzie.ts";

describe("Christina Mackenzie (GD03-085)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03ChristinaMackenzie085] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03ChristinaMackenzie085)).toBe(`hand:${PLAYER_TWO}`);
  });

  it('pairs with a Unit whose longer name includes "Gundam NT-1" without resting a Resource', () => {
    const engine = GundamTestEngine.create({
      hand: [gd03ChristinaMackenzie085],
      play: [gd03GundamNt1FullArmor007],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03ChristinaMackenzie085, hostId));

    expect(p1.getPilotId(hostId)).toBeDefined();
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("resourceArea").every((id) => !p1.isExhausted(id))).toBe(true);
  });

  it("still requires 1 active Resource when paired with a differently named Unit", () => {
    const otherHost = createMockUnit({ name: "Gundam Ground Type" });
    const engine = GundamTestEngine.create({
      hand: [gd03ChristinaMackenzie085],
      play: [otherHost],
      resourceArea: restedResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.assignPilot(gd03ChristinaMackenzie085, hostId), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
