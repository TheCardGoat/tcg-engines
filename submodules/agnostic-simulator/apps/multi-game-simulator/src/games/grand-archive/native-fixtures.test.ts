import { describe, expect, it } from "vitest";
import { buildInteractionSubmission, type InteractionSubmissionValue } from "@tcg/protocol";
import { projectGrandArchiveSimulator } from "@tcg/grand-archive-server-adapter";
import { grandArchivePlayerId, grandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import {
  markTheTarget,
  spiritOfWind,
  raiSpellcrafter,
  woodlandSquirrels,
  idleFatestone,
  salamandersBreath,
  viridescentAetherstreak,
  teraSight,
} from "@tcg/grand-archive-cards";
import { GRAND_ARCHIVE_NATIVE_FIXTURES, findGrandArchiveNativeFixture } from "./native-fixtures";

type Server = ReturnType<(typeof GRAND_ARCHIVE_NATIVE_FIXTURES)[number]["createServer"]>;
function actor(server: Server) {
  const wait = server.runtime.waitState();
  if (!("playerId" in wait)) throw new Error(`No actor in ${wait.kind}`);
  return wait.playerId;
}
function submit(
  server: Server,
  label: string,
  values: Record<string, InteractionSubmissionValue> = {},
) {
  const viewer = actor(server);
  const view = server.getInteractionView(viewer);
  const action = view.actions.find((entry) => entry.text.key.includes(label));
  if (!action)
    throw new Error(`Missing ${label}: ${view.actions.map((a) => a.text.key).join("; ")}`);
  const defaults: Record<string, InteractionSubmissionValue> = {};
  for (const input of action.inputs) {
    if (input.kind === "entity-selection" && input.role === "cost" && input.required)
      defaults[input.id] = [...input.candidates]
        .sort(
          (a, b) =>
            Number(b.text?.key.includes("Woodland")) - Number(a.text?.key.includes("Woodland")),
        )
        .slice(0, input.min)
        .map((c) => c.entity.instanceId);
    if (input.kind === "option-selection")
      defaults[input.id] = input.options.slice(0, input.min).map((o) => o.id);
  }
  const result = server.submitInteraction(
    viewer,
    buildInteractionSubmission({ view, action, values: { ...defaults, ...values } }),
    { gameId: "native-fixture-test", sourceAuthority: "client" },
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
}
function resolve(server: Server) {
  for (
    let step = 0;
    step < 24 && server.runtime.state.stack.length > 0 && !server.runtime.state.decision;
    step++
  )
    submit(server, "Pass");
}
function create(id: string) {
  return findGrandArchiveNativeFixture(id)!.createServer();
}
function input(server: Server, kind: string) {
  const found = server
    .getInteractionView(actor(server))
    .actions.flatMap((a) => a.inputs)
    .find((i) => i.kind === kind);
  if (!found)
    throw new Error(
      `Missing input ${kind}: ${JSON.stringify(server.getInteractionView(actor(server)))}`,
    );
  return found;
}
function chooseCards(server: Server, count: number) {
  const selection = input(server, "entity-selection");
  if (selection.kind !== "entity-selection") throw new Error("Expected card selection");
  const ids = selection.candidates.slice(0, count).map((c) => c.entity.instanceId);
  submit(server, "Resolve effect", { [selection.id]: ids });
  resolve(server);
  return ids;
}
function expectResolved(server: Server) {
  expect(server.runtime.state.decision).toBeNull();
  expect(server.runtime.state.stack).toHaveLength(0);
  const projection = projectGrandArchiveSimulator(
    server.program,
    server.runtime.state,
    grandArchivePlayerId("p1"),
  );
  expect(projection.eventLog.length).toBeGreaterThan(0);
}

describe("Grand Archive player-driven native fixtures", () => {
  it.each(GRAND_ARCHIVE_NATIVE_FIXTURES)(
    "$id starts before player action with real catalog cards",
    (fixture) => {
      const server = fixture.createServer();
      expect(server.runtime.state.decision).toBeNull();
      expect(server.runtime.state.stack).toHaveLength(0);
      expect(server.getInteractionView("p1").actions.some((a) => a.intent !== "concede")).toBe(
        true,
      );
    },
  );

  it.each([false, true])(
    "orders Glimpse into top and bottom and draws into memory, bottom all=%s",
    (bottomAll) => {
      const server = create("native-glimpse");
      const before = [...server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]];
      submit(server, "Activate Scry");
      resolve(server);
      const decision = server.runtime.state.decision;
      if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
      expect(decision.cardIds).toEqual(before.slice(0, 2));
      expect(server.getInteractionView("p2").actions.flatMap((a) => a.inputs)).toEqual([]);
      submit(server, "Glimpse", {
        "glimpse-order": {
          top: bottomAll ? [] : [before[1]!],
          bottom: bottomAll ? [before[1]!, before[0]!] : [before[0]!],
        },
      });
      resolve(server);
      const reordered = bottomAll
        ? [...before.slice(2), before[1]!, before[0]!]
        : [before[1]!, ...before.slice(2), before[0]!];
      expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]).toEqual(
        reordered.slice(1),
      );
      expect(server.runtime.state.zones[grandArchivePlayerId("p1")].memory).toContain(reordered[0]);
      expectResolved(server);
    },
  );

  it("chooses a number, then returns that many cards to the shuffled deck", () => {
    const server = create("native-number");
    submit(server, "Activate Orb");
    resolve(server);
    submit(server, "Resolve effect", { "draw-count": 2 });
    resolve(server);
    const returned = chooseCards(server, 2);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(1);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]).toEqual(
      expect.arrayContaining(returned),
    );
    expectResolved(server);
  });

  it.each([false, true])("resolves the optional Creative Shock damage, accepted=%s", (accepted) => {
    const server = create("native-optional");
    submit(server, "Activate Creative");
    resolve(server);
    const fireCard = Object.values(server.runtime.state.objects).find(
      (o) =>
        o.ownerId === "p1" && o.zone === "hand" && o.definitionId === markTheTarget.canonicalId,
    )!;
    submit(server, "Resolve effect", { "discarded-card": [fireCard.id] });
    resolve(server);
    const optional = input(server, "boolean");
    const optionalAction = server
      .getInteractionView(actor(server))
      .actions.find((a) => a.inputs.some((i) => i.id === optional.id))!;
    submit(server, optionalAction.text.key, { [optional.id]: accepted });
    resolve(server);
    if (accepted) {
      const target = Object.values(server.runtime.state.objects).find(
        (o) => o.ownerId === "p2" && o.definitionId === spiritOfWind.canonicalId,
      )!;
      const choice = input(server, "entity-selection");
      submit(server, "Resolve effect", { [choice.id]: [target.id] });
      resolve(server);
      expect(server.runtime.state.objects[target.id]!.damage).toBe(2);
    }
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].graveyard).toContain(fireCard.id);
    expectResolved(server);
  });

  it("searches a private deck and places the chosen card in memory", () => {
    const server = create("native-search");
    submit(server, "Activate Luxera");
    resolve(server);
    expect(server.getInteractionView("p2").actions.flatMap((a) => a.inputs)).toEqual([]);
    const [chosen] = chooseCards(server, 1);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].memory).toContain(chosen);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]).not.toContain(
      chosen,
    );
    expectResolved(server);
  });

  it("starts crowded board inspection before materialization with full hands and public piles", () => {
    const server = create("native-crowded-board");
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(server.runtime.state.zones[p1].field.length).toBeGreaterThan(5);
    expect(server.runtime.state.zones[p2].field.length).toBeGreaterThan(5);
    expect(server.runtime.state.zones[p1].hand).toHaveLength(8);
    expect(server.runtime.state.zones[p1].graveyard).toHaveLength(8);
    expect(server.runtime.waitState().kind).toBe("materialization-choice");
    expect(server.getInteractionView("p1").actions.some((action) => action.intent === "pass")).toBe(
      true,
    );
  });

  it("searches all twelve private deck cards and accepts the last candidate", () => {
    const server = create("native-search");
    const p1 = grandArchivePlayerId("p1");
    const deck = [...server.runtime.state.zones[p1]["main-deck"]];
    submit(server, "Activate Luxera");
    resolve(server);
    const selection = input(server, "entity-selection");
    if (selection.kind !== "entity-selection") throw new Error("Expected deck search");
    expect(selection.candidates.map((candidate) => candidate.entity.instanceId)).toEqual(
      expect.arrayContaining(deck),
    );
    expect(selection.candidates).toHaveLength(12);
    expect(server.getInteractionView("p2").actions.flatMap((action) => action.inputs)).toEqual([]);
    const chosen = deck.at(-1)!;
    submit(server, "Resolve effect", { [selection.id]: [chosen] });
    resolve(server);
    expect(server.runtime.state.zones[p1].memory).toContain(chosen);
    expect(server.runtime.state.zones[p1]["main-deck"]).not.toContain(chosen);
    expectResolved(server);
  });

  it("selects multiple graveyard cards and banishes them", () => {
    const server = create("native-graveyard");
    submit(server, "Activate Erupting");
    resolve(server);
    const chosen = chooseCards(server, 2);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].banishment).toEqual(
      expect.arrayContaining(chosen),
    );
    expectResolved(server);
  });

  it("chooses a mode with a legal target before activation", () => {
    const server = create("native-modes");
    const option = input(server, "option-selection");
    const target = Object.values(server.runtime.state.objects).find(
      (o) => o.ownerId === "p1" && o.zone === "field" && o.definitionId !== "LMyKyVC2O9",
    )!;
    if (option.kind !== "option-selection") throw new Error("Expected modes");
    const targetOption = option.options.find((o) => o.id.includes(`"target-1":["${target.id}"]`));
    if (!targetOption) throw new Error("Missing target declaration");
    submit(server, "Activate Hidden", { [option.id]: [targetOption.id] });
    resolve(server);
    expect(server.runtime.state.continuousEffects.length).toBeGreaterThan(0);
    expectResolved(server);
  });

  it("resolves Melody then banishes Fire cards and splits Rhapsody damage", () => {
    const server = create("native-distribution");
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(6);
    submit(server, "Activate Song");
    resolve(server);
    submit(server, "Activate Erupting");
    resolve(server);
    chooseCards(server, 3);
    const allocation = input(server, "entity-allocation");
    if (allocation.kind !== "entity-allocation") throw new Error("Expected allocation");
    const candidates = allocation.candidates.slice(0, 2);
    const action = server
      .getInteractionView(actor(server))
      .actions.find((a) => a.inputs.some((i) => i.id === allocation.id))!;
    submit(server, action.text.key, {
      [allocation.id]: {
        [candidates[0]!.entity.instanceId]: 1,
        [candidates[1]!.entity.instanceId]: 2,
      },
    });
    resolve(server);
    expect(
      server.runtime.state.objects[grandArchiveObjectId(candidates[0]!.entity.instanceId)]!.damage,
    ).toBe(1);
    expect(
      server.runtime.state.objects[grandArchiveObjectId(candidates[1]!.entity.instanceId)]!.damage,
    ).toBe(2);
    expectResolved(server);
  });

  it("plays the opening into first materialization through native submissions", () => {
    const server = create("native-opening");
    expect(server.runtime.waitState().kind).toBe("pregame-action");
    for (
      let step = 0;
      step < 24 && server.runtime.waitState().kind !== "materialization-choice";
      step++
    ) {
      const action = server
        .getInteractionView(actor(server))
        .actions.find((a) => a.intent === "pass")!;
      submit(server, action.text.key);
    }
    expect(server.runtime.waitState().kind).toBe("materialization-choice");
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].hand.length).toBeGreaterThan(0);
  });

  it("materializes Rai, gains counters and completes recollection", () => {
    const server = create("native-recollection");
    submit(server, "Materialize Rai");
    resolve(server);
    for (
      let step = 0;
      step < 12 && server.runtime.state.zones[grandArchivePlayerId("p1")].memory.length > 0;
      step++
    )
      submit(server, "Pass");
    const champion = Object.values(server.runtime.state.objects).find(
      (o) =>
        o.ownerId === "p1" &&
        o.zone === "field" &&
        (o.definitionId === raiSpellcrafter.canonicalId ||
          o.activeDefinitionId === raiSpellcrafter.canonicalId),
    )!;
    expect(champion.counters.enlighten).toBe(2);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].memory).toHaveLength(0);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].banishment).toHaveLength(1);
  });
});

function answer(server: Server, value: InteractionSubmissionValue, kind?: string) {
  const action = server
    .getInteractionView(actor(server))
    .actions.find((a) => a.inputs.some((i) => !kind || i.kind === kind));
  if (!action) throw new Error("No decision input");
  const target = action.inputs.find((i) => !kind || i.kind === kind)!;
  submit(server, action.text.key, { [target.id]: value });
  resolve(server);
}
function activateTarget(server: Server, label: string, targetId: string) {
  const action = server
    .getInteractionView(actor(server))
    .actions.find((a) => a.text.key.includes(label))!;
  const exact = action.inputs.find((i) => i.id === "legal-declaration");
  if (exact?.kind === "option-selection") {
    const legal = exact.options.find(
      (o) =>
        o.id.includes(`"${targetId}"`) &&
        !o.text.key.includes("payment: Charge") &&
        !o.text.key.includes("payment: Tribo"),
    );
    if (!legal) throw new Error(`No declaration for target ${targetId}`);
    submit(server, label, { [exact.id]: [legal.id] });
  } else {
    const target = action.inputs.find((i) => i.kind === "entity-selection" && i.role === "target");
    submit(server, label, target ? { [target.id]: [targetId] } : {});
  }
  resolve(server);
}
function advanceUntil(server: Server, condition: () => boolean) {
  for (let step = 0; step < 60 && !condition(); step++) {
    const pass = server.getInteractionView(actor(server)).actions.find((a) => a.intent === "pass");
    if (!pass) throw new Error(`No pass: ${JSON.stringify(server.runtime.waitState())}`);
    submit(server, pass.text.key);
  }
  expect(condition()).toBe(true);
}

describe("Grand Archive advanced native choice families", () => {
  it("orders simultaneous Urn triggers and resolves both counters", () => {
    const server = create("native-trigger-order");
    advanceUntil(server, () => server.runtime.state.decision?.kind === "order-triggered-abilities");
    const ordering = input(server, "ordering");
    if (ordering.kind !== "ordering") throw new Error("Expected ordering");
    answer(server, ordering.candidates.map((c) => c.entity.instanceId).reverse(), "ordering");
    expectResolved(server);
    expect(
      Object.values(server.runtime.state.objects).filter(
        (o) => o.ownerId === "p1" && o.counters["named:age"] === 1,
      ),
    ).toHaveLength(2);
  });
  it("Starcalls a revealed real card and bottoms the other glimpsed cards", () => {
    const server = create("native-starcall");
    submit(server, "Activate Scry the Stars");
    resolve(server);
    const decision = server.runtime.state.decision;
    if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Starcall Glimpse");
    const cardId = decision.cardIds.find(
      (id) => server.runtime.state.objects[id]!.definitionId === woodlandSquirrels.canonicalId,
    )!;
    const bottom = decision.cardIds.filter((id) => id !== cardId).reverse();
    submit(server, "Glimpse", {
      "glimpse-action": ["starcall"],
      cardId: [cardId],
      [`starcall-order:${cardId}`]: { bottom, starcall: [cardId] },
    });
    resolve(server);
    expect(server.runtime.state.objects[cardId]!.zone).toBe("field");
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"].slice(-2)).toEqual(
      bottom,
    );
    expectResolved(server);
  });
  it("returns Starcall-eligible cards to the deck without paying reserve", () => {
    const server = create("native-starcall");
    submit(server, "Activate Scry the Stars");
    resolve(server);
    const deck = [...server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]];
    const decision = server.runtime.state.decision;
    if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    const [first, second, third] = decision.cardIds;
    submit(server, "Glimpse", {
      "glimpse-action": ["reorder"],
      "glimpse-order": { top: [second!, first!], bottom: [third!] },
    });
    resolve(server);
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]).toEqual([
      second,
      first,
      ...deck.slice(3),
      third,
    ]);
    expectResolved(server);
  });
  it("reveals cards and completes native top/bottom partition", () => {
    const server = create("native-reveal-partition");
    const deck = [...server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]];
    submit(server, "Activate Advent");
    resolve(server);
    if (server.runtime.state.decision?.kind === "resolve-effect-choice") chooseCards(server, 0);
    const partition = input(server, "entity-partition");
    if (partition.kind !== "entity-partition") throw new Error("Expected partition");
    answer(
      server,
      { [partition.routes[0]!.id]: [deck[2]!], [partition.routes[1]!.id]: [deck[1]!, deck[0]!] },
      "entity-partition",
    );
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]).toEqual([
      deck[2],
      ...deck.slice(3),
      deck[1],
      deck[0],
    ]);
    expectResolved(server);
  });
  it("creates static counters by action then allocates removal", () => {
    const server = create("native-counter-allocation");
    const champion = Object.values(server.runtime.state.objects).find(
      (o) => o.ownerId === "p1" && o.activeDefinitionId,
    )!;
    activateTarget(server, "Activate Charge Static", champion.id);
    expect(server.runtime.state.objects[champion.id]!.counters.static).toBe(3);
    const victim = Object.values(server.runtime.state.objects).find(
      (o) => o.ownerId === "p2" && o.definitionId === spiritOfWind.canonicalId,
    )!;
    activateTarget(server, "Activate Triboelectric", victim.id);
    expect(server.runtime.state.decision?.kind).toBe("resolve-counter-allocation");
    answer(server, { [champion.id]: 2 }, "entity-allocation");
    const [weapon] = chooseCards(server, 1);
    expect(server.runtime.state.objects[champion.id]!.counters.static).toBe(1);
    expect(server.runtime.state.objects[victim.id]!.damage).toBe(2);
    expect(server.runtime.state.objects[grandArchiveObjectId(weapon!)]!.counters.durability).toBe(
      4,
    );
    expectResolved(server);
  });
  it("reduces recollection with a played Hoarfrost Hold", () => {
    const server = create("native-restricted-recollection");
    submit(server, "Activate Hoarfrost");
    resolve(server);
    chooseCards(server, 1);
    advanceUntil(server, () => server.runtime.state.decision?.kind === "choose-recollection");
    expect(actor(server)).toBe("p2");
    const selection = input(server, "entity-selection");
    if (selection.kind !== "entity-selection") throw new Error("Expected recollection cards");
    expect(selection.min).toBe(2);
    expect(server.getInteractionView("p1").actions.flatMap((a) => a.inputs)).toEqual([]);
    const ids = selection.candidates.slice(0, 2).map((c) => c.entity.instanceId);
    answer(server, ids, "entity-selection");
    expect(server.runtime.state.zones[grandArchivePlayerId("p2")].hand).toEqual(
      expect.arrayContaining(ids),
    );
    expect(server.runtime.state.zones[grandArchivePlayerId("p2")].memory).toHaveLength(1);
  });
  it("transforms a real double-faced card after revealing the top card", () => {
    const server = create("native-transform");
    submit(server, "Activate Idle");
    resolve(server);
    expect(
      Object.values(server.runtime.state.objects).some(
        (o) =>
          o.ownerId === "p1" &&
          o.definitionId === idleFatestone.canonicalId &&
          o.face === "transformed",
      ),
    ).toBe(true);
    expectResolved(server);
  });
  it("loads a real Aethercharge onto a chosen weapon", () => {
    const server = create("native-load");
    const action = server
      .getInteractionView(actor(server))
      .actions.find((a) => a.text.key.includes("Activate Viridescent"))!;
    const options = action.inputs.find((i) => i.kind === "option-selection");
    if (options?.kind !== "option-selection") throw new Error("Expected load modes");
    if (options.id === "legal-declaration") {
      const option = options.options.find((o) => o.id.includes('"load"'))!;
      if (!option) throw new Error("Expected an available native load declaration");
      submit(server, action.text.key, { [options.id]: [option.id] });
    } else submit(server, action.text.key, { [options.id]: ["become-distant", "load"] });
    resolve(server);
    chooseCards(server, 1);
    const loaded = server.runtime.state.zones[grandArchivePlayerId("p1")].loaded;
    expect(loaded).toHaveLength(1);
    const weapon = Object.values(server.runtime.state.objects).find(
      (o) => o.ownerId === "p1" && o.definitionId === salamandersBreath.canonicalId,
    )!;
    expect(server.runtime.state.objects[loaded[0]!]!.definitionId).toBe(
      viridescentAetherstreak.canonicalId,
    );
    expect(server.runtime.state.objects[loaded[0]!]!.hostId).toBe(weapon.id);
    expectResolved(server);
  });
  it("preserves Tera Sight and returns it through materialization", () => {
    const server = create("native-preserve");
    submit(server, "Activate Tera");
    resolve(server);
    const preserved = Object.values(server.runtime.state.objects).find(
      (o) => o.ownerId === "p1" && o.states.has("preserved"),
    )!;
    expect(preserved.definitionId).toBe(teraSight.canonicalId);
    expect(preserved.zone).toBe("material-deck");
    advanceUntil(server, () => {
      const wait = server.runtime.waitState();
      return wait.kind === "materialization-choice" && wait.playerId === "p1";
    });
    submit(server, "Return Tera");
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].hand).toContain(preserved.id);
    expect(server.runtime.state.objects[preserved.id]!.states.has("preserved")).toBe(false);
    expectResolved(server);
  });
});
