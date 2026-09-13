import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
  GrandArchivePrintedCost,
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
import { collectGrandArchiveStateBasedEvents } from "../state/state-based.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  options: {
    readonly cost?: GrandArchivePrintedCost;
    readonly elements?: readonly GrandArchiveElement[];
    readonly subtypes?: readonly string[];
    readonly speed?: "fast" | "slow";
  } = {},
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
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
        cost: options.cost ?? { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        speed: options.speed ?? (type === "ACTION" ? "fast" : undefined),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 1 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("action-rules-champion", "CHAMPION");
const filler = card("action-rules-filler", "ACTION");

function player(
  id: string,
  mainDeck: readonly { readonly definitionId: string; readonly count: number }[],
  extraMaterialDeck: readonly { readonly definitionId: string; readonly count: number }[] = [],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck,
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }, ...extraMaterialDeck],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function setup(
  cards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  p1Deck: readonly { readonly definitionId: string; readonly count: number }[],
  p1MaterialDeck: readonly { readonly definitionId: string; readonly count: number }[] = [],
) {
  const program = createGrandArchiveMatchProgram([champion, filler, ...cards]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        player("p1", p1Deck, p1MaterialDeck),
        player("p2", [{ definitionId: filler.canonicalId, count: 12 }]),
      ],
      firstPlayerId: "p1",
      randomSeed: 109,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, initial };
}

function objectId(
  state: ReturnType<typeof createGrandArchiveMatchInitialState>,
  definitionId: string,
) {
  const p1 = grandArchivePlayerId("p1");
  return Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === definitionId,
  )!.id;
}

describe("Grand Archive action-modifying rules", () => {
  it("activates a permitted material-deck object and applies its entry state", () => {
    const cauldron = card(
      "permission-material-object",
      "ITEM",
      [
        {
          id: "permission-material-object-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may activate this card from your material deck. It enters rested.",
          functionalZones: ["material-deck"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: { kind: "source" },
              fromZone: "material-deck",
              activationResult: { entryState: { state: "rested", value: true } },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
      { speed: "slow" },
    );
    const { program, initial } = setup(
      [cauldron],
      [{ definitionId: filler.canonicalId, count: 12 }],
      [{ definitionId: cauldron.canonicalId, count: 1 }],
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const cauldronId = objectId(initial, cauldron.canonicalId);
    const outsideSlowTiming = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "phase-changed", phase: "end" },
    ]).state;
    expect(
      new GrandArchiveMatchRuntime(program, outsideSlowTiming).execute(
        { move: "activate-card", cardId: cauldronId },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    const runtime = new GrandArchiveMatchRuntime(program, initial);

    const activation = runtime.execute(
      { move: "activate-card", cardId: cauldronId },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.objects[cauldronId]).toMatchObject({
      zone: "effects-stack",
      controllerId: p1,
    });
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[cauldronId]?.zone).toBe("field");
    expect(runtime.state.objects[cauldronId]?.states.has("rested")).toBe(true);
  });

  it("executes a permission's after-resolution consequence before default disposition", () => {
    const returningAction = card("permission-graveyard-action", "ACTION", [
      {
        id: "permissionGraveyardAction-a1",
        kind: "static",
        staticKind: "effects",
        text: "You may activate this card from your graveyard. Banish it as it resolves.",
        functionalZones: ["graveyard"],
        effects: [
          {
            kind: "rule-modification",
            mode: "allow",
            action: "activate",
            subject: { kind: "source" },
            fromZone: "graveyard",
            activationResult: {
              afterResolution: { kind: "banish-object", subject: { kind: "source" } },
            },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const { program, initial } = setup(
      [returningAction],
      [
        { definitionId: returningAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 11 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const actionId = objectId(initial, returningAction.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: actionId,
        from: initial.objects[actionId]!.zone,
        to: "graveyard",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(runtime.execute({ move: "activate-card", cardId: actionId }, { playerId: p1 }).ok).toBe(
      true,
    );
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[actionId]?.zone).toBe("banishment");
  });

  it("honors an Action's paid self-destination even when its required target makes it fizzle", () => {
    const departingAction = card("fizzled-specified-destination-action", "ACTION", [
      {
        id: "fizzledSpecifiedDestinationAction-a1",
        kind: "card-resolution",
        text: "As an additional cost, you may pay (0). If you do, banish this card as it resolves. Banish target card from a graveyard.",
        additionalCost: {
          kind: "optional",
          cost: { kind: "pay-reserve", amount: 0 },
          bindPaidAs: "paid-self-banish",
        },
        targets: [
          {
            id: "target-graveyard-card",
            kind: "target",
            declared: "announcement",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            unique: true,
            candidates: { kind: "card", zones: ["graveyard"] },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "conditional",
              condition: { kind: "paid-cost", binding: "paid-self-banish" },
              then: { kind: "banish-object", subject: { kind: "source" } },
            },
            {
              kind: "banish-object",
              subject: { kind: "bound", binding: "target-graveyard-card" },
            },
          ],
        },
      },
    ]);
    const { program, initial } = setup(
      [departingAction],
      [
        { definitionId: departingAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 11 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const actionId = objectId(initial, departingAction.canonicalId);
    const targetId = objectId(initial, filler.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      {
        type: "object-moved",
        objectId: actionId,
        from: initial.objects[actionId]!.zone,
        to: "hand",
      },
      {
        type: "object-moved",
        objectId: targetId,
        from: initial.objects[targetId]!.zone,
        to: "graveyard",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: actionId,
        targets: { "target-graveyard-card": [targetId] },
        payOptionalCost: true,
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    const targetDeparted = kernel.transact(runtime.state, [
      {
        type: "object-moved",
        objectId: targetId,
        from: "graveyard",
        to: "banishment",
      },
    ]).state;
    const fizzled = kernel.transact(
      targetDeparted,
      collectGrandArchiveStateBasedEvents(program, targetDeparted),
    ).state;
    expect(fizzled.stack).toEqual([]);
    const disposition = collectGrandArchiveStateBasedEvents(program, fizzled);
    expect(disposition).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: actionId,
        from: "effects-stack",
        to: "banishment",
        effectSpecified: true,
      }),
    ]);
    const completed = kernel.transact(fizzled, disposition).state;
    expect(completed.objects[actionId]?.zone).toBe("banishment");
  });

  it("applies an activation result only when its replacement cost is selected", () => {
    const alternateCostAction = card(
      "replacement-result-action",
      "ACTION",
      [
        {
          id: "replacementResultAction-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may pay (0) instead. When you do, banish this card as it resolves.",
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: { kind: "source" },
              costKind: "reserve",
              cost: { kind: "pay-reserve", amount: 0 },
              activationResult: {
                afterResolution: { kind: "banish-object", subject: { kind: "source" } },
              },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
      { cost: { kind: "reserve", amount: 1 } },
    );
    const { program, initial } = setup(
      [alternateCostAction],
      [
        { definitionId: alternateCostAction.canonicalId, count: 2 },
        { definitionId: filler.canonicalId, count: 10 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const actionIds = Object.values(initial.objects)
      .filter(
        (object) =>
          object.ownerId === p1 && object.definitionId === alternateCostAction.canonicalId,
      )
      .map((object) => object.id);
    const paymentId = objectId(initial, filler.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      ...actionIds.map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: initial.objects[id]!.zone,
        to: "hand" as const,
      })),
      {
        type: "object-moved",
        objectId: paymentId,
        from: initial.objects[paymentId]!.zone,
        to: "hand",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        { move: "activate-card", cardId: actionIds[0]!, costOptionIndex: 1 },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[actionIds[0]!]?.zone).toBe("banishment");

    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: actionIds[1]!,
          costOptionIndex: 0,
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[actionIds[1]!]?.zone).toBe("graveyard");
  });

  it("consumes a next-matching activation permission exactly once", () => {
    const rangerAlly = card("next-permission-ranger", "ALLY", [], { subtypes: ["RANGER"] });
    const { program, initial } = setup(
      [rangerAlly],
      [
        { definitionId: rangerAlly.canonicalId, count: 2 },
        { definitionId: filler.canonicalId, count: 10 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const allyIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === rangerAlly.canonicalId)
      .map((object) => object.id);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "rule-modification-created",
        modification: {
          id: "next-ranger-enters-distant",
          controllerId: p1,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate",
            subject: { kind: "player", player: "controller" },
            filter: {
              kind: "all",
              filters: [
                { kind: "type", oneOf: ["ALLY"] },
                { kind: "subtype", oneOf: ["RANGER"] },
              ],
            },
            occurrence: { count: 1, window: "this-turn", actorScope: "same-player" },
            activationResult: { entryState: { state: "distant", value: true } },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: { kind: "this-turn" },
            },
          },
          bindings: {},
          variables: {},
          durationAnchors: { expires: {} },
          createdAtVersion: initial.stateVersion,
          createdTurnNumber: initial.turn.number,
          createdPhase: initial.turn.phase,
        },
      },
      ...allyIds.map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: initial.objects[id]!.zone,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute({ move: "activate-card", cardId: allyIds[0]! }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.state.ruleModifications).toHaveLength(0);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyIds[0]!]?.states.has("distant")).toBe(true);

    expect(
      runtime.execute({ move: "activate-card", cardId: allyIds[1]! }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[allyIds[1]!]?.states.has("distant")).toBe(false);
  });

  it("enforces self requirements and global non-advanced activation prohibitions", () => {
    const phaseLocked = card("require-end-phase", "ACTION", [
      {
        id: "require-end-phase-a1",
        kind: "static",
        staticKind: "effects",
        text: "Activate this card only during your end phase.",
        effects: [
          {
            kind: "rule-modification",
            mode: "require",
            action: "activate",
            subject: { kind: "source" },
            condition: {
              kind: "all",
              conditions: [
                { kind: "phase", phase: "end" },
                { kind: "turn-player", player: "controller" },
              ],
            },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const prohibition = card("non-advanced-prohibition", "DOMAIN", [
      {
        id: "nonAdvancedProhibition-a1",
        kind: "static",
        staticKind: "effects",
        text: "Players can't activate non-advanced element cards.",
        effects: [
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "activate",
            filter: { kind: "element-category", value: "non-advanced" },
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const { program, initial } = setup(
      [phaseLocked, prohibition],
      [
        { definitionId: phaseLocked.canonicalId, count: 1 },
        { definitionId: prohibition.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 10 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const actionId = objectId(initial, phaseLocked.canonicalId);
    const prohibitionId = objectId(initial, prohibition.canonicalId);
    const inHand = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: actionId,
        from: initial.objects[actionId]!.zone,
        to: "hand",
      },
    ]).state;
    const requirementRuntime = new GrandArchiveMatchRuntime(program, inHand);
    const wrongPhase = requirementRuntime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: p1 },
    );
    expect(wrongPhase.ok).toBe(false);
    if (!wrongPhase.ok) expect(wrongPhase.message).toContain("requirement");

    const prohibited = new GrandArchiveTransactionKernel().transact(inHand, [
      { type: "phase-changed", phase: "end" },
      {
        type: "object-moved",
        objectId: prohibitionId,
        from: inHand.objects[prohibitionId]!.zone,
        to: "field",
      },
    ]).state;
    const prohibitionRuntime = new GrandArchiveMatchRuntime(program, prohibited);
    const forbidden = prohibitionRuntime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: p1 },
    );
    expect(forbidden.ok).toBe(false);
    if (!forbidden.ok) expect(forbidden.message).toContain("forbidden");
  });

  it("lets an explicit fast-activation rule override a slow card's timing", () => {
    const slowAction = card("fast-permission-slow-action", "ACTION", [], { speed: "slow" });
    const enabler = card("fast-permission-enabler", "ITEM", [
      {
        id: "fast-permission-enabler-a1",
        kind: "static",
        staticKind: "effects",
        text: "You may activate Mage action cards at fast speed.",
        effects: [
          {
            kind: "rule-modification",
            mode: "allow",
            action: "activate-fast",
            subject: { kind: "player", player: "controller" },
            filter: { kind: "type", oneOf: ["ACTION"] },
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const { program, initial } = setup(
      [slowAction, enabler],
      [
        { definitionId: slowAction.canonicalId, count: 1 },
        { definitionId: enabler.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 10 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const actionId = objectId(initial, slowAction.canonicalId);
    const enablerId = objectId(initial, enabler.canonicalId);
    const outsideSlowTiming = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: actionId,
        from: initial.objects[actionId]!.zone,
        to: "hand",
      },
      { type: "phase-changed", phase: "end" },
    ]).state;
    const withoutPermission = new GrandArchiveMatchRuntime(program, outsideSlowTiming);
    expect(
      withoutPermission.execute({ move: "activate-card", cardId: actionId }, { playerId: p1 }).ok,
    ).toBe(false);

    const prepared = new GrandArchiveTransactionKernel().transact(outsideSlowTiming, [
      {
        type: "object-moved",
        objectId: enablerId,
        from: outsideSlowTiming.objects[enablerId]!.zone,
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(runtime.execute({ move: "activate-card", cardId: actionId }, { playerId: p1 }).ok).toBe(
      true,
    );
  });

  it("forbids matching activated abilities without blocking unrelated abilities", () => {
    const frenzyAlly = card(
      "ability-rule-frenzy-ally",
      "ALLY",
      [
        {
          id: "abilityRuleFrenzyAlly-a1",
          kind: "activated",
          activation: "ability",
          text: "(0): Wake this ally.",
          cost: { kind: "pay-reserve", amount: 0 },
          effect: { kind: "wake", subject: { kind: "source" } },
        },
      ],
      { subtypes: ["FRENZY"] },
    );
    const blocker = card("ability-rule-blocker", "DOMAIN", [
      {
        id: "ability-rule-blocker-a1",
        kind: "static",
        staticKind: "effects",
        text: "Players can't activate abilities of Frenzy allies.",
        effects: [
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "activate",
            activationKind: "ability",
            filter: { kind: "subtype", oneOf: ["FRENZY"] },
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const { program, initial } = setup(
      [frenzyAlly, blocker],
      [
        { definitionId: frenzyAlly.canonicalId, count: 1 },
        { definitionId: blocker.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 10 },
      ],
    );
    const p1 = grandArchivePlayerId("p1");
    const allyId = objectId(initial, frenzyAlly.canonicalId);
    const blockerId = objectId(initial, blocker.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: allyId,
        from: initial.objects[allyId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: blockerId,
        from: initial.objects[blockerId]!.zone,
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const before = runtime.state;
    const result = runtime.execute(
      {
        move: "activate-ability",
        sourceId: allyId,
        abilityId: "abilityRuleFrenzyAlly-a1",
      },
      { playerId: p1 },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("forbidden");
    expect(runtime.state).toBe(before);
  });
});
