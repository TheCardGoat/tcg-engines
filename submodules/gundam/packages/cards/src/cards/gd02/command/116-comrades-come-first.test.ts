import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  createMockResource,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02ComradesComeFirst116 } from "./116-comrades-come-first.ts";

describe("Comrades Come First (GD02-116)", () => {
  it("【Main】grants a friendly (Vulture) Unit the option to attack an active enemy Lv.4-or-lower Unit this turn", () => {
    const vultureUnit = createMockUnit({ ap: 3, hp: 3, traits: ["vulture"] });
    const enemyUnit = createMockUnit({ ap: 2, hp: 3, level: 3 });
    // Fill trash with 7+ cards to satisfy the cardInZone condition
    const trashCards = Array.from({ length: 7 }, () => createMockResource());
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ComradesComeFirst116],
        play: [vultureUnit],
        resourceArea: activeResources(4),
        trash: trashCards,
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [unitId] = p1.getCardsInZone("battleArea");
    const [enemyId] = p2.getCardsInZone("battleArea");
    const cmdId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(cmdId, { targets: [unitId!] }));

    expect(p1.getLegalAttackTargets(unitId!)).toContain(enemyId);
    expect(p1.getCardZone(cmdId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot play when trash has fewer than 7 cards", () => {
    const vultureUnit = createMockUnit({ ap: 3, hp: 3, traits: ["vulture"] });
    const enemyUnit = createMockUnit({ ap: 2, hp: 3, level: 3 });
    const trashCards = Array.from({ length: 5 }, () => createMockResource());
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ComradesComeFirst116],
        play: [vultureUnit],
        resourceArea: activeResources(4),
        trash: trashCards,
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [unitId] = p1.getCardsInZone("battleArea");

    const result = p1.playCommand(gd02ComradesComeFirst116, { targets: [unitId!] });
    expect(result.success).toBe(false);
  });
});
