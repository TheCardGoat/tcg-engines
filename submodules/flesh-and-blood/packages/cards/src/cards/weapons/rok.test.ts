import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine, expectWait } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { tuffnutBumblingHulkster } from "../heroes/tuffnut-bumbling-hulkster.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rok } from "./rok.ts";

describe("Rok (DYN005) AAA", () => {
  it("projects only its static damage restriction, not its activation condition", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rok],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    const rokEffects = game
      .getView({ role: "player", actorId: Rhinar.id })
      .effects.filter((effect) => effect.source.canonicalId === rok.canonicalId);

    expect(rokEffects).toHaveLength(1);
    expect(rokEffects[0]).toMatchObject({
      origin: { kind: "continuous", source: "static" },
      impacts: [{ kind: "rule", mode: "restrict", action: "be-prevented" }],
    });
    expect(
      rokEffects.some((effect) =>
        effect.impacts.some(
          (impact) => impact.kind === "rule" && impact.mode === "allow" && impact.action === "play",
        ),
      ),
    ).toBe(false);
  });

  it("mirror: keeps each Rok restriction scoped to its own weapon instance", () => {
    const game = FabTestEngine.start(
      { hero: tuffnutBumblingHulkster, weapon1: [rok], hand: [], deck: 6 },
      { hero: tuffnutBumblingHulkster, weapon1: [rok], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const firstTuffnut = game.as(tuffnutBumblingHulkster, 1);
    const secondTuffnut = game.as(tuffnutBumblingHulkster, 2);

    expect(firstTuffnut.id).not.toBe(secondTuffnut.id);
    expectWait(game).notToHaveDecision();

    for (const actorId of [firstTuffnut.id, secondTuffnut.id]) {
      const rokEffects = game
        .getView({ role: "player", actorId })
        .effects.filter((effect) => effect.source.canonicalId === rok.canonicalId);
      expect(rokEffects).toHaveLength(2);
      expect(new Set(rokEffects.map((effect) => effect.source.instanceId)).size).toBe(2);
      expect(
        rokEffects.every((effect) =>
          effect.impacts.some(
            (impact) =>
              impact.kind === "rule" &&
              impact.mode === "restrict" &&
              impact.action === "be-prevented",
          ),
        ),
      ).toBe(true);
    }
  });

  it("happy: empty-hand activation attacks for 7", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rok],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(rok);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rok],
        hand: [],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(rok);
    game.helpers.resolveRestOfCombat();
    Rhinar.expectActivationRejected(rok);
  });

  it("boundary: cannot activate while a card is in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [rok],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    const rejected = Rhinar.expectActivationRejected(rok);
    expect(rejected.errorCode).toBe("activation_condition_failed");
  });
});
