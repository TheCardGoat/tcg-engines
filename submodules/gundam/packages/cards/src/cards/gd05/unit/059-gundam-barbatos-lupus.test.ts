import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05GundamBarbatosLupus059 } from "./059-gundam-barbatos-lupus.ts";

describe("Gundam Barbatos Lupus (GD05-059)", () => {
  /** @behavioral-proof complete: Attack timing, active friendly Gjallarhorn filter, rest-dependent draw, High-Maneuver result, and this-turn expiry are public. */
  it("【Attack】 rests an active Gjallarhorn Unit, draws 1, and gains High-Maneuver", () => {
    const payer = createMockUnit({ traits: ["gjallarhorn"] });
    const wrongTrait = createMockUnit({ traits: ["tekkadan"] });
    const engine = GundamTestEngine.create({
      play: [gd05GundamBarbatosLupus059, payer, wrongTrait],
      deck: [createMockUnit({ name: "Remaining Card" }), createMockUnit({ name: "Drawn Card" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, payerId, wrongTraitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sourceId!, "direct"));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [payerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [payerId!] }));

    expect(p1.isExhausted(payerId!)).toBe(true);
    expect(p1.isExhausted(wrongTraitId!)).toBe(false);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
    expect(p1.getVisibleCard(sourceId!)?.keywords).toContain("HighManeuver");
  });

  it("removes its Attack-granted High-Maneuver when the turn ends", () => {
    const payer = createMockUnit({ traits: ["gjallarhorn"] });
    const engine = GundamTestEngine.create(
      {
        play: [gd05GundamBarbatosLupus059, payer],
        deck: [createMockUnit({ name: "Remaining Card" }), createMockUnit({ name: "Drawn Card" })],
      },
      {
        shieldArea: [
          createMockUnit({ name: "First enemy shield" }),
          createMockUnit({ name: "Second enemy shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, payerId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sourceId!, "direct"));
    expectSuccess(p1.resolveEffect({ targets: [payerId!] }));
    expect(p1.getVisibleCard(sourceId!)?.keywords).toContain("HighManeuver");
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getVisibleCard(sourceId!)?.keywords).not.toContain("HighManeuver");
  });
});
