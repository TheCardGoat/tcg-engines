import { describe, expect, it } from "vite-plus/test";
import { expectDestroyedDrawsExactly } from "../../../test-helpers/unit-trigger-behavior-test-helpers.ts";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05WaldfeldSMurasame003 } from "./003-waldfeld-s-murasame.ts";

describe("Waldfeld (GD05-003)", () => {
  it("【Destroyed】 draws exactly 1 after enemy battle damage destroys it", () => {
    expectDestroyedDrawsExactly(gd05WaldfeldSMurasame003, 1, {
      requiredPilotTrait: "orb",
    });
  });

  it("does not draw when the only Pilot in play lacks the (Orb) trait", () => {
    const otherPilot = createMockPilot({ traits: ["newtype"] });
    const host = createMockUnit({ name: "Pilot Host", hp: 8 });
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 20, hp: 20 });
    const engine = GundamTestEngine.create(
      {
        hand: [otherPilot],
        play: [gd05WaldfeldSMurasame003, host],
        deck: 3,
        resourceArea: activeResources(1),
        shieldArea: [createMockUnit({ name: "Friendly Shield" })],
      },
      { play: [attacker], deck: 5, shieldArea: [createMockUnit({ name: "Enemy Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [murasameId, hostId] = p1.getCardsInZone("battleArea");
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(otherPilot, hostId!));
    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [murasameId!]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(attackerId, murasameId!));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(murasameId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });
});
