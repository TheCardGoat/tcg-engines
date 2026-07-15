import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03TowardsDestiny116 } from "./116-towards-destiny.ts";

describe("Towards Destiny (GD03-116)", () => {
  function setup(friendlyTraits = ["vagan"]) {
    const friendly = createMockUnit({ traits: friendlyTraits, hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03TowardsDestiny116],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    return {
      p1,
      p2,
      commandId: p1.getHand()[0]!,
      friendlyId: p1.getCardsInZone("battleArea")[0]!,
      enemyId: p2.getCardsInZone("battleArea")[0]!,
    };
  }

  it("【Main】 deals 2 damage to a friendly Vagan Unit and an enemy Unit", () => {
    const { p1, p2, commandId, friendlyId, enemyId } = setup();

    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId, enemyId] }));

    expect(p1.getDamage(friendlyId)).toBe(2);
    expect(p2.getDamage(enemyId)).toBe(2);
  });

  it("also works after players legally enter the Action Step", () => {
    const { p1, p2, commandId, friendlyId, enemyId } = setup();

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId, enemyId] }));

    expect(p1.getDamage(friendlyId)).toBe(2);
    expect(p2.getDamage(enemyId)).toBe(2);
  });

  it("cannot choose a non-Vagan friendly Unit", () => {
    const { p1, commandId, friendlyId, enemyId } = setup(["earth federation"]);

    expectFailure(p1.playCommand(commandId, { targets: [friendlyId, enemyId] }), "INVALID_TARGET");
  });
});
