import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05IncendiarySpark118 } from "./118-incendiary-spark.ts";

describe("Incendiary Spark (GD05-118)", () => {
  /** @behavioral-proof complete: target legality, AP duration, ordinary payment, and EX same-target rest are public. */
  it("gives the chosen enemy Unit AP-2 without resting it after ordinary payment", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05IncendiarySpark118],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05IncendiarySpark118, { targets: [enemyId] }));

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("rests the same chosen enemy Unit when an EX Resource pays for the Command", () => {
    const chosen = createMockUnit({ name: "Chosen Enemy", ap: 4, hp: 6 });
    const other = createMockUnit({ name: "Other Enemy", ap: 4, hp: 6 });
    const exResource = createMockResource({ name: "EX Resource" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05IncendiarySpark118],
        resourceArea: [...restedResources(3), { card: exResource, isToken: true }],
      },
      { play: [chosen, other] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, otherId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd05IncendiarySpark118, { targets: [chosenId!] }));

    expect(p2.getVisibleCard(chosenId!)?.effectiveAp).toBe(2);
    expect(p2.isExhausted(chosenId!)).toBe(true);
    expect(p2.getVisibleCard(otherId!)?.effectiveAp).toBe(4);
    expect(p2.isExhausted(otherId!)).toBe(false);
  });

  it("uses a deliberately selected EX Resource even when ordinary Resources are active", () => {
    const enemy = createMockUnit({ name: "Chosen Enemy", ap: 4, hp: 6 });
    const exResource = createMockResource({ name: "EX Resource" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05IncendiarySpark118],
        resourceArea: [...activeResources(2), { card: exResource, isToken: true }],
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const resourceIds = p1.getCardsInZone("resourceArea");

    const procedure = p1.getMoveProcedure("playCommand", { cardId: p1.getHand()[0]! });
    expect(procedure).toEqual([
      expect.objectContaining({
        kind: "selectTarget",
        role: "resource",
        candidateIds: resourceIds,
        minTargets: 1,
        maxTargets: 1,
      }),
    ]);

    expectSuccess(
      p1.playCommand(gd05IncendiarySpark118, {
        targets: [enemyId],
        paymentResourceIds: [resourceIds.at(-1)!],
      }),
    );

    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("loses the AP reduction when the turn ends", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05IncendiarySpark118],
        resourceArea: activeResources(3),
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05IncendiarySpark118, { targets: [enemyId] }));
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    engine.endTurn();

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("cannot target a friendly Unit", () => {
    const friendly = createMockUnit({ name: "Friendly", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create({
      hand: [gd05IncendiarySpark118],
      play: [friendly],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd05IncendiarySpark118, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );

    expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
  });
});
