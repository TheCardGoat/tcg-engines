import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveDecisionId } from "../game/identity.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import {
  GrandArchiveAmbiguousCardRefError,
  GrandArchiveCardRefNotFoundError,
  GrandArchiveTestEngine,
} from "./index.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "testing-champion",
  slug: "testing-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "testing-champion:face:default",
      catalogId: "testing-champion",
      name: "Testing Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const action: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "testing-action",
  slug: "testing-action",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "testing-action:face:default",
      catalogId: "testing-action",
      name: "Testing Action",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function start() {
  return GrandArchiveTestEngine.start(
    [champion, action],
    {
      mode: "standard",
      players: [
        {
          id: "p1",
          name: "Player One",
          mainDeck: [{ definitionId: action.canonicalId, count: 2 }],
          materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
          startingChampionDefinitionId: champion.canonicalId,
        },
        {
          id: "p2",
          name: "Player Two",
          mainDeck: [{ definitionId: action.canonicalId, count: 2 }],
          materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
          startingChampionDefinitionId: champion.canonicalId,
        },
      ],
      firstPlayerId: "p1",
      randomSeed: 7,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
}

describe("GrandArchiveTestEngine", () => {
  it("passes combat responses and declines retaliation while preserving available cards", () => {
    const ally: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
      canonicalId: "combat-drain-ally",
      slug: "combat-drain-ally",
      definitionKind: "card",
      layout: {
        kind: "single-faced",
        face: {
          id: "combat-drain-ally:face:default",
          catalogId: "combat-drain-ally",
          name: "Combat Drain Ally",
          cost: { kind: "reserve", amount: 0 },
          typeLine: { supertypes: [], types: ["ALLY"], classes: ["MAGE"], subtypes: [] },
          elements: ["NORM"],
          stats: { power: 3, life: 5 },
          rulesText: "",
          abilities: [],
        },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [ally], hand: [action] } },
      playerTwo: { champion, zones: { field: [ally], hand: [action] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const attacker = p.card(ally),
      defender = q.card(ally);
    p.declareAttack(attacker, defender);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.combat).toBeNull();
    expect(game.state.objects[defender.objectId]!.damage).toBe(3);
    expect(game.state.objects[attacker.objectId]!.damage).toBe(0);
    expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[defender.objectId]!.states.has("rested")).toBe(false);
    expect(p.zone("hand")).toHaveLength(1);
    expect(q.zone("hand")).toHaveLength(1);
  });

  it("drives production legal commands and viewer projection through player handles", () => {
    const game = start();
    const p1 = game.player("p1");

    expect(p1.legalCommands().map((entry) => entry.command.move)).toContain("pass");
    expect(p1.view().selfId).toBe(p1.id);

    const before = game.state.stateVersion;
    const result = p1.pass();
    expect(result.state.stateVersion).toBeGreaterThan(before);
    expect(game.state).toBe(result.state);
  });

  it("keeps hidden Main Deck identities out of unqualified player card refs", () => {
    const game = start();
    const p1 = game.player("p1");

    expect(() => p1.card(action)).toThrow(GrandArchiveCardRefNotFoundError);
    expect(() => p1.card(action, { zone: "main-deck" })).toThrow(GrandArchiveAmbiguousCardRefError);
    const cards = game.state.zones[p1.id]["main-deck"];
    const selectedId = cards[0]!;
    const selected = p1.card(action, { zone: "main-deck", objectId: selectedId });

    expect(selected).toMatchObject({
      kind: "instance",
      objectId: selectedId,
      definitionId: action.canonicalId,
      ownerId: p1.id,
    });
    expect(p1.card(selected)).toEqual(selected);
  });

  it("probes expected failures without changing the held production runtime", () => {
    const game = start();
    const p1 = game.player("p1");
    const p2 = game.player("p2");
    const before = game.state;

    const rejected = p2.expectFailure({ move: "pass" });
    expect(rejected.ok).toBe(false);
    expect(game.state).toBe(before);

    expect(() => p1.expectFailure({ move: "pass" })).toThrow(/to fail, but it was accepted/);
    expect(game.state).toBe(before);
  });

  it("answers only mathematically forced decisions", () => {
    const initial = start();
    const p1 = initial.player("p1");
    const candidates = initial.state.zones[p1.id]["main-deck"].slice(0, 2);
    const [firstId, secondId] = candidates;
    if (!firstId || !secondId) throw new Error("Decision fixture needs two cards");
    const kernel = new GrandArchiveTransactionKernel();
    const inMemory = kernel.transact(initial.state, [
      ...candidates.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
      { type: "phase-changed" as const, phase: "recollection" as const },
    ]).state;
    const withChoice = kernel.transact(inMemory, [
      {
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${inMemory.nextDecisionOrdinal}`),
          kind: "choose-recollection",
          playerId: p1.id,
          amount: 1,
          candidateIds: [firstId, secondId],
          stateVersion: inMemory.stateVersion,
        },
      },
    ]).state;
    const choice = GrandArchiveTestEngine.fromState(initial.program, withChoice);

    expect(choice.answerForcedDecision()).toBe(false);
    expect(choice.state.decision).not.toBeNull();

    const decision = withChoice.decision;
    if (decision?.kind !== "choose-recollection") {
      throw new Error("Expected a Recollection decision");
    }
    const forcedState = {
      ...withChoice,
      decision: {
        ...decision,
        candidateIds: [firstId],
      },
    };
    const forced = GrandArchiveTestEngine.fromState(initial.program, forcedState);
    const forcedCommands = forced.legalCommands(p1.id);
    expect(forcedCommands, JSON.stringify(forcedCommands)).toHaveLength(1);
    expect(forced.answerForcedDecision()).toBe(true);
    expect(forced.state.decision).toBeNull();
    expect(forced.state.objects[firstId]?.zone).toBe("hand");
  });

  it("resolves response-free stack items without passing an empty-stack Opportunity", () => {
    const initial = start();
    const p1 = initial.player("p1");
    const actionId = initial.state.zones[p1.id]["main-deck"][0]!;
    const inHand = new GrandArchiveTransactionKernel().transact(initial.state, [
      {
        type: "object-moved",
        objectId: actionId,
        from: "main-deck",
        to: "hand",
      },
    ]).state;
    const game = GrandArchiveTestEngine.fromState(initial.program, inHand);

    game
      .player("p1")
      .executeLegal(
        (candidate) =>
          candidate.command.move === "activate-card" && candidate.command.cardId === actionId,
        "activate test action",
      );
    expect(game.state.stack).toHaveLength(1);

    expect(game.resolveStackUntilChoice()).toBe("stack-empty");
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[actionId]?.zone).toBe("graveyard");
    expect(game.state.opportunity).not.toBeNull();
  });

  it("stops stack draining when the Opportunity holder has a fast response", () => {
    const initial = start();
    const p1 = initial.player("p1");
    const actionIds = initial.state.zones[p1.id]["main-deck"].slice(0, 2);
    const [firstId, responseId] = actionIds;
    if (!firstId || !responseId) throw new Error("Response fixture needs two actions");
    const inHand = new GrandArchiveTransactionKernel().transact(
      initial.state,
      actionIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ).state;
    const game = GrandArchiveTestEngine.fromState(initial.program, inHand);
    const player = game.player("p1");

    player.executeLegal(
      (candidate) =>
        candidate.command.move === "activate-card" && candidate.command.cardId === firstId,
    );

    expect(game.resolveStackUntilChoice()).toBe("player-choice");
    expect(game.state.stack).toHaveLength(1);
    expect(
      player
        .legalCommands()
        .some(
          (candidate) =>
            candidate.command.move === "activate-card" && candidate.command.cardId === responseId,
        ),
    ).toBe(true);
  });
});
