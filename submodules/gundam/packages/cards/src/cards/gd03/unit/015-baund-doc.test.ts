import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03BaundDoc015 } from "./015-baund-doc.ts";

describe("Baund Doc (GD03-015)", () => {
  it("【Activate･Main】 exiles 3 (Titans) from trash, then this Unit gains <Breach 4> this turn", () => {
    const titans1 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans2 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans3 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans4 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans5 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans6 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });

    const engine = GundamTestEngine.create(
      {
        play: [gd03BaundDoc015],
        trash: [titans1, titans2, titans3, titans4, titans5, titans6],
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baundDocId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    expect(p1.getVisibleCard(baundDocId)?.keywords).not.toContain("Breach");

    expectSuccess(p1.activateAbility(baundDocId, 0, { targets: trashIds.slice(0, 3) }));

    expect(p1.getCardsInZone("trash")).toHaveLength(3);
    expect(p1.getVisibleCard(baundDocId)?.keywords).toContain("Breach");
    expectFailure(
      p1.activateAbility(baundDocId, 0, { targets: trashIds.slice(3) }),
      "ABILITY_LIMIT_REACHED",
    );

    expectSuccess(p1.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(baundDocId)?.keywords).not.toContain("Breach");
  });

  it("cannot activate with only 2 (Titans) cards in trash", () => {
    const firstTitans = createMockUnit({ name: "First Titans", traits: ["titans"] });
    const secondTitans = createMockUnit({ name: "Second Titans", traits: ["titans"] });
    const unrelated = createMockUnit({ name: "Unrelated Unit", traits: ["aeug"] });
    const engine = GundamTestEngine.create({
      play: [gd03BaundDoc015],
      trash: [firstTitans, secondTitans, unrelated],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baundDocId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");

    expectFailure(p1.activateAbility(baundDocId, 0, { targets: trashIds }), "COST_NOT_PAYABLE");

    expect(p1.getCardsInZone("trash")).toHaveLength(trashIds.length);
    expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining(trashIds));
    expect(p1.getCardsInZone("removalArea")).toHaveLength(0);
    expect(p1.getVisibleCard(baundDocId)?.keywords).not.toContain("Breach");
  });

  it("rejects a non-(Titans) card selected among the 3 exile-cost cards", () => {
    const firstTitans = createMockUnit({ name: "First Titans", traits: ["titans"] });
    const secondTitans = createMockUnit({ name: "Second Titans", traits: ["titans"] });
    const thirdTitans = createMockUnit({ name: "Third Titans", traits: ["titans"] });
    const unrelated = createMockUnit({ name: "Unrelated Unit", traits: ["aeug"] });
    const engine = GundamTestEngine.create({
      play: [gd03BaundDoc015],
      trash: [firstTitans, secondTitans, thirdTitans, unrelated],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baundDocId = p1.getCardsInZone("battleArea")[0]!;
    const [firstTitansId, secondTitansId, , unrelatedId] = p1.getCardsInZone("trash");
    const trashIds = p1.getCardsInZone("trash");

    expectFailure(
      p1.activateAbility(baundDocId, 0, {
        targets: [firstTitansId!, secondTitansId!, unrelatedId!],
      }),
      "WRONG_TARGET_COUNT",
    );

    expect(p1.getCardsInZone("trash")).toHaveLength(trashIds.length);
    expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining(trashIds));
    expect(p1.getCardsInZone("removalArea")).toHaveLength(0);
    expect(p1.getVisibleCard(baundDocId)?.keywords).not.toContain("Breach");
  });
});
