import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02GrazeRitterGroundType083 } from "./083-graze-ritter-ground-type.ts";

function destroyEnemyCommand() {
  return createMockCommand({
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "destroy",
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 enemy Unit. Destroy it.",
      },
    ],
  });
}

describe("Graze Ritter (Ground Type) (GD02-083)", () => {
  it("requires its printed Lv.3 and two active Resources to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02GrazeRitterGroundType083],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);

    expectFailure(lowP1.deployUnit(gd02GrazeRitterGroundType083), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02GrazeRitterGroundType083)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02GrazeRitterGroundType083],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(setup));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployUnit(gd02GrazeRitterGroundType083), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02GrazeRitterGroundType083)).toBe(`hand:${PLAYER_ONE}`);
  });

  describe("【Destroyed】If it is your opponent's turn, choose 1 of your (Gjallarhorn) Units. Set it as active.", () => {
    it("publishes only the friendly Gjallarhorn choice and sets it active on the opponent's turn", () => {
      const command = destroyEnemyCommand();
      const gjallarhornAlly = createMockUnit({ traits: ["gjallarhorn"], hp: 5 });
      const outsider = createMockUnit({ traits: ["teiwaz"], hp: 5 });
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const engine = GundamTestEngine.create(
        { hand: [command], shieldArea: [firstShield, secondShield], deck: 5 },
        { play: [gd02GrazeRitterGroundType083, gjallarhornAlly, outsider], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [grazeId, gjallarhornId, outsiderId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [gjallarhornId!, outsiderId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.playCommand(command));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([grazeId, gjallarhornId, outsiderId]),
      });
      expectSuccess(p1.resolveEffect({ targets: [grazeId!] }));
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [gjallarhornId],
      });
      expectSuccess(p2.resolveEffect({ targets: [gjallarhornId!] }));

      expect(p2.getCardZone(grazeId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.isExhausted(gjallarhornId!)).toBe(false);
      expect(p2.isExhausted(outsiderId!)).toBe(true);
    });

    it("does not set a Gjallarhorn Unit active when destroyed during its controller's turn", () => {
      const gjallarhornAlly = createMockUnit({ traits: ["gjallarhorn"], hp: 5 });
      const defender = createMockUnit({ ap: 2, hp: 5 });
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const engine = GundamTestEngine.create(
        {
          play: [gd02GrazeRitterGroundType083, gjallarhornAlly],
          shieldArea: [firstShield],
          deck: 5,
        },
        { play: [defender], shieldArea: [secondShield], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [grazeId, allyId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [allyId!]);
      resolveUnitBattle(engine, PLAYER_ONE, grazeId!, defenderId);

      expect(p1.getCardZone(grazeId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.isExhausted(allyId!)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("produces no prompt on the opponent's turn when no friendly Gjallarhorn Unit remains", () => {
      const command = destroyEnemyCommand();
      const outsider = createMockUnit({ traits: ["teiwaz"], hp: 5 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { hand: [command], shieldArea: [openingShield], deck: 5 },
        { play: [gd02GrazeRitterGroundType083, outsider], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [grazeId, outsiderId] = p2.getCardsInZone("battleArea");

      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.playCommand(command));
      expectSuccess(p1.resolveEffect({ targets: [grazeId!] }));

      expect(p2.getCardZone(grazeId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardZone(outsiderId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
