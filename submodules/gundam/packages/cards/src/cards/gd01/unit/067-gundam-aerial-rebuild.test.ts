import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamAerialRebuild067 } from "./067-gundam-aerial-rebuild.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Aerial Rebuild (GD01-067)", () => {
  it("offers a Lv.5-or-lower Command from trash after pairing and can attack as a Link Unit", () => {
    const suletta = createMockPilot({ name: "Suletta Mercury", level: 1, cost: 1 });
    const eligible = createMockCommand({ name: "Eligible Command", level: 5 });
    const tooHigh = createMockCommand({ name: "Too High", level: 6 });
    const wrongType = createMockUnit({ level: 4 });
    const enemy = createMockUnit({ hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GundamAerialRebuild067, suletta],
        deck: 2,
        trash: [eligible, tooHigh, wrongType],
        resourceArea: activeResources(6),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId] = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01GundamAerialRebuild067));
    const aerialId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(suletta, aerialId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_ONE}`);
    expectSuccess(p1.enterBattle(aerialId, enemyId));
  });

  it("does not open a prompt when trash has no eligible Command", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const tooHigh = createMockCommand({ level: 6 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [gd01GundamAerialRebuild067],
      trash: [tooHigh, createMockUnit({ level: 4 })],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const aerialId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, aerialId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toHaveLength(2);
  });
});
