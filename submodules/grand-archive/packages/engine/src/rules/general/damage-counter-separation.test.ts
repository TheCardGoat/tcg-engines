import { describe, expect, it } from "vitest";
import type {
  GrandArchiveAnyCard,
  GrandArchiveAbilityDefinition,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { giantTortoise, spiritOfWind, woodlandSquirrels } from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { grandArchiveObjectCounterCount } from "../../procedures/effects/evaluation.ts";
import {
  grandArchiveObjectMarkedDamage,
  grandArchiveObjectHasState,
} from "../../game/object-state.ts";
import {
  serializeGrandArchiveMatchSnapshot,
  restoreGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function action(
  id: string,
  effect: GrandArchiveEffect,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: "fast",
        stats: {},
        rulesText: id,
        abilities: [
          {
            id: `${id}-a1`,
            kind: "card-resolution",
            text: id,
            targets: [
              {
                id: "target",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  filter: { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
                },
              },
            ],
            effect,
          },
        ],
      },
    },
  };
}

const addCounters = action("put-20-damage-counters", {
  kind: "add-counter",
  subject: { kind: "bound", binding: "target" },
  counter: "damage",
  amount: 20,
});
const dealDamage = action("deal-one-damage", {
  kind: "deal-damage",
  source: { kind: "source" },
  recipient: { kind: "bound", binding: "target" },
  amount: 1,
});
const moveCounters = action("move-three-damage-counters", {
  kind: "move-counter",
  from: { kind: "bound", binding: "target" },
  to: { kind: "champion", player: "controller" },
  counter: "damage",
  amount: 3,
});
const clearTemporaryDamage = action("clear-temporary-damage", {
  kind: "remove-counter",
  subject: { kind: "bound", binding: "target" },
  counter: "damage",
  counterScope: "temporary",
  amount: { kind: "all" },
});

function fixture() {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: spiritOfWind,
      zones: {
        hand: [addCounters, dealDamage, moveCounters, clearTemporaryDamage],
        field: [giantTortoise],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: spiritOfWind,
      zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
    },
  });
  const player = game.player("player-one");
  const ally = player.card(giantTortoise);
  const activate = (card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) => {
    player.activate(card, { targets: { target: [ally.objectId] } });
    for (let n = 0; game.state.stack.length && n < 10; n++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected wait: ${wait.kind}`);
      game.player(wait.playerId).execute({ move: "pass" });
    }
    expect(game.state.stack).toHaveLength(0);
  };
  return { game, player, ally, activate };
}

describe("Damage counters and temporary damage (Counters / Damage 3.a; Damage 12–13)", () => {
  it("removes temporary damage by an effect without removing permanent counters", () => {
    const { game, ally, activate } = fixture();
    activate(addCounters);
    activate(dealDamage);
    activate(clearTemporaryDamage);
    expect(game.state.objects[ally.objectId]).toMatchObject({
      zone: "field",
      damage: 20,
      temporaryDamage: 0,
    });
    expect(game.markedDamage(ally.objectId)).toBe(0);
  });
  it("keeps damage counters on an ally inert while preserving their count", () => {
    const { game, ally, activate } = fixture();
    activate(addCounters);
    const object = game.state.objects[ally.objectId]!;
    expect(object.zone).toBe("field");
    expect(grandArchiveObjectCounterCount(object, "damage")).toBe(20);
    expect(object.temporaryDamage).toBe(0);
    expect(grandArchiveObjectMarkedDamage(game.program, game.state, object)).toBe(0);
    expect(grandArchiveObjectHasState(game.program, game.state, object, "damaged")).toBe(false);
  });

  it("does not expose temporary ally damage as counters to a move-counter effect", () => {
    const { game, player, ally, activate } = fixture();
    activate(dealDamage);
    activate(moveCounters);
    expect(game.state.objects[ally.objectId]).toMatchObject({
      zone: "field",
      damage: 0,
      temporaryDamage: 1,
    });
    expect(game.state.objects[player.card(spiritOfWind).objectId]!.damage).toBe(0);
  });

  it("moves actual counters without moving temporary damage, including after JSON restore", () => {
    const { game, player, ally, activate } = fixture();
    activate(addCounters);
    activate(dealDamage);
    const restored = restoreGrandArchiveMatchSnapshot(
      game.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
    );
    const runtime = new GrandArchiveMatchRuntime(game.program, restored);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: player.card(moveCounters).objectId,
          targets: { target: [ally.objectId] },
        },
        { playerId: player.id },
      ).ok,
    ).toBe(true);
    for (let n = 0; runtime.state.stack.length && n < 10; n++) {
      const holder = runtime.state.opportunity?.holderId;
      if (!holder) throw new Error("Missing Opportunity");
      expect(runtime.execute({ move: "pass" }, { playerId: holder }).ok).toBe(true);
    }
    expect(runtime.state.objects[ally.objectId]).toMatchObject({
      zone: "field",
      damage: 17,
      temporaryDamage: 1,
    });
    expect(runtime.state.objects[player.card(spiritOfWind).objectId]!.damage).toBe(3);
  });

  it("clears only temporary damage at end of turn", () => {
    const { game, ally, activate } = fixture();
    activate(addCounters);
    activate(dealDamage);
    const turn = game.state.turn.number;
    for (let n = 0; game.state.turn.number === turn && n < 30; n++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected wait: ${wait.kind}`);
      game.player(wait.playerId).execute({ move: "pass" });
    }
    expect(game.state.turn.number).toBeGreaterThan(turn);
    expect(game.state.objects[ally.objectId]).toMatchObject({
      zone: "field",
      damage: 20,
      temporaryDamage: 0,
    });
  });
});
