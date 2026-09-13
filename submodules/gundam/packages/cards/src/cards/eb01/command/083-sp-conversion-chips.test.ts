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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { eb01SpConversionChips083 } from "./083-sp-conversion-chips.ts";

describe("SP Conversion Chips (EB01-083)", () => {
  it("grants AP+3 to the chosen Unit during the opponent's turn", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [eb01SpConversionChips083],
        play: [createMockUnit({ ap: 2 })],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 2 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(eb01SpConversionChips083));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
  });

  it("cannot be played during its controller's Action window", () => {
    const engine = GundamTestEngine.create({
      hand: [eb01SpConversionChips083],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(eb01SpConversionChips083), "PRECONDITION_FAILED");
    expect(p1.getCardZone(eb01SpConversionChips083)).toBe(`hand:${PLAYER_ONE}`);
  });
});
