import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamAstrayRedFrameCustomEx001 } from "./001-gundam-astray-red-frame-custom-ex.ts";

describe("Gundam Astray Red Frame Custom (EX) (EB01-001)", () => {
  it("【Activate･Main】 exiles two Commands, rests an eligible damaged enemy, and prevents its next ready", () => {
    const commands = [createMockCommand(), createMockCommand()];
    const eligible = createMockUnit({ level: 7, hp: 5 });
    const tooHigh = createMockUnit({ level: 8, hp: 5 });
    const healthy = createMockUnit({ level: 7, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [eb01GundamAstrayRedFrameCustomEx001],
        trash: commands,
        resourceArea: activeResources(1),
        deck: 3,
      },
      {
        play: [{ card: eligible, damage: 1 }, { card: tooHigh, damage: 1 }, healthy],
        resourceArea: activeResources(1),
        deck: 3,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const commandIds = p1.getCardsInZone("trash");
    const [eligibleId, tooHighId, healthyId] = p2.getCardsInZone("battleArea");

    expect(
      p1.getMoveProcedure("activateAbility", { cardId: sourceId, effectIndex: 0 }),
    ).toContainEqual({
      kind: "selectTarget",
      role: "cost",
      candidateIds: commandIds,
      minTargets: 2,
      maxTargets: 2,
    });
    expectSuccess(p1.activateAbility(sourceId, 0, { targets: commandIds }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    for (const commandId of commandIds) expect(p1.getCardZone(commandId)).toBe("removalArea");
    expect(p2.isExhausted(eligibleId!)).toBe(true);
    expect(p2.isExhausted(tooHighId!)).toBe(false);
    expect(p2.isExhausted(healthyId!)).toBe(false);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p2.isExhausted(eligibleId!)).toBe(true);
  });

  it("cannot activate without two Command cards in trash to exile as the cost", () => {
    const engine = GundamTestEngine.create(
      {
        play: [eb01GundamAstrayRedFrameCustomEx001],
        trash: [createMockCommand()],
      },
      { play: [{ card: createMockUnit({ level: 7, hp: 5 }), damage: 1 }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.activateAbility(sourceId, 0), "COST_NOT_PAYABLE");
    expect(p1.getCardsInZone("trash")).toHaveLength(1);
    expect(p1.getCardsInZone("removalArea")).toHaveLength(0);
  });
});
