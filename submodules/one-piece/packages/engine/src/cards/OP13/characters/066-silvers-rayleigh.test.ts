import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13SilversRayleigh066 } from "../../../../../cards/src/cards/OP13/characters/066-silvers-rayleigh.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-066 Silvers Rayleigh", () => {
  test("with a given DON!! rests a cost-5 Character and adds active DON!! only at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SilversRayleigh066],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: op13SilversRayleigh066.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op13SilversRayleigh066, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Rayleigh's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.activeDon).toBe(0);

    engine.endTurn("south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a given DON!! skips the full on-play sequence", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13SilversRayleigh066], activeDon: op13SilversRayleigh066.cost },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op13SilversRayleigh066, "south");
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("Rush allows the Character to attack on the turn it was played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SilversRayleigh066],
        activeDon: op13SilversRayleigh066.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op13SilversRayleigh066, "south");
    const rayleighId = engine.findCardInZone("south", "character", op13SilversRayleigh066);

    expect(() => engine.declareAttack(rayleighId, engine.leader("north"), "south")).not.toThrow();
  });
});
