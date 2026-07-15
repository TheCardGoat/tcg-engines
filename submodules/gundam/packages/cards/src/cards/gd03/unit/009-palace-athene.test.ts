import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03PalaceAthene009 } from "./009-palace-athene.ts";

describe("Palace Athene (GD03-009)", () => {
  it("【Deploy】 exiles 2 (Titans) cards from trash and rests a chosen Lv.4 or lower enemy Unit", () => {
    const titans1 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans2 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const lowLv = createMockUnit({ ap: 2, hp: 5, level: 3 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd03PalaceAthene009],
        trash: [titans1, titans2],
        resourceArea: activeResources(5),
      },
      { play: [lowLv] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [titans1Id, titans2Id] = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(
      p1.deployUnit(gd03PalaceAthene009, {
        targets: [titans1Id!, titans2Id!, enemyId],
      }),
    );
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    // Both Titans cards left the trash via exile.
    expect(p1.getCardsInZone("trash")).not.toContain(titans1Id);
    expect(p1.getCardsInZone("trash")).not.toContain(titans2Id);
    // The Lv.3 enemy was rested via the dependent directive.
    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("may decline to exile the Titans cards and leaves the enemy Unit active", () => {
    const titans1 = createMockUnit({ traits: ["titans"] });
    const titans2 = createMockUnit({ traits: ["titans"] });
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03PalaceAthene009],
        trash: [titans1, titans2],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03PalaceAthene009));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getCardsInZone("trash")).toEqual(trashIds);
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not offer the Deploy effect with fewer than 2 Titans cards in trash", () => {
    const loneTitans = createMockUnit({ traits: ["titans"] });
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03PalaceAthene009],
        trash: [loneTitans],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const trashId = p1.getCardsInZone("trash")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03PalaceAthene009));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toContain(trashId);
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not allow a non-Titans trash card to pay either exile", () => {
    const firstTitans = createMockUnit({ traits: ["titans"] });
    const secondTitans = createMockUnit({ traits: ["titans"] });
    const wrongTrait = createMockUnit({ traits: ["aeug"] });
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03PalaceAthene009],
        trash: [firstTitans, secondTitans, wrongTrait],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstTitansId, , wrongTraitId] = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd03PalaceAthene009, {
        targets: [firstTitansId!, wrongTraitId!, enemyId],
      }),
      "INVALID_TARGET",
    );

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("trash")).toContain(wrongTraitId);
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
