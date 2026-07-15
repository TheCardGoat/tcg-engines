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
import { gd03HumanKarma113 } from "../command/113-human-karma.ts";
import { gd03GundamNt1FullArmor007 } from "./007-gundam-nt-1-full-armor.ts";
import { gd03Bertigo037 } from "./037-bertigo.ts";

describe("Bertigo (GD03-037)", () => {
  function setup({ enemyHasDestroyedEffect = true }: { enemyHasDestroyedEffect?: boolean } = {}) {
    const pilot = createMockPilot({ name: "Newtype Pilot", traits: ["newtype"] });
    const enemy = enemyHasDestroyedEffect
      ? gd03GundamNt1FullArmor007
      : createMockUnit({ name: "Enemy Without Destroyed", ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Bertigo037],
        resourceArea: activeResources(5),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bertigoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, bertigoId));
    expectSuccess(p1.enterBattle(bertigoId, enemyId));

    return { p1, bertigoId };
  }

  it("gains First Strike during your turn while linked and battling an enemy Unit with a Destroyed effect", () => {
    const { p1, bertigoId } = setup();

    expect(p1.getVisibleCard(bertigoId)?.keywords).toContain("FirstStrike");
  });

  it("does not gain First Strike when the battling enemy has no Destroyed effect", () => {
    const { p1, bertigoId } = setup({ enemyHasDestroyedEffect: false });

    expect(p1.getVisibleCard(bertigoId)?.keywords).not.toContain("FirstStrike");
  });

  it("does not gain First Strike during the opponent's turn", () => {
    const pilot = createMockPilot({ name: "Newtype Pilot", traits: ["newtype"] });
    const damageTarget = createMockUnit({ name: "Human Karma Target", level: 5, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd03HumanKarma113],
        play: [gd03Bertigo037],
        resourceArea: activeResources(6),
        deck: 5,
      },
      {
        play: [gd03GundamNt1FullArmor007, damageTarget],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bertigoId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, damageTargetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, bertigoId));
    expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [bertigoId] }));
    expectSuccess(p1.resolveEffect({ targets: [damageTargetId!] }));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId, bertigoId));

    expect(p1.getVisibleCard(bertigoId)?.keywords).not.toContain("FirstStrike");
  });
});
