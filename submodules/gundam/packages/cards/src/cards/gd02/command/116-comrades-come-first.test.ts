import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  createMockResource,
  expectSuccess,
  hasGrantAttackTargetOption,
  expectCardInTrash,
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
    const [unitId] = p1.getCardsInZone("battleArea");
    const cmdId = p1.getHand()[0]!;

    // chooseAttackTarget auto-targets the matching friendly unit
    expectSuccess(p1.playCommand(gd02ComradesComeFirst116));

    expect(hasGrantAttackTargetOption(engine, unitId!)).toBe(true);
    expectCardInTrash(engine, cmdId, p1.playerId);
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
