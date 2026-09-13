import {
  burstAsunder,
  foundPower,
  glacierRemnants,
  hemofluxDrain,
  malevolentVow,
  revitalizingCleanse,
  siphoningStab,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCardResolution,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import type { GrandArchiveCommand } from "../../commands/commands.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import { grandArchivePlayerId, type GrandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";

type TestCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
type TestEffectAbility = Pick<
  GrandArchiveCardResolution,
  "text" | "variables" | "targets" | "effect"
>;

function resolutionAbility(card: TestCard, abilityId: string): TestEffectAbility {
  const faces =
    card.layout.kind === "single-faced"
      ? [card.layout.face]
      : [card.layout.defaultFace, card.layout.flipFace];
  const ability = faces.flatMap((face) => face.abilities).find((entry) => entry.id === abilityId);
  if (
    !ability ||
    (ability.kind !== "card-resolution" &&
      !(ability.kind === "triggered" && "effect" in ability && ability.effect))
  ) {
    throw new Error(`Missing card-resolution ability ${abilityId}`);
  }
  return ability;
}

function supportCard(
  id: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly name?: string;
    readonly subtypes?: readonly string[];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
  } = {},
): TestCard {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: options.name ?? id,
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 20 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

function setup(
  catalogResolution: TestEffectAbility,
  extras: readonly { readonly card: TestCard; readonly count: number }[] = [],
) {
  const abilityId = "modifiedResultAbility-a1";
  const champion = supportCard(`${abilityId}:champion`, "CHAMPION");
  if (champion.layout.kind !== "single-faced") throw new Error("Expected a single-faced champion");
  const source: TestCard = {
    ...champion,
    layout: {
      ...champion.layout,
      face: {
        ...champion.layout.face,
        abilities: [
          {
            id: abilityId,
            kind: "activated",
            activation: "ability",
            speed: "fast",
            text: catalogResolution.text,
            cost: { kind: "pay-reserve", amount: 0 },
            ...(catalogResolution.variables ? { variables: catalogResolution.variables } : {}),
            ...(catalogResolution.targets ? { targets: catalogResolution.targets } : {}),
            effect: catalogResolution.effect,
          },
        ],
      },
    },
  };
  const filler = supportCard(`${abilityId}:filler`, "ACTION");
  const program = createGrandArchiveMatchProgram([
    source,
    filler,
    ...extras.map((entry) => entry.card),
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(id === "p1"
        ? extras.map((entry) => ({ definitionId: entry.card.canonicalId, count: entry.count }))
        : []),
    ],
    materialDeck: [{ definitionId: source.canonicalId, count: 1 }],
    startingChampionDefinitionId: source.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 739,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const objects = (
    match: GrandArchiveMatchState,
    ownerId: GrandArchivePlayerId,
    definitionId: string,
  ) =>
    Object.values(match.objects).filter(
      (object) => object.ownerId === ownerId && object.definitionId === definitionId,
    );
  return {
    program,
    state,
    p1,
    p2,
    abilityId,
    sourceId: state.zones[p1].field[0]!,
    objects,
  };
}

function activateAndResolve(
  runtime: GrandArchiveMatchRuntime,
  playerId: GrandArchivePlayerId,
  sourceId: ReturnType<typeof setup>["sourceId"],
  abilityId: string,
  targets?: NonNullable<
    Extract<GrandArchiveCommand, { readonly move: "activate-ability" }>["targets"]
  >,
): void {
  expect(
    runtime.execute(
      { move: "activate-ability", sourceId, abilityId, ...(targets ? { targets } : {}) },
      { playerId },
    ).ok,
  ).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
  const opponentId = runtime.state.turnOrder.find((candidate) => candidate !== playerId)!;
  expect(runtime.execute({ move: "pass" }, { playerId: opponentId }).ok).toBe(true);
}

describe("Grand Archive modified instruction results", () => {
  it("derives Hemoflux Drain's X from damage actually dealt", () => {
    const target = supportCard("modified-result-damage-target", "ALLY");
    const fixture = setup(resolutionAbility(hemofluxDrain, "zHhOcG9MfK-a2"), [
      { card: target, count: 1 },
    ]);
    const targetObject = fixture.objects(fixture.state, fixture.p1, target.canonicalId)[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetObject.id, from: targetObject.zone, to: "field" },
      { type: "counter-changed", objectId: fixture.sourceId, counter: "level", delta: 3 },
      { type: "damage-marked", objectId: fixture.sourceId, amount: 5 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId, {
      "target-1": [targetObject.id],
    });

    expect(runtime.state.objects[targetObject.id]?.damage).toBe(3);
    expect(runtime.state.objects[fixture.sourceId]?.damage).toBe(2);
  });

  it("derives Glacier Remnants' X from counters actually removed", () => {
    const fixture = setup(resolutionAbility(glacierRemnants, "vftUL7ZjFM-a1"));
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "counter-changed", objectId: fixture.sourceId, counter: "durability", delta: 2 },
      { type: "damage-marked", objectId: fixture.sourceId, amount: 5 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId);

    expect(runtime.state.objects[fixture.sourceId]?.counters.durability ?? 0).toBe(0);
    expect(runtime.state.objects[fixture.sourceId]?.damage).toBe(3);
  });

  it("draws exactly the cards Found Power moved by its discard instruction", () => {
    const crest = supportCard("modified-result-crest", "ITEM", {
      name: "Proto Key Crest",
      subtypes: ["CREST"],
    });
    const handCard = supportCard("modified-result-hand-card", "ACTION");
    const fixture = setup(resolutionAbility(foundPower, "8pIXnuI1Df-a1"), [
      { card: crest, count: 1 },
      { card: handCard, count: 2 },
    ]);
    const crestObject = fixture.objects(fixture.state, fixture.p1, crest.canonicalId)[0]!;
    const handObjects = fixture.objects(fixture.state, fixture.p1, handCard.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: crestObject.id, from: crestObject.zone, to: "field" },
      ...handObjects.map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "hand",
        }),
      ),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Found Power's discard choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: handObjects.map((object) => object.id),
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    expect(runtime.state.zones[fixture.p1].graveyard).toEqual(
      expect.arrayContaining(handObjects.map((object) => object.id)),
    );
    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(2);
  });

  it("uses the post-replacement move count when a selected discard is prevented", () => {
    const crest = supportCard("prevented-discard-crest", "ITEM", {
      name: "Proto Key Crest",
      subtypes: ["CREST"],
    });
    const preventerBase = supportCard("prevented-discard-source", "ITEM");
    if (preventerBase.layout.kind !== "single-faced") {
      throw new Error("Expected a single-faced replacement source");
    }
    const preventer: TestCard = {
      ...preventerBase,
      layout: {
        ...preventerBase.layout,
        face: {
          ...preventerBase.layout.face,
          abilities: [
            {
              id: "preventSelectedDiscard-a1",
              kind: "static",
              staticKind: "effects",
              text: "You may prevent a card from being discarded.",
              effects: [
                {
                  kind: "replacement",
                  event: { name: "card-discarded", actor: "controller" },
                  optionalFor: "controller",
                  operation: { kind: "prevent" },
                  duration: { kind: "while-source-on-field" },
                },
              ],
            },
          ],
        },
      },
    };
    const handCard = supportCard("prevented-discard-card", "ACTION");
    const fixture = setup(resolutionAbility(foundPower, "8pIXnuI1Df-a1"), [
      { card: crest, count: 1 },
      { card: preventer, count: 1 },
      { card: handCard, count: 1 },
    ]);
    const crestObject = fixture.objects(fixture.state, fixture.p1, crest.canonicalId)[0]!;
    const preventerObject = fixture.objects(fixture.state, fixture.p1, preventer.canonicalId)[0]!;
    const handObject = fixture.objects(fixture.state, fixture.p1, handCard.canonicalId)[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: crestObject.id, from: crestObject.zone, to: "field" },
      {
        type: "object-moved",
        objectId: preventerObject.id,
        from: preventerObject.zone,
        to: "field",
      },
      { type: "object-moved", objectId: handObject.id, from: handObject.zone, to: "hand" },
    ]).state;
    const mainDeckBefore = prepared.zones[fixture.p1]["main-deck"].length;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId);
    const discard = runtime.state.decision;
    if (!discard || discard.kind !== "resolve-effect-choice") {
      throw new Error("Expected Found Power's discard choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: discard.id,
          stateVersion: discard.stateVersion,
          answer: [handObject.id],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    const replacement = runtime.state.decision;
    if (!replacement || replacement.kind !== "choose-replacement") {
      throw new Error("Expected the optional discard replacement");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: replacement.id,
          stateVersion: replacement.stateVersion,
          answer: true,
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    expect(runtime.state.objects[handObject.id]?.zone).toBe("hand");
    expect(runtime.state.zones[fixture.p1]["main-deck"]).toHaveLength(mainDeckBefore);
  });

  it("repeats Burst Asunder's damage once per object actually sacrificed", () => {
    const target = supportCard("modified-result-burst-target", "ALLY");
    const fractal = supportCard("modified-result-fractal", "ALLY", { subtypes: ["FRACTAL"] });
    const fixture = setup(resolutionAbility(burstAsunder, "rzsr6aw4hz-a2"), [
      { card: target, count: 1 },
      { card: fractal, count: 2 },
    ]);
    const targetObject = fixture.objects(fixture.state, fixture.p1, target.canonicalId)[0]!;
    const fractals = fixture.objects(fixture.state, fixture.p1, fractal.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: targetObject.id, from: targetObject.zone, to: "field" },
      ...fractals.map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "field",
        }),
      ),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId, {
      "target-unit": [targetObject.id],
    });
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Burst Asunder's sacrifice choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: fractals.map((object) => object.id),
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    expect(runtime.state.objects[targetObject.id]?.damage).toBe(6);
    expect(runtime.state.zones[fixture.p1].graveyard).toEqual(
      expect.arrayContaining(fractals.map((object) => object.id)),
    );
  });

  it("counts only Water cards Revitalizing Cleanse actually revealed", () => {
    const waterCard = supportCard("revealed-water-card", "ACTION", { elements: ["WATER"] });
    const normCard = supportCard("revealed-norm-card", "ACTION");
    const fixture = setup(resolutionAbility(revitalizingCleanse, "1BkfdFqCrG-a1"), [
      { card: waterCard, count: 2 },
      { card: normCard, count: 1 },
    ]);
    const memoryCards = [
      ...fixture.objects(fixture.state, fixture.p1, waterCard.canonicalId),
      ...fixture.objects(fixture.state, fixture.p1, normCard.canonicalId),
    ];
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...memoryCards.map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "memory",
        }),
      ),
      { type: "damage-marked", objectId: fixture.sourceId, amount: 5 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId);

    expect(runtime.state.objects[fixture.sourceId]?.damage).toBe(3);
  });

  it("refreshes Malevolent Vow's nested derived X after its discard instruction", () => {
    const catalogAbility = resolutionAbility(malevolentVow, "up6fw61vf1-a1");
    if (catalogAbility.effect.kind !== "sequence") {
      throw new Error("Expected Malevolent Vow's resolution sequence");
    }
    const [discard, recover] = catalogAbility.effect.effects;
    if (!discard || !recover) throw new Error("Expected discard and recovery instructions");
    const discardAndRecover: TestEffectAbility = {
      ...catalogAbility,
      effect: {
        kind: "sequence",
        effects: [discard, recover],
      },
    };
    const handCard = supportCard("malevolent-vow-hand-card", "ACTION");
    const fixture = setup(discardAndRecover, [{ card: handCard, count: 2 }]);
    const handObjects = fixture.objects(fixture.state, fixture.p1, handCard.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...handObjects.map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "hand",
        }),
      ),
      { type: "damage-marked", objectId: fixture.sourceId, amount: 10 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    activateAndResolve(runtime, fixture.p1, fixture.sourceId, fixture.abilityId);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Malevolent Vow's discard choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: handObjects.map((object) => object.id),
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    expect(runtime.state.objects[fixture.sourceId]?.damage).toBe(1);
  });

  it("carries Siphoning Stab's actual hit damage into its granted On Hit trigger", () => {
    if (siphoningStab.layout.kind !== "single-faced") {
      throw new Error("Expected Siphoning Stab to be single-faced");
    }
    const staticAbility = siphoningStab.layout.face.abilities[0];
    const continuous =
      staticAbility?.kind === "static" && staticAbility.staticKind === "effects"
        ? staticAbility.effects[0]
        : undefined;
    const onHit =
      continuous?.kind === "continuous" && continuous.change.kind === "grant-ability"
        ? continuous.change.ability
        : undefined;
    if (onHit?.kind !== "triggered" || !("effect" in onHit) || !onHit.effect) {
      throw new Error("Missing Siphoning Stab's granted On Hit ability");
    }

    const sourceBase = supportCard("modified-result-hit-source", "CHAMPION");
    if (sourceBase.layout.kind !== "single-faced") {
      throw new Error("Expected a single-faced source");
    }
    const source: TestCard = {
      ...sourceBase,
      layout: {
        ...sourceBase.layout,
        face: { ...sourceBase.layout.face, abilities: [onHit] },
      },
    };
    const target = supportCard("modified-result-hit-target", "ALLY");
    const filler = supportCard("modified-result-hit-filler", "ACTION");
    const program = createGrandArchiveMatchProgram([source, target, filler]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 8 },
        ...(id === "p2" ? [{ definitionId: target.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [{ definitionId: source.canonicalId, count: 1 }],
      startingChampionDefinitionId: source.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 740,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = initial.zones[p1].field[0]!;
    const targetObject = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === target.canonicalId,
    );
    if (!targetObject) throw new Error("Missing hit target");
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      { type: "object-moved", objectId: targetObject.id, from: targetObject.zone, to: "field" },
      { type: "damage-marked", objectId: sourceId, amount: 5 },
    ]).state;
    const hit = kernel.transact(positioned, [
      {
        type: "damage-marked",
        objectId: targetObject.id,
        amount: 3,
        sourceId,
        combatDamage: true,
        combatParticipantIds: [sourceId],
      },
    ]);
    const pending = collectGrandArchiveTriggeredAbilityEvents(
      program,
      hit.state,
      hit.result.events,
    ).find(
      (event) => event.type === "pending-trigger-added" && event.trigger.ability.id === onHit.id,
    );
    if (!pending || pending.type !== "pending-trigger-added") {
      throw new Error("Expected Siphoning Stab's On Hit trigger");
    }

    expect(pending.trigger.bindings["modifiedResult:damage-dealt"]).toBe(3);
  });
});
