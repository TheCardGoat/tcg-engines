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
import { gd01BigZam027 } from "./027-big-zam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Big Zam (GD01-027)", () => {
  it("can attack on its deploy turn with Dozle Zabi and Breach removes one Shield after a battle-damage destruction", () => {
    const dozle = createMockPilot({ name: "Dozle Zabi", level: 1, cost: 1 });
    const defender = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01BigZam027, dozle],
        resourceArea: activeResources(8),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      {
        play: [defender],
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01BigZam027));
    expectSuccess(p1.assignPilot(dozle, gd01BigZam027));
    expectSuccess(p1.enterBattle(gd01BigZam027, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 1);
  });

  it("deals 4 damage to every friendly and enemy Blocker with 10 matching Unit cards in trash", () => {
    const matchingTrash = [
      ...Array.from({ length: 6 }, () => createMockUnit({ traits: ["zeon"] })),
      ...Array.from({ length: 4 }, () => createMockUnit({ traits: ["neo zeon"] })),
    ];
    const friendlyBlocker = createMockUnit({
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const enemyBlocker = createMockUnit({ hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const nonBlocker = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01BigZam027],
        play: [friendlyBlocker],
        trash: matchingTrash,
        resourceArea: activeResources(7),
      },
      { play: [enemyBlocker, nonBlocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyBlockerId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyBlockerId, nonBlockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01BigZam027));

    expect(p1.getDamage(friendlyBlockerId)).toBe(4);
    expect(p2.getDamage(enemyBlockerId!)).toBe(4);
    expect(p2.getDamage(nonBlockerId!)).toBe(0);
  });

  it("does not deal deploy damage with only 9 matching Unit cards in trash", () => {
    const matchingTrash = Array.from({ length: 9 }, () => createMockUnit({ traits: ["zeon"] }));
    const blocker = createMockUnit({ hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01BigZam027],
        trash: matchingTrash,
        resourceArea: activeResources(7),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01BigZam027));

    expect(p2.getDamage(blockerId)).toBe(0);
  });
});
