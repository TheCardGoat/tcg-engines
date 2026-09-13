import type { GrandArchiveAnyCard, GrandArchiveTargetDeclaration } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { isGrandArchiveTargetCandidate } from "../procedures/activation/activation.ts";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";

const champion: GrandArchiveAnyCard = {
  canonicalId: "private-zone-champion",
  slug: "private-zone-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "private-zone-champion:face:default",
      catalogId: "private-zone-champion",
      name: "Private Zone Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard = {
  canonicalId: "private-zone-filler",
  slug: "private-zone-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "private-zone-filler:face:default",
      catalogId: "private-zone-filler",
      name: "Private Zone Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 4 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1701,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1") };
}

describe("Grand Archive private-zone rules", () => {
  it("rejects a player-command reorder of the Main Deck", () => {
    const fixture = setup();
    expect(() =>
      new GrandArchiveTransactionKernel().transact(fixture.state, [
        {
          type: "zone-reordered",
          playerId: fixture.p1,
          zone: "main-deck",
          objectIds: [...fixture.state.zones[fixture.p1]["main-deck"]].reverse(),
          cause: { kind: "command", move: "reorder-main-deck" },
        },
      ]),
    ).toThrow("The Main Deck can only be reordered by a rule or effect");
  });

  it("never permits a Pantheon card to be a declared target", () => {
    const fixture = setup();
    const cardId = fixture.state.zones[fixture.p1]["main-deck"][0]!;
    const inPantheon = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "pantheon" },
    ]).state;
    const declaration: GrandArchiveTargetDeclaration = {
      id: "pantheon-card",
      kind: "target",
      declared: "announcement",
      chooser: "controller",
      count: { kind: "exactly", amount: 1 },
      candidates: { kind: "card", binding: "candidate-card" },
    };

    expect(
      isGrandArchiveTargetCandidate(cardId, declaration, {
        program: fixture.program,
        state: inPantheon,
        controllerId: fixture.p1,
        bindings: { "candidate-card": [cardId] },
      }),
    ).toBe(false);
  });
});
