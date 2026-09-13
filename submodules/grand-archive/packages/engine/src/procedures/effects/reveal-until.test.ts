import { silvieEarthsTune } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { projectGrandArchiveViewerLog } from "../../log/projection.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { shuffleGrandArchiveObjects } from "../../game/random.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  options: {
    readonly type?: "ACTION" | "CHAMPION";
    readonly elements?: readonly ("ASTRA" | "FIRE" | "NORM")[];
    readonly subtypes?: readonly string[];
  } = {},
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  const type = options.type ?? "ACTION";
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("reveal-until-champion", { type: "CHAMPION" });
const first = card("reveal-until-first");
const second = card("reveal-until-second", { elements: ["FIRE"] });
const match = card("reveal-until-match", { elements: ["ASTRA"], subtypes: ["SPELL"] });
const untouched = card("reveal-until-untouched", { elements: ["ASTRA"] });

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [first, second, match, untouched].map((definition) => ({
      definitionId: definition.canonicalId,
      count: 1,
    })),
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function setup() {
  const program = createGrandArchiveMatchProgram([champion, first, second, match, untouched]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 814,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = (definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId}`);
    return object.id;
  };
  const ordered = [first, second, match, untouched].map((definition) =>
    objectId(definition.canonicalId),
  );
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "zone-reordered",
      playerId: p1,
      zone: "main-deck",
      objectIds: ordered,
      cause: { kind: "rule", rule: "test-fixture-order" },
    },
  ]).state;
  return { program, state: prepared, p1, p2: grandArchivePlayerId("p2"), ordered };
}

const revealUntil: GrandArchiveEffect = {
  kind: "reveal-until",
  player: "controller",
  zone: "main-deck",
  stopWhen: {
    kind: "all",
    filters: [
      { kind: "element", oneOf: ["ASTRA"] },
      { kind: "subtype", oneOf: ["SPELL"] },
    ],
  },
  bindMatchAs: "match",
  bindRemainderAs: "remainder",
};

function silvieRandomBottomEffect(): Extract<GrandArchiveEffect, { readonly kind: "move" }> {
  if (silvieEarthsTune.layout.kind !== "single-faced") {
    throw new Error("Silvie, Earth's Tune must be single-faced");
  }
  const ability = silvieEarthsTune.layout.face.abilities.find(
    (candidate) => candidate.kind === "triggered",
  );
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "sequence") {
    throw new Error("Silvie, Earth's Tune must have its catalog trigger sequence");
  }
  const move = ability.effect.effects.find(
    (candidate): candidate is Extract<GrandArchiveEffect, { readonly kind: "move" }> => {
      if (candidate.kind !== "move") return false;
      const placement = candidate.destination.placement;
      return (
        (placement?.kind === "top" || placement?.kind === "bottom") &&
        placement.order?.kind === "random"
      );
    },
  );
  if (!move) throw new Error("Silvie, Earth's Tune must randomly bottom its revealed remainder");
  return move;
}

function execute(effect: GrandArchiveEffect, fixture: ReturnType<typeof setup>) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    { program: fixture.program, state: fixture.state, controllerId: fixture.p1, bindings: {} },
    (state, events) => {
      const transaction = kernel.transact(state, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Grand Archive reveal-until effects", () => {
  it("reveals only through the first match and binds the match separately", () => {
    const fixture = setup();
    const result = execute(revealUntil, fixture);

    expect(
      result.events
        .filter((event) => event.type === "card-revealed")
        .map((event) => (event.type === "card-revealed" ? event.objectId : undefined)),
    ).toEqual(fixture.ordered.slice(0, 3));
    expect(result.bindings.match).toEqual([fixture.ordered[2]]);
    expect(result.bindings.remainder).toEqual(fixture.ordered.slice(0, 2));
    expect(result.state.zones[fixture.p1]["main-deck"]).toEqual(fixture.ordered);
  });

  it("binds the entire revealed zone as the remainder when no card matches", () => {
    const fixture = setup();
    const result = execute(
      {
        ...revealUntil,
        stopWhen: { kind: "subtype", oneOf: ["BEAST"] },
      },
      fixture,
    );

    expect(result.bindings.match).toEqual([]);
    expect(result.bindings.remainder).toEqual(fixture.ordered);
    expect(result.events.filter((event) => event.type === "card-revealed")).toHaveLength(4);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(result.state))),
    );
    expect(restored.zones[fixture.p1]["main-deck"]).toEqual(fixture.ordered);
  });

  it("feeds its bindings into subsequent moves and randomizes the bottomed remainder", () => {
    const fixture = setup();
    const expectedRemainder = shuffleGrandArchiveObjects(
      fixture.ordered.slice(0, 2),
      fixture.state.random,
    );
    const result = execute(
      {
        kind: "sequence",
        effects: [
          revealUntil,
          {
            kind: "move",
            subject: { kind: "bound", binding: "match" },
            from: "main-deck",
            destination: { zone: "hand" },
          },
          {
            ...silvieRandomBottomEffect(),
            subject: { kind: "bound", binding: "remainder" },
          },
        ],
      },
      fixture,
    );

    expect(result.state.zones[fixture.p1].hand).toContain(fixture.ordered[2]);
    expect(result.state.zones[fixture.p1]["main-deck"]).toEqual([
      fixture.ordered[3],
      ...expectedRemainder.value,
    ]);
    expect(result.state.random).toEqual(expectedRemainder.random);
    expect(result.events.map((event) => event.type)).toEqual([
      "card-revealed",
      "card-revealed",
      "card-revealed",
      "object-moved",
      "random-state-changed",
      "object-moved",
      "object-moved",
    ]);
    const randomlyPositioned = result.events.filter(
      (event) =>
        event.type === "object-moved" && event.from === "main-deck" && event.to === "main-deck",
    );
    expect(
      randomlyPositioned.map((event) =>
        event.type === "object-moved" ? event.orderedPrivatePlacementKnowledge : undefined,
      ),
    ).toEqual(["none", "none"]);
    for (const viewerId of [fixture.p1, fixture.p2]) {
      const movementLog = projectGrandArchiveViewerLog(
        fixture.program,
        result.state,
        viewerId,
        randomlyPositioned,
      );
      expect(movementLog.map((message) => message.key)).toEqual([
        "grand-archive.card.moved.hidden",
        "grand-archive.card.moved.hidden",
      ]);
      expect(JSON.stringify(movementLog)).not.toContain(first.canonicalId);
      expect(JSON.stringify(movementLog)).not.toContain(second.canonicalId);
    }
  });
});
