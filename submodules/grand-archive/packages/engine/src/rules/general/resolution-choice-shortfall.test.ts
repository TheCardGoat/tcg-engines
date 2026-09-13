import { resonantAether } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["RANGER"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("resolution-choice-champion", "CHAMPION");
const filler = card("resolution-choice-filler", "ACTION");

describe("Grand Archive resolution-choice shortfalls", () => {
  it("skips a dependent Load instruction when no Aetherwing can be chosen", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, resonantAether]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 8 },
        ...(id === "p1" ? [{ definitionId: resonantAether.canonicalId, count: 1 }] : []),
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
        randomSeed: 1221,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const source = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === resonantAether.canonicalId,
    );
    const payment = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    );
    if (!source || !payment) throw new Error("Missing Resonant Aether fixture cards");
    const staged = new GrandArchiveTransactionKernel().transact(
      initial,
      [source, payment].flatMap((object) =>
        object.zone === "hand"
          ? []
          : [
              {
                type: "object-moved" as const,
                objectId: object.id,
                from: object.zone,
                to: "hand" as const,
              },
            ],
      ),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(program, staged);

    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: source.id,
          reservePayment: [{ kind: "card", cardId: payment.id }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const resolved = runtime.execute({ move: "pass" }, { playerId: p2 });

    expect(resolved).toMatchObject({ ok: true });
    expect(runtime.state.objects[source.id]?.zone).toBe("graveyard");
    expect(runtime.state.objects[source.id]?.hostId).toBeUndefined();
    expect(runtime.state.decision).toBeNull();
  });
});
