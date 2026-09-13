import { pantheonBarrier, starlitApothecary } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveObjectId, grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION" | "GREATER BOON" | "LESSER BOON" | "PHANTASIA",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("effect-payment-champion", "CHAMPION");
const filler = card("effect-payment-filler", "ACTION");
const lesserBoon = card("effect-payment-lesser-boon", "LESSER BOON");
const greaterBoon = card("effect-payment-greater-boon", "GREATER BOON");
const barrier = pantheonBarrier;

function starlitApothecaryPaymentEffect(): GrandArchiveEffect {
  if (starlitApothecary.layout.kind !== "single-faced") {
    throw new Error("Starlit Apothecary must be single-faced");
  }
  const ability = starlitApothecary.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "sequence") {
    throw new Error("Starlit Apothecary must have its recollection sequence");
  }
  const effect = ability.effect.effects[0];
  if (effect?.kind !== "unless-paid" || effect.player !== "any-opponent-in-turn-order") {
    throw new Error("Starlit Apothecary must ask opponents to pay in turn order");
  }
  return effect;
}

function sourceCard(
  effect: GrandArchiveEffect,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return card("effect-payment-source", "ACTION", [
    {
      id: "effectPaymentSource-a1",
      kind: "card-resolution",
      text: "Resolve the test payment.",
      effect,
    },
  ]);
}

function setup(effect: GrandArchiveEffect): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly sourceId: GrandArchiveObjectId;
  readonly paymentId: GrandArchiveObjectId;
  readonly championId: GrandArchiveObjectId;
} {
  const source = sourceCard(effect);
  const program = createGrandArchiveMatchProgram([champion, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 9 },
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
      randomSeed: 921,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  )!;
  const paymentObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
  )!;
  const championObject = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p1 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "field",
  )!;
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    ...(sourceObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: sourceObject.id,
            from: sourceObject.zone,
            to: "hand" as const,
          },
        ]),
    ...(paymentObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: paymentObject.id,
            from: paymentObject.zone,
            to: "hand" as const,
          },
        ]),
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    sourceId: sourceObject.id,
    paymentId: paymentObject.id,
    championId: championObject.id,
  };
}

function setupPantheon(effect: GrandArchiveEffect) {
  const source = sourceCard(effect);
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    source,
    lesserBoon,
    greaterBoon,
    barrier,
  ]);
  const player = (id: "p1" | "p2" | "p3"): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 10 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
    pantheon: {
      lesserBoonDefinitionId: lesserBoon.canonicalId,
      greaterBoonDefinitionId: greaterBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "pantheon",
      players: [player("p1"), player("p2"), player("p3")],
      firstPlayerId: "p1",
      randomSeed: 922,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const p3 = grandArchivePlayerId("p3");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  )!;
  const paymentsByPlayer = Object.fromEntries(
    [p2, p3].map((playerId) => {
      const payments = Object.values(initial.objects)
        .filter(
          (object) => object.ownerId === playerId && object.definitionId === filler.canonicalId,
        )
        .slice(0, 4);
      if (payments.length !== 4) throw new Error(`Missing payment objects for ${playerId}`);
      return [playerId, payments] as const;
    }),
  );
  const championObject = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p1 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "field",
  )!;
  const positioned = [sourceObject, ...paymentsByPlayer[p2]!, ...paymentsByPlayer[p3]!].flatMap(
    (object) =>
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
  );
  const prepared = new GrandArchiveTransactionKernel().transact(initial, positioned).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    p3,
    sourceId: sourceObject.id,
    p2PaymentIds: paymentsByPlayer[p2]!.map((object) => object.id),
    p3PaymentIds: paymentsByPlayer[p3]!.map((object) => object.id),
    championId: championObject.id,
  };
}

function resolveToDecision(
  runtime: GrandArchiveMatchRuntime,
  sourceId: GrandArchiveObjectId,
): void {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: p1 }).ok).toBe(
    true,
  );
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
  expect(runtime.state.decision?.playerId).toBe(p1);
}

function resolveToPantheonDecision(
  runtime: GrandArchiveMatchRuntime,
  sourceId: GrandArchiveObjectId,
): void {
  const players = ["p1", "p2", "p3"].map(grandArchivePlayerId);
  expect(
    runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: players[0]! }).ok,
  ).toBe(true);
  for (const playerId of players) {
    const passed = runtime.execute({ move: "pass" }, { playerId });
    if (!passed.ok) throw new Error(passed.message);
  }
  expect(runtime.state.decision?.playerId).toBe(players[1]);
}

function answer(runtime: GrandArchiveMatchRuntime, answerValue: unknown) {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected an effect payment decision");
  return runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: answerValue,
    },
    { playerId: decision.playerId },
  );
}

const damageChampion: GrandArchiveEffect = {
  kind: "deal-damage",
  source: { kind: "source" },
  recipient: { kind: "champion", player: "controller" },
  amount: 2,
};

const markChampion: GrandArchiveEffect = {
  kind: "add-counter",
  subject: { kind: "champion", player: "controller" },
  counter: "buff",
  amount: 2,
};

describe("Grand Archive resolution-time effect payments", () => {
  it("requires a mandatory payment, survives a snapshot, and resumes its paid continuation", () => {
    const fixture = setup({
      kind: "pay",
      player: "controller",
      cost: { kind: "pay-reserve", amount: 1 },
      then: damageChampion,
    });
    resolveToDecision(fixture.runtime, fixture.sourceId);
    expect(fixture.runtime.state.decision).toMatchObject({ kind: "resolve-effect-payment" });

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const declined = answer(restored, false);
    expect(declined.ok).toBe(false);
    expect(restored.state.decision).toMatchObject({ kind: "resolve-effect-payment" });

    const pendingDecision = restored.state.decision!;
    const paymentCommand = listGrandArchiveLegalCommands(
      fixture.program,
      restored.state,
      pendingDecision.playerId,
    ).find((candidate) => JSON.stringify(candidate.command).includes(fixture.paymentId));
    if (!paymentCommand) {
      throw new Error(
        `Legal commands omitted the mandatory reserve payment: ${JSON.stringify(
          listGrandArchiveLegalCommands(fixture.program, restored.state, pendingDecision.playerId),
        )}`,
      );
    }
    const paid = restored.execute(paymentCommand.command, { playerId: pendingDecision.playerId });
    if (!paid.ok) throw new Error(paid.message);
    expect(restored.state.objects[fixture.paymentId]?.zone).toBe("memory");
    expect(restored.state.objects[fixture.championId]?.damage).toBe(2);
    expect(restored.state.objects[fixture.sourceId]?.zone).toBe("graveyard");
    expect(restored.state.decision).toBeNull();
  });

  it("lets an unless payment be declined and performs only its alternate branch", () => {
    const fixture = setup({
      kind: "unless-paid",
      player: "controller",
      cost: { kind: "pay-reserve", amount: 1 },
      otherwise: damageChampion,
    });
    resolveToDecision(fixture.runtime, fixture.sourceId);
    const declined = answer(fixture.runtime, false);
    if (!declined.ok) throw new Error(declined.message);

    expect(fixture.runtime.state.objects[fixture.paymentId]?.zone).toBe("hand");
    expect(fixture.runtime.state.objects[fixture.championId]?.damage).toBe(2);
  });

  it("suppresses the alternate branch after payment and rolls back an illegal payment", () => {
    const fixture = setup({
      kind: "unless-paid",
      player: "controller",
      cost: { kind: "pay-reserve", amount: 1 },
      otherwise: damageChampion,
    });
    resolveToDecision(fixture.runtime, fixture.sourceId);
    const stateBeforeIllegalPayment = serializeGrandArchiveMatchSnapshot(fixture.runtime.state);
    const illegal = answer(fixture.runtime, {
      reservePayment: [{ kind: "card", cardId: grandArchiveObjectId("missing-payment") }],
    });
    expect(illegal.ok).toBe(false);
    expect(serializeGrandArchiveMatchSnapshot(fixture.runtime.state)).toEqual(
      stateBeforeIllegalPayment,
    );

    const paid = answer(fixture.runtime, {
      reservePayment: [{ kind: "card", cardId: fixture.paymentId }],
    });
    if (!paid.ok) throw new Error(paid.message);
    expect(fixture.runtime.state.objects[fixture.paymentId]?.zone).toBe("memory");
    expect(fixture.runtime.state.objects[fixture.championId]?.damage).toBe(0);
  });

  it("asks each opponent in turn order until one pays and survives between decisions", () => {
    const fixture = setupPantheon(starlitApothecaryPaymentEffect());
    resolveToPantheonDecision(fixture.runtime, fixture.sourceId);
    expect(fixture.runtime.state.decision?.playerId).toBe(fixture.p2);

    const firstDeclined = answer(fixture.runtime, false);
    if (!firstDeclined.ok) throw new Error(firstDeclined.message);
    expect(fixture.runtime.state.decision).toMatchObject({
      kind: "resolve-effect-payment",
      playerId: fixture.p3,
    });

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const paid = answer(restored, {
      reservePayment: fixture.p3PaymentIds.map((cardId) => ({ kind: "card" as const, cardId })),
    });
    if (!paid.ok) throw new Error(paid.message);

    expect(
      fixture.p2PaymentIds.every((cardId) => restored.state.objects[cardId]?.zone === "hand"),
    ).toBe(true);
    expect(restored.state.zones[fixture.p3].memory).toHaveLength(4);
    expect(restored.state.objects[fixture.championId]?.counters.buff).toBeUndefined();
    expect(restored.state.decision).toBeNull();
  });

  it("performs the alternate branch only after every opponent declines", () => {
    const fixture = setupPantheon({
      kind: "unless-paid",
      player: "any-opponent-in-turn-order",
      cost: { kind: "pay-reserve", amount: 1 },
      otherwise: markChampion,
    });
    resolveToPantheonDecision(fixture.runtime, fixture.sourceId);

    for (const playerId of [fixture.p2, fixture.p3]) {
      expect(fixture.runtime.state.decision?.playerId).toBe(playerId);
      const declined = answer(fixture.runtime, false);
      if (!declined.ok) throw new Error(declined.message);
    }

    expect(fixture.runtime.state.objects[fixture.championId]?.counters.buff).toBe(2);
    expect(
      [...fixture.p2PaymentIds, ...fixture.p3PaymentIds].every(
        (cardId) => fixture.runtime.state.objects[cardId]?.zone === "hand",
      ),
    ).toBe(true);
    expect(fixture.runtime.state.decision).toBeNull();
  });
});

describe("Grand Archive unless-performed effects", () => {
  it("lets the named player perform the alternative or decline into the default effect", () => {
    const effect: GrandArchiveEffect = {
      kind: "unless-performed",
      player: "controller",
      alternative: damageChampion,
      otherwise: {
        ...damageChampion,
        amount: 5,
      },
    };
    const accepted = setup(effect);
    resolveToDecision(accepted.runtime, accepted.sourceId);
    expect(accepted.runtime.state.decision).toMatchObject({ kind: "resolve-optional-effect" });
    const acceptedResult = answer(accepted.runtime, true);
    if (!acceptedResult.ok) throw new Error(acceptedResult.message);
    expect(accepted.runtime.state.objects[accepted.championId]?.damage).toBe(2);

    const declined = setup(effect);
    resolveToDecision(declined.runtime, declined.sourceId);
    const declinedResult = answer(declined.runtime, false);
    if (!declinedResult.ok) throw new Error(declinedResult.message);
    expect(declined.runtime.state.objects[declined.championId]?.damage).toBe(5);
  });

  it("performs the default effect when an accepted alternative does not perform an action", () => {
    const fixture = setup({
      kind: "unless-performed",
      player: "controller",
      alternative: { kind: "no-op" },
      otherwise: damageChampion,
    });
    resolveToDecision(fixture.runtime, fixture.sourceId);
    const result = answer(fixture.runtime, true);
    if (!result.ok) throw new Error(result.message);
    expect(fixture.runtime.state.objects[fixture.championId]?.damage).toBe(2);
  });

  it("does not partially perform an alternative that removes a fixed number of counters", () => {
    const fixture = setup({
      kind: "unless-performed",
      player: "controller",
      alternative: {
        kind: "remove-counter",
        subject: { kind: "champion", player: "controller" },
        counter: { named: "battle" },
        amount: 2,
      },
      otherwise: damageChampion,
    });
    const withOneCounter = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "counter-changed",
        objectId: fixture.championId,
        counter: "named:battle",
        delta: 1,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, withOneCounter);
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      runtime.execute({ move: "activate-card", cardId: fixture.sourceId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[fixture.championId]?.counters["named:battle"]).toBe(1);
    expect(runtime.state.objects[fixture.championId]?.damage).toBe(2);
  });

  it("tracks an interactive alternative across its choice decision and a snapshot", () => {
    const fixture = setup({
      kind: "unless-performed",
      player: "controller",
      alternative: {
        kind: "choose",
        selection: {
          id: "discarded-alternative",
          kind: "choice",
          declared: "resolution",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          unique: true,
          candidates: {
            kind: "card",
            zones: ["hand"],
            relationship: "zone-of",
            player: "controller",
          },
        },
        effect: {
          kind: "move",
          subject: { kind: "bound", binding: "discarded-alternative" },
          from: "hand",
          destination: { zone: "graveyard" },
        },
      },
      otherwise: damageChampion,
    });
    resolveToDecision(fixture.runtime, fixture.sourceId);
    const accepted = answer(fixture.runtime, true);
    if (!accepted.ok) throw new Error(accepted.message);
    expect(fixture.runtime.state.decision).toMatchObject({ kind: "resolve-effect-choice" });

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const chosen = answer(restored, [fixture.paymentId]);
    if (!chosen.ok) throw new Error(chosen.message);
    expect(restored.state.objects[fixture.paymentId]?.zone).toBe("graveyard");
    expect(restored.state.objects[fixture.championId]?.damage).toBe(0);
  });
});
