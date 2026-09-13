import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05ChaosGundam039 } from "./039-chaos-gundam.ts";

describe("Chaos Gundam (GD05-039)", () => {
  /** @behavioral-proof complete: Attack timing, friendly Phantom Pain Link filter, visible choice, High-Maneuver result, and this-turn expiry are public. */
  it("【Attack】 grants High-Maneuver only to the chosen Phantom Pain Link Unit", () => {
    const pilot = createMockPilot({ traits: ["phantom pain"] });
    const target = createMockUnit({
      name: "Phantom Pain Link Unit",
      traits: ["phantom pain"],
      linkCondition: "(Phantom Pain) Trait",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05ChaosGundam039, target],
        resourceArea: activeResources(3),
      },
      { shieldArea: [createMockUnit({ name: "Enemy Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, targetId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(pilot, targetId!));

    expectSuccess(p1.enterBattle(sourceId!, "direct"));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [targetId],
    });
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p1.getVisibleCard(targetId!)?.keywords).toContain("HighManeuver");
  });

  it("removes the granted High-Maneuver at the end of the attacking player's turn", () => {
    const pilot = createMockPilot({ traits: ["phantom pain"] });
    const target = createMockUnit({
      name: "Phantom Pain Link Unit",
      traits: ["phantom pain"],
      linkCondition: "(Phantom Pain) Trait",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05ChaosGundam039, target],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        shieldArea: [
          createMockUnit({ name: "First shield" }),
          createMockUnit({ name: "Second shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, targetId] = p1.getCardsInZone("battleArea");
    expectSuccess(p1.assignPilot(pilot, targetId!));

    expectSuccess(p1.enterBattle(sourceId!, "direct"));
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));
    expect(p1.getVisibleCard(targetId!)?.keywords).toContain("HighManeuver");
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getVisibleCard(targetId!)?.keywords).not.toContain("HighManeuver");
  });
});
