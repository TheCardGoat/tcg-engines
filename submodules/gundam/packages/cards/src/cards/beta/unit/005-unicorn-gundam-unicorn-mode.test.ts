import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaUnicornGundamUnicornMode005 } from "./005-unicorn-gundam-unicorn-mode.ts";

function destroyUnicornAfterPairing(pilotName: string) {
  const pilot = createMockPilot({ name: pilotName, level: 1, cost: 1 });
  const keep = createMockUnit({ name: "Keep" });
  const discard = createMockUnit({ name: "Discard" });
  const attacker = createMockUnit({ ap: 5, hp: 10 });
  const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
  const engine = GundamTestEngine.create(
    {
      hand: [pilot, keep, discard],
      play: [betaUnicornGundamUnicornMode005],
      resourceArea: activeResources(5),
      deck: 5,
    },
    { play: [attacker, { card: transitionDefender, exhausted: true }], deck: 5 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const unitId = p1.getCardsInZone("battleArea")[0]!;
  const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");
  const [pilotId, keepId, discardId] = p1.getHand();

  expectSuccess(p1.assignPilot(pilot, unitId));
  expectSuccess(p1.enterBattle(unitId, transitionDefenderId!));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.enterBattle(attackerId!, unitId));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());

  return { engine, unitId, pilotId: pilotId!, keepId: keepId!, discardId: discardId! };
}

describe("Unicorn Gundam (Unicorn Mode) (GD01-005 Beta printing)", () => {
  it("returns its linked Pilot before asking which visible hand card to discard", () => {
    const { engine, unitId, pilotId, keepId, discardId } =
      destroyUnicornAfterPairing("Banagher Links");
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([pilotId, keepId, discardId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [discardId] }));

    expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(pilotId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(keepId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("trashes a non-link Pilot without opening a discard choice", () => {
    const { engine, pilotId, keepId, discardId } = destroyUnicornAfterPairing("Wrong Pilot");
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(keepId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(discardId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
