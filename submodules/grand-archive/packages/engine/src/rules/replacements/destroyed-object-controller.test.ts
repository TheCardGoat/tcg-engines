import { diaoChanIdyllCorsage, flowerbud } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import {
  collectGrandArchivePendingTriggerProgressEvents,
  collectGrandArchiveTriggeredAbilityEvents,
} from "../abilities/triggers.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
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
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 1 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("destroyed-controller-champion", "CHAMPION");
const borrowedAlly = card("destroyed-controller-borrowed-ally", "ALLY");
const filler = card("destroyed-controller-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    borrowedAlly,
    filler,
    diaoChanIdyllCorsage,
    flowerbud,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(id === "p1"
        ? [
            { definitionId: diaoChanIdyllCorsage.canonicalId, count: 1 },
            { definitionId: borrowedAlly.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 944,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const diaoId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === diaoChanIdyllCorsage.canonicalId,
  )!.id;
  const allyId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === borrowedAlly.canonicalId,
  )!.id;
  const kernel = new GrandArchiveTransactionKernel();
  const positioned = kernel.transact(initial, [
    { type: "object-moved", objectId: diaoId, from: initial.objects[diaoId]!.zone, to: "field" },
    {
      type: "object-moved",
      objectId: allyId,
      from: initial.objects[allyId]!.zone,
      to: "field",
      newControllerId: p2,
    },
  ]).state;
  const destroyed = kernel.transact(positioned, [
    {
      type: "object-moved",
      objectId: allyId,
      from: "field",
      to: "graveyard",
      cause: { kind: "rule", rule: "destroy-effect" },
    },
  ]);
  const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
    program,
    destroyed.state,
    destroyed.result.events,
  );
  const pending = kernel.transact(destroyed.state, triggerEvents).state;
  const ready = kernel.transact(
    pending,
    collectGrandArchivePendingTriggerProgressEvents(program, pending),
  ).state;
  return { program, runtime: new GrandArchiveMatchRuntime(program, ready), p1, p2, allyId };
}

describe("Grand Archive destroyed-object controller tracking", () => {
  it("gives Diao Chan's Flowerbud to the opponent who controlled the destroyed object", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const item = runtime.state.stack.at(-1);
    expect(item?.kind).toBe("triggered-ability");
    if (!item || item.kind !== "triggered-ability") return;
    expect(item.ability.id).toBe("d7l6i5thdy-a3");
    expect(item.bindings.eventSubjectController).toEqual([fixture.p2]);
    expect(runtime.state.objects[fixture.allyId]?.controllerId).toBe(fixture.p1);

    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-optional-effect") {
      throw new Error("Expected Diao Chan's optional banishment decision");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: true,
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    expect(runtime.state.objects[fixture.allyId]?.zone).toBe("banishment");
    const summoned = Object.values(runtime.state.objects).filter(
      (object) => object.isToken && object.definitionId === flowerbud.canonicalId,
    );
    expect(summoned).toHaveLength(1);
    expect(summoned[0]?.controllerId).toBe(fixture.p2);
    expect(summoned[0]?.ownerId).toBe(fixture.p2);
  });
});
