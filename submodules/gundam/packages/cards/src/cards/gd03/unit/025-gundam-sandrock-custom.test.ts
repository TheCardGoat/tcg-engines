import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamSandrockCustom025 } from "./025-gundam-sandrock-custom.ts";

describe("Gundam Sandrock Custom (GD03-025)", () => {
  function setup({ maganacRested = true }: { maganacRested?: boolean } = {}) {
    const maganac = createMockUnit({ name: "Maganac", traits: ["maganac corps"], hp: 5 });
    const otherTarget = createMockUnit({ name: "Other Target", hp: 5 });
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [
          gd03GundamSandrockCustom025,
          { card: maganac, exhausted: maganacRested },
          { card: otherTarget, exhausted: true },
        ],
        resourceArea: activeResources(6),
      },
      { play: [attacker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, maganacId, otherTargetId] = p1.getCardsInZone("battleArea");
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);

    return {
      p2,
      maganacId: maganacId!,
      otherTargetId: otherTargetId!,
      attackerId,
    };
  }

  it("prevents enemy Units from attacking a different target while a rested Maganac Corps Unit is available", () => {
    const { p2, otherTargetId, attackerId } = setup();

    expectFailure(p2.enterBattle(attackerId, otherTargetId), "INVALID_TARGET");
  });

  it("prevents enemy Units from attacking directly while a rested Maganac Corps Unit is available", () => {
    const { p2, attackerId } = setup();

    expectFailure(p2.enterBattle(attackerId, "direct"), "INVALID_TARGET");
  });

  it("allows enemy Units to attack a rested Maganac Corps Unit", () => {
    const { p2, maganacId, attackerId } = setup();

    expectSuccess(p2.enterBattle(attackerId, maganacId));
  });

  it("does not restrict attacks when no rested Maganac Corps Unit is available", () => {
    const { p2, otherTargetId, attackerId } = setup({ maganacRested: false });

    expectSuccess(p2.enterBattle(attackerId, otherTargetId));
  });
});
