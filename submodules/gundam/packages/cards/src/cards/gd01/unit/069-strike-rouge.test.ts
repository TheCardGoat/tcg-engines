import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StrikeRouge069 } from "./069-strike-rouge.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Strike Rouge (GD01-069)", () => {
  it("offers only rested white Blockers, readies the chosen Unit, and prevents it from attacking", () => {
    const whiteBlocker = createMockUnit({
      color: "white",
      keywordEffects: [{ keyword: "Blocker" }],
      hp: 5,
    });
    const redBlocker = createMockUnit({
      color: "red",
      keywordEffects: [{ keyword: "Blocker" }],
      hp: 5,
    });
    const engine = GundamTestEngine.create(
      {
        play: [gd01StrikeRouge069, whiteBlocker, redBlocker],
        resourceArea: activeResources(2),
      },
      {
        shieldArea: [
          createMockUnit({ name: "First Opening Shield" }),
          createMockUnit({ name: "Second Opening Shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [strikeRougeId, whiteBlockerId, redBlockerId] = p1.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [whiteBlockerId!, redBlockerId!]);

    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(2);
    expectSuccess(p1.activateAbility(strikeRougeId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [whiteBlockerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [whiteBlockerId!] }));

    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expect(p1.isExhausted(whiteBlockerId!)).toBe(false);
    expect(p1.isExhausted(redBlockerId!)).toBe(true);
    expectFailure(p1.activateAbility(strikeRougeId!, 0), "ABILITY_LIMIT_REACHED");
    expectFailure(p1.enterBattle(whiteBlockerId!, "direct"), "CANNOT_ATTACK");
  });

  it("links with an Orb Pilot and can attack on the deployment turn", () => {
    const orbPilot = createMockPilot({ traits: ["orb"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrikeRouge069, orbPilot],
        deck: 2,
        resourceArea: activeResources(4),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01StrikeRouge069));
    const strikeRougeId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(orbPilot, strikeRougeId));

    expectSuccess(p1.enterBattle(strikeRougeId, enemyId));
  });
});
