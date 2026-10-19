import { expect, it } from "vite-plus/test";
import type { AcActionCard, AcClashCard, AcContenderCard } from "@tcg/alpha-clash-types";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
const hero: AcContenderCard = {
  id: "tier-hero",
  name: "Hero",
  cardType: "contender",
  colors: [],
  health: 30,
  attack: 0,
  defense: 0,
};
const body: AcClashCard = {
  id: "tier-body",
  name: "Body",
  cardType: "clash",
  colors: [],
  cost: { total: 0 },
  attack: 0,
  defense: 10,
};
const first: AcClashCard = { ...body, id: "tier-first", name: "First", attack: 2 };
const second: AcClashCard = { ...first, id: "tier-second", name: "Second" };
const pool: AcActionCard = {
  id: "tier-pool",
  name: "Shared Shield",
  cardType: "action",
  subtype: "basic",
  colors: [],
  cost: { total: 0 },
  effects: [
    { type: "preventNextGlobalDamage", amount: 3, damageType: "clash", duration: "endOfTurn" },
  ],
};
const shield: AcActionCard = {
  ...pool,
  id: "tier-shield",
  effects: [
    {
      type: "preventNextDamage",
      amount: 3,
      damageType: "clash",
      duration: "endOfTurn",
      target: {
        type: "card",
        zones: ["clash"],
        cardTypes: ["clash"],
        controller: "friendly",
        chosen: true,
      },
    },
  ],
};
function settle(g: Spec) {
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function setup(one = first, two = second, extra: AcActionCard[] = [], useLocal = true) {
  const g = Spec.fromFixture({
    definitions: [hero, body, one, two, pool, shield, ...extra],
    playerOne: { contender: hero, clash: [body], hand: [pool, shield, ...extra] },
    playerTwo: { contender: hero, clash: [one, two] },
  });
  g.playerOne.play(pool);
  settle(g);
  if (useLocal) {
    g.playerOne.play(shield, g.playerOne.at(body, "clash"));
    settle(g);
  }
  for (const card of extra) {
    g.playerOne.play(
      card,
      card.effects?.some((effect) => effect.type === "preventNextDamage")
        ? g.playerOne.at(body, "clash")
        : undefined,
    );
    settle(g);
  }
  g.playerOne.attack(body, g.playerTwo.contender());
  settle(g);
  g.playerTwo.obstruct([one, two]);
  g.clashToDamage();
  return g;
}
const seats = { p1: "player-one", p2: "player-two" } as const;
function submit(engine: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("p1");
  const choice = engine.state.pendingChoices[0];
  const action = view.actions.find((action) => action.id === `resolveChoice:${choice.id}`);
  if (!action) throw Error("Missing prevention choice");
  return engine.submitInteraction("p1", buildInteractionSubmission({ view, action, values }), {
    gameId: "prevention-order",
    sourceAuthority: "server",
  });
}
it.each(["shared", "local"] as const)(
  "submits %s-first prevention and its subsequent allocation after JSON restore",
  (order) => {
    const g = setup();
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    const choice = engine.state.pendingChoices[0];
    const input = engine
      .getInteractionView("p1")
      .actions.find((action) => action.id === `resolveChoice:${choice.id}`)?.inputs[0];
    expect(input?.kind).toBe("option-selection");
    if (input?.kind !== "option-selection" || choice.kind !== "option")
      throw Error("Missing exact option IDs");
    expect(input.options.map((option) => option.id)).toEqual(
      choice.options.map((option) => option.id),
    );
    expect(
      engine
        .getInteractionView("p2")
        .actions.some((action) => action.id === `resolveChoice:${choice.id}`),
    ).toBe(false);
    expect(submit(engine, { selection: [order] }).success).toBe(true);
    expect(engine.state.pendingChoices[0].kind).toBe("division");
    const restored = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
    const result = submit(restored, {
      allocation: {
        [g.playerTwo.at(first, "clash").instanceId]: 2,
        [g.playerTwo.at(second, "clash").instanceId]: 1,
      },
    });
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(restored.state.clash).toBeNull();
    const remaining = restored.state.cards[
      g.playerOne.at(body, "clash").instanceId
    ].temporaryMods.find((mod) => mod.damageBarrier)?.damageBarrier?.remaining;
    expect(remaining).toBe(order === "shared" ? 2 : 0);
    expect(restored.state.sharedDamageBarriers[0].remaining).toBe(order === "shared" ? 0 : 2);
  },
);
it.each([0, 1, 2])(
  "submits native mixed prevention option %i without converting it to yes/no",
  (index) => {
    const g = setup(first, second, [
      { ...shield, id: "second-local-shield", name: "Second Local Shield" },
    ]);
    const choice = g.state.pendingChoices[0];
    if (choice.kind !== "option" || !choice.mixedClashBarrierOrder)
      throw Error("Missing mixed prevention fixture");
    const optionId = choice.options[index].id;
    const native = applyCommand(structuredClone(g.state), {
      type: "resolveChoice",
      playerId: "player-one",
      choiceId: choice.id,
      optionId,
    });
    expect(native.success).toBe(true);
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    const result = submit(engine, { selection: [optionId] });
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(engine.state.pendingChoices).toEqual(native.state.pendingChoices);
    expect(engine.state.sharedDamageBarriers).toEqual(native.state.sharedDamageBarriers);
  },
);
it("rejects an unknown prevention option without spending or reordering barriers", () => {
  const engine = new AlphaClashServerEngine(setup().state, seats);
  const before = structuredClone(engine.state);
  expect(submit(engine, { selection: ["unknown"] }).success).toBe(false);
  expect(engine.state).toEqual(before);
});
