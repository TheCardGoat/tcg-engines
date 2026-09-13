import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { listGrandArchiveLegalCommands } from "../commands/legal-commands.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import {
  chooseGrandArchiveAutomatedAction,
  firstLegalGrandArchiveStrategy,
  passOnlyGrandArchiveStrategy,
  seatMustActInGrandArchive,
  submitGrandArchiveAutomatedAction,
} from "./bot-strategies.ts";
import {
  buildGrandArchiveHeuristicSnapshot,
  createGrandArchiveChampionMatcher,
  createGrandArchiveChampionProfileStrategy,
  valueExtractGrandArchiveStrategy,
} from "./heuristic/index.ts";

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
        ...(type === "CHAMPION" ? { lineageName: id } : {}),
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities:
          type === "ACTION"
            ? [
                {
                  id: `${id}-a1`,
                  kind: "card-resolution",
                  text: "Resolve without an effect.",
                  effect: { kind: "no-op" },
                },
              ]
            : [],
      },
    },
  };
}

const champion = card("automation-champion", "CHAMPION");
const action = card("automation-action", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, action]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: action.canonicalId, count: 8 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initialState = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 919,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const actionObject = Object.values(initialState.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === action.canonicalId,
  );
  if (!actionObject) throw new Error("Expected a player-one action object.");
  const state = new GrandArchiveTransactionKernel().transact(initialState, [
    {
      type: "object-moved",
      objectId: actionObject.id,
      from: actionObject.zone,
      to: "hand",
    },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, state),
    p1,
    p2: grandArchivePlayerId("p2"),
  };
}

describe("Grand Archive automation strategies", () => {
  it("offers actions only to the seat that can currently act", () => {
    const fixture = setup();

    expect(seatMustActInGrandArchive(fixture.program, fixture.runtime.state, fixture.p1)).toBe(
      true,
    );
    expect(seatMustActInGrandArchive(fixture.program, fixture.runtime.state, fixture.p2)).toBe(
      false,
    );
    expect(
      chooseGrandArchiveAutomatedAction(
        fixture.program,
        fixture.runtime.state,
        fixture.p2,
        firstLegalGrandArchiveStrategy,
      ),
    ).toBeNull();
  });

  it("lets a pass-only bot submit through the authoritative runtime", () => {
    const fixture = setup();
    const beforeVersion = fixture.runtime.state.stateVersion;

    const chosen = chooseGrandArchiveAutomatedAction(
      fixture.program,
      fixture.runtime.state,
      fixture.p1,
      passOnlyGrandArchiveStrategy,
    );
    expect(chosen?.command).toEqual({ move: "pass" });

    const submitted = submitGrandArchiveAutomatedAction(
      fixture.runtime,
      fixture.p1,
      passOnlyGrandArchiveStrategy,
    );
    expect(submitted.kind).toBe("submitted");
    expect(submitted.command?.command).toEqual({ move: "pass" });
    expect(submitted.transition?.ok).toBe(true);
    expect(fixture.runtime.state.stateVersion).toBeGreaterThan(beforeVersion);
    expect(fixture.runtime.state.opportunity?.holderId).toBe(fixture.p2);
  });

  it("rejects a strategy command outside the authoritative legal list without executing it", () => {
    const fixture = setup();
    const before = fixture.runtime.state;
    const submitted = submitGrandArchiveAutomatedAction(fixture.runtime, fixture.p1, () => ({
      playerId: fixture.p2,
      stateVersion: before.stateVersion + 1,
      command: { move: "concede" },
      label: "Forged concession",
    }));

    expect(submitted).toEqual({
      kind: "strategy-command-not-legal",
      command: null,
      transition: null,
    });
    expect(fixture.runtime.state).toBe(before);
  });

  it("reports idle when a strategy abstains", () => {
    const fixture = setup();
    expect(submitGrandArchiveAutomatedAction(fixture.runtime, fixture.p1, () => null)).toEqual({
      kind: "idle",
      command: null,
      transition: null,
    });
  });

  it("uses current card information to play before voluntarily passing", () => {
    const fixture = setup();
    expect(fixture.runtime.state.turn.phase).toBe("main");
    expect(fixture.runtime.state.zones[fixture.p1].hand.length).toBeGreaterThan(0);
    const snapshot = buildGrandArchiveHeuristicSnapshot(
      fixture.program,
      fixture.runtime.state,
      fixture.p1,
    );
    expect(snapshot.mainDeckCount).toBe(7);
    expect(snapshot.hand[0]).toMatchObject({
      classes: ["MAGE"],
      elements: ["NORM"],
      facing: "face-down",
      isToken: false,
    });
    expect(snapshot.champion).toMatchObject({
      definitionId: champion.canonicalId,
      lineageName: champion.canonicalId,
      types: ["CHAMPION"],
    });
    expect(snapshot.self.champion?.id).toBe(snapshot.champion?.id);
    expect(snapshot.opponents).toHaveLength(1);
    expect(snapshot.opponents[0]?.champion?.types).toContain("CHAMPION");
    expect(snapshot.combat).toBeNull();
    expect(snapshot.decisionKind).toBeNull();
    expect(
      listGrandArchiveLegalCommands(fixture.program, fixture.runtime.state, fixture.p1).map(
        (candidate) => candidate.command.move,
      ),
    ).toContain("activate-card");
    const chosen = chooseGrandArchiveAutomatedAction(
      fixture.program,
      fixture.runtime.state,
      fixture.p1,
      valueExtractGrandArchiveStrategy,
    );

    expect(chosen?.command.move).toBe("activate-card");
    expect(fixture.runtime.state.zones[fixture.p1].hand).toContain(
      chosen?.command.move === "activate-card" ? chosen.command.cardId : undefined,
    );
  });

  it("dispatches an exact seated-champion profile before the generic fallback", () => {
    const fixture = setup();
    const strategy = createGrandArchiveChampionProfileStrategy([
      {
        id: "automation-champion-profile",
        label: "Automation champion",
        description: "Test profile",
        strategy: passOnlyGrandArchiveStrategy,
        championMatch: createGrandArchiveChampionMatcher({
          lineageNames: ["automation-champion"],
        }),
      },
    ]);

    expect(
      chooseGrandArchiveAutomatedAction(
        fixture.program,
        fixture.runtime.state,
        fixture.p1,
        strategy,
      )?.command,
    ).toEqual({ move: "pass" });
  });

  it("does not expose an opponent's face-down field card to heuristic policy", () => {
    const fixture = setup();
    const hidden = Object.values(fixture.runtime.state.objects).find(
      (object) => object.ownerId === fixture.p2 && object.definitionId === action.canonicalId,
    );
    if (!hidden) throw new Error("Expected a player-two action object.");
    const concealed = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      { type: "object-moved", objectId: hidden.id, from: hidden.zone, to: "field" },
      { type: "object-facing-changed", objectId: hidden.id, facing: "face-down" },
    ]).state;

    const snapshot = buildGrandArchiveHeuristicSnapshot(fixture.program, concealed, fixture.p1);
    expect(snapshot.opponentsField.map((card) => card.id)).not.toContain(hidden.id);
    expect(snapshot.visibleOpponentCards.map((card) => card.id)).not.toContain(hidden.id);
    const hiddenMove = snapshot.history.turn.find(
      (event) => event.name === "card-moved" && event.to === "field",
    );
    expect(hiddenMove).toBeDefined();
    expect(hiddenMove?.subjectId).toBeUndefined();

    const unknownBanished = Object.values(concealed.objects).find(
      (object) =>
        object.id !== hidden.id && object.ownerId === fixture.p2 && object.zone === "main-deck",
    );
    if (!unknownBanished) throw new Error("Expected another player-two Main Deck card.");
    const privatelyBanished = new GrandArchiveTransactionKernel().transact(concealed, [
      {
        type: "object-moved",
        objectId: unknownBanished.id,
        from: "main-deck",
        to: "banishment",
      },
      {
        type: "object-facing-changed",
        objectId: unknownBanished.id,
        facing: "face-down",
      },
    ]).state;
    expect(
      buildGrandArchiveHeuristicSnapshot(
        fixture.program,
        privatelyBanished,
        fixture.p2,
      ).banishment.map((card) => card.id),
    ).not.toContain(unknownBanished.id);
  });

  it("projects sanitized observable history in the native turn and phase windows", () => {
    const fixture = setup();
    const publicCard = fixture.runtime.state.zones[fixture.p1].hand[0];
    const championId = fixture.runtime.state.zones[fixture.p1].field[0];
    if (!publicCard || !championId) throw new Error("Expected a hand card and champion.");
    const state = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "object-moved",
        objectId: publicCard,
        from: "hand",
        to: "graveyard",
        actorId: fixture.p1,
      },
      { type: "phase-changed", phase: "end" },
      { type: "counter-changed", objectId: championId, counter: "buff", delta: 1 },
    ]).state;

    const history = buildGrandArchiveHeuristicSnapshot(fixture.program, state, fixture.p1).history;
    expect(history.turn).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "card-moved",
          actorId: fixture.p1,
          subjectId: publicCard,
          from: "hand",
          to: "graveyard",
        }),
        expect.objectContaining({ name: "phase-begins", phase: "end" }),
        expect.objectContaining({ name: "counter-added", subjectId: championId }),
      ]),
    );
    expect(history.phase.some((event) => event.name === "card-moved")).toBe(false);
    expect(history.phase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "phase-begins", phase: "end" }),
        expect.objectContaining({ name: "counter-added", subjectId: championId }),
      ]),
    );
    expect(history.combat).toBeNull();
    expect(history.resolution).toBeNull();
  });

  it("projects public combat roles for both attacking and defending policies", () => {
    const fixture = setup();
    const p1Champion = Object.values(fixture.runtime.state.objects).find(
      (object) =>
        object.controllerId === fixture.p1 &&
        object.zone === "field" &&
        object.definitionId === champion.canonicalId,
    );
    const p2Champion = Object.values(fixture.runtime.state.objects).find(
      (object) =>
        object.controllerId === fixture.p2 &&
        object.zone === "field" &&
        object.definitionId === champion.canonicalId,
    );
    if (!p1Champion || !p2Champion) throw new Error("Expected both starting champions.");
    const combat = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "combat-started",
        combat: {
          attackerId: p1Champion.id,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [p2Champion.id],
          retaliatorIds: [],
          retaliationOrderConfirmed: false,
          weaponIds: [],
          intentIds: [],
          step: "declaration",
        },
      },
    ]).state;

    expect(
      buildGrandArchiveHeuristicSnapshot(fixture.program, combat, fixture.p1).combat,
    ).toMatchObject({ actorIsAttackingPlayer: true, actorIsDefendingPlayer: false });
    expect(
      buildGrandArchiveHeuristicSnapshot(fixture.program, combat, fixture.p2).combat,
    ).toMatchObject({ actorIsAttackingPlayer: false, actorIsDefendingPlayer: true });
  });
});
