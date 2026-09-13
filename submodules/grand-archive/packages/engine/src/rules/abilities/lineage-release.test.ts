import { spiritOfSereneFire } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "lineage-release-champion",
  slug: "lineage-release-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lineage-release-champion:face:default",
      catalogId: "lineage-release-champion",
      name: "Lineage Release Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
      elements: ["FIRE"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "lineage-release-filler",
  slug: "lineage-release-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lineage-release-filler:face:default",
      catalogId: "lineage-release-filler",
      name: "Lineage Release Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, spiritOfSereneFire]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 8 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: spiritOfSereneFire.canonicalId, count: id === "p1" ? 2 : 0 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1223,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return {
    program,
    state,
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
  };
}

describe("Grand Archive Lineage Release", () => {
  it("is available only from inner lineage and banishes exactly its own source as the cost", () => {
    const fixture = setup();
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const lineageCards = fixture.state.zones[fixture.p1]["material-deck"].filter(
      (objectId) =>
        fixture.state.objects[objectId]?.definitionId === spiritOfSereneFire.canonicalId,
    );
    const [sourceId, otherLineageId] = lineageCards;
    if (!sourceId || !otherLineageId) throw new Error("Lineage Release fixture is incomplete");

    expect(
      listGrandArchiveLegalCommands(fixture.program, fixture.state, fixture.p1).some(
        (candidate) =>
          candidate.command.move === "activate-ability" && candidate.command.sourceId === sourceId,
      ),
    ).toBe(false);

    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...lineageCards.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "material-deck" as const,
        to: "inner-lineage" as const,
        hostId: championId,
      })),
      {
        type: "damage-marked",
        objectId: championId,
        amount: 6,
        preventable: false,
      },
    ]).state;
    const command = listGrandArchiveLegalCommands(fixture.program, positioned, fixture.p1).find(
      (candidate) =>
        candidate.command.move === "activate-ability" &&
        candidate.command.sourceId === sourceId &&
        candidate.command.abilityId === "da2ha4dk88-a2",
    );
    expect(command?.command).toEqual({
      move: "activate-ability",
      sourceId,
      abilityId: "da2ha4dk88-a2",
    });

    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    if (!command) throw new Error("Lineage Release command was not discovered");
    const activated = runtime.execute(command.command, { playerId: fixture.p1 });
    if (!activated.ok) throw new Error(activated.message);

    expect(runtime.state.objects[sourceId]?.zone).toBe("banishment");
    expect(runtime.state.objects[otherLineageId]?.zone).toBe("inner-lineage");
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "activated-ability",
      sourceId,
    });

    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(runtime.state.objects[championId]?.damage).toBe(0);
  });
});
