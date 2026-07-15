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
import { st04AthrunZala011 } from "../../st04/pilot/011-athrun-zala.ts";
import { gd01JusticeGundam066 } from "./066-justice-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Justice Gundam (GD01-066)", () => {
  it("deploys the visible Fatum-00 Blocker and lets the chosen token attack this turn", () => {
    const defender = createMockUnit({ ap: 1, hp: 12 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01JusticeGundam066, st04AthrunZala011],
        deck: 2,
        resourceArea: activeResources(7),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01JusticeGundam066));
    const [justiceId, tokenId] = p1.getCardsInZone("battleArea");
    expect(p1.getVisibleCard(tokenId!)).toMatchObject({
      effectiveAp: 2,
      effectiveHp: 2,
    });
    expect(p1.getVisibleCard(tokenId!)?.keywords).toContain("Blocker");
    expectFailure(p1.enterBattle(tokenId!, defenderId), "CANNOT_ATTACK");

    expectSuccess(p1.assignPilot(st04AthrunZala011, justiceId!));
    expectSuccess(p1.enterBattle(justiceId!, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [tokenId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [tokenId!] }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.enterBattle(tokenId!, defenderId));
  });

  it("lets Fatum-00 use its visible Blocker keyword on the opponent's turn", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01JusticeGundam066],
        resourceArea: activeResources(7),
        deck: 5,
      },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01JusticeGundam066));
    const [, tokenId] = p1.getCardsInZone("battleArea");
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(tokenId!));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(tokenId);
    expect(p1.isExhausted(tokenId!)).toBe(true);
  });

  it("does not offer token attack permission when Justice attacks unpaired", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd01JusticeGundam066],
        resourceArea: activeResources(7),
        deck: 5,
      },
      {
        deck: 5,
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01JusticeGundam066));
    const [justiceId, tokenId] = p1.getCardsInZone("battleArea");
    expect(p1.getVisibleCard(tokenId!)).toBeDefined();
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(justiceId!, "direct"));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
