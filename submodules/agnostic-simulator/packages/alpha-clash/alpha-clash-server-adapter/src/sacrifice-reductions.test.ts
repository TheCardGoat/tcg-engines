import { expect, it } from "vitest";
import { action, clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const trap = getCard("ac-ac7-028");
const body = clashCard({
  id: "sacrifice-body",
  name: "Same-name ally",
  affiliation: "alpha",
  colors: [],
  cost: { total: 2 },
  attack: 3,
  defense: 8,
});
const guarded = clashCard({
  ...body,
  affiliation: "alpha",
  id: "sacrifice-guarded",
  name: "Protected ally",
});
const protect = action({
  id: "sacrifice-protect",
  name: "Cannot send",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [
    {
      type: "preventSendingToOblivion",
      target: { type: "card", zones: ["clash"], nameIncludes: "Protected ally" },
      duration: "endOfTurn",
    },
  ],
});
const context = { gameId: "sacrifice-reductions", sourceAuthority: "server" as const };
function setup(open = true, resources = 4) {
  const g = Spec.fromFixture({
    turnNumber: 3,
    portalOpen: open,
    definitions: [body, guarded, protect],
    playerOne: { clash: [body], hand: [protect] },
    playerTwo: {
      health: 15,
      clash: [body, body, guarded],
      accessory: [{ card: trap, faceDown: true, setOnTurn: 1 }],
      resource: Array(resources).fill(trap),
    },
  });
  g.playerOne.play(protect);
  while (g.state.responseWindow) g.asPlayer(g.state.responseWindow.openFor).passRound();
  g.playerOne.attack(body, g.playerTwo.contender());
  return { g, engine: new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }) };
}
it.each([0, 1, 2])(
  "Shadowstrike projects and submits %i sacrifice payments with the matching resource cost",
  (count) => {
    const { g, engine } = setup(true, 4 - count * 2);
    const view = engine.getInteractionView("p2");
    const action = view.actions.find(
      (a) => a.id === `respond:${g.playerTwo.at(trap, "accessory").instanceId}`,
    )!;
    const route = action.inputs.find((i) => i.id === "sacrificeRoute");
    if (route?.kind !== "option-selection") throw new Error("Missing sacrifice routes");
    const ids = g.playerTwo
      .instances(body)
      .filter((c) => c.zone === "clash")
      .slice(0, count)
      .map((c) => c.instanceId);
    const key = count ? `count:${count}` : "none";
    expect(route.options.map((o) => o.id)).toContain(key);
    for (const input of action.inputs)
      if (input.kind === "entity-selection" && input.id.startsWith("sacrificeCards:"))
        expect(
          input.candidates.some(
            (c) => c.entity.instanceId === g.playerTwo.at(guarded, "clash").instanceId,
          ),
        ).toBe(false);
    expect(new Set(route.options.map((o) => o.text.key)).size).toBe(route.options.length);
    const paymentKey = count === 0 ? "resourcePayment" : `sacrificeResourcePayment:${key}`;
    const input = action.inputs.find((i) => i.id === paymentKey);
    expect(input?.kind === "option-selection" ? input.min : 0).toBe(4 - count * 2);
    const values = {
      sacrificeRoute: [key],
      ...(count ? { [`sacrificeCards:${key}`]: ids } : {}),
      targetId: [g.playerOne.at(body, "clash").instanceId],
      ...(input?.kind === "option-selection"
        ? { [paymentKey]: input.options.slice(0, input.min).map((o) => o.id) }
        : {}),
    };
    const result = engine.submitInteraction(
      "p2",
      buildInteractionSubmission({ view, action, values }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
      costReductionSacrificeIds: ids,
    });
    for (const id of ids) expect(engine.state.cards[id].zone).toBe("oblivion");
    for (let i = 0; i < 20 && engine.state.responseWindow; i++)
      expect(engine.dispatch("pass", engine.getActivePlayerId()!, {}, context).success).toBe(true);
    expect(engine.state.cards[values.targetId[0]].zone).toBe("oblivion");
    expect(engine.state.players["player-two"].health).toBe(18);
  },
);
it("a closed Portal excludes sacrifices and forged selections are rejected atomically", () => {
  const { g, engine } = setup(false);
  const view = engine.getInteractionView("p2");
  const action = view.actions.find(
    (a) => a.id === `respond:${g.playerTwo.at(trap, "accessory").instanceId}`,
  )!;
  const route = action.inputs.find((i) => i.id === "sacrificeRoute");
  if (route?.kind !== "option-selection") throw new Error("Missing sacrifice routes");
  expect(route.options.map((o) => o.id)).toEqual(["none"]);
  const before = structuredClone(engine.state);
  const id = g.playerTwo.at(body, "clash").instanceId;
  const result = engine.submitInteraction(
    "p2",
    buildInteractionSubmission({
      view,
      action,
      values: {
        sacrificeRoute: [JSON.stringify([id])],
        targetId: [g.playerOne.at(body, "clash").instanceId],
      },
    }),
    context,
  );
  expect(result.success).toBe(false);
  expect(engine.state).toEqual(before);
});

it.each([0, 1, 2])(
  "From Death to Life quotes the sacrificed card's specific pips, route %i",
  (index) => {
    const revive = getCard("ac-ac5-088");
    const one = clashCard({
      ...body,
      affiliation: "alpha",
      id: "sacrifice-one",
      name: "One pip",
      cost: { total: 1, pips: { white: 1 } },
    });
    const two = clashCard({
      ...body,
      affiliation: "alpha",
      id: "sacrifice-two",
      name: "Two pips",
      cost: { total: 5, pips: { red: 1, black: 1 } },
    });
    const g = Spec.fromFixture({
      definitions: [body, one, two],
      playerOne: { clash: [body] },
      playerTwo: {
        hand: [revive],
        clash: [one, two],
        oblivion: [body],
        resource: Array(5 - index).fill(revive),
      },
    });
    g.playerOne.attack(body, g.playerTwo.contender());
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const view = engine.getInteractionView("p2");
    const action = view.actions.find(
      (a) => a.id === `respond:${g.playerTwo.hand(revive).instanceId}`,
    )!;
    const ids = index ? [g.playerTwo.at(index === 1 ? one : two, "clash").instanceId] : [];
    const route = index ? `card:${ids[0]}` : "none";
    const paymentKey = index ? `sacrificeResourcePayment:${route}` : "resourcePayment";
    const payment = action.inputs.find((i) => i.id === paymentKey);
    if (payment?.kind !== "option-selection") throw new Error("Missing payment");
    expect(payment.min).toBe(5 - index);
    const target = g.playerTwo.at(body, "oblivion").instanceId;
    const result = engine.submitInteraction(
      "p2",
      buildInteractionSubmission({
        view,
        action,
        values: {
          sacrificeRoute: [route],
          targetId: [target],
          [paymentKey]: payment.options.slice(0, payment.min).map((o) => o.id),
        },
      }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    for (let i = 0; i < 20 && engine.state.responseWindow; i++)
      expect(engine.dispatch("pass", engine.getActivePlayerId()!, {}, context).success).toBe(true);
    expect(engine.state.cards[target].zone).toBe("clash");
    for (const id of ids) expect(engine.state.cards[id].zone).toBe("oblivion");
  },
);
it("forged duplicate, opposing, protected and excessive sacrifice sets cannot mutate state", () => {
  const { g, engine } = setup();
  const view = engine.getInteractionView("p2");
  const action = view.actions.find(
    (a) => a.id === `respond:${g.playerTwo.at(trap, "accessory").instanceId}`,
  )!;
  const own = g.playerTwo.at(body, "clash").instanceId,
    enemy = g.playerOne.at(body, "clash").instanceId,
    guard = g.playerTwo.at(guarded, "clash").instanceId;
  const before = structuredClone(engine.state);
  for (const ids of [[own, own], [enemy], [guard], [own, guard, enemy]]) {
    const result = engine.submitInteraction(
      "p2",
      buildInteractionSubmission({
        view,
        action,
        values: {
          sacrificeRoute: [`count:${ids.length}`],
          [`sacrificeCards:count:${ids.length}`]: ids,
          targetId: [enemy],
        },
      }),
      context,
    );
    expect(result.success).toBe(false);
    expect(engine.state).toEqual(before);
  }
});
it("large boards use bounded count routes rather than enumerating sacrifice pairs", () => {
  const g = Spec.fromFixture({
    turnNumber: 3,
    portalOpen: true,
    definitions: [body],
    playerOne: { clash: [body] },
    playerTwo: {
      clash: Array(20).fill(body),
      accessory: [{ card: trap, faceDown: true, setOnTurn: 1 }],
    },
  });
  g.playerOne.attack(body, g.playerTwo.contender());
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const action = engine
    .getInteractionView("p2")
    .actions.find((a) => a.id === `respond:${g.playerTwo.at(trap, "accessory").instanceId}`)!;
  const route = action.inputs.find((i) => i.id === "sacrificeRoute");
  if (route?.kind !== "option-selection") throw new Error("Missing routes");
  expect(route.options.map((o) => o.id)).toEqual(["none", "count:1", "count:2"]);
  const selection = action.inputs.find((i) => i.id === "sacrificeCards:count:2");
  if (selection?.kind !== "entity-selection") throw new Error("Missing selection");
  expect(selection.candidates).toHaveLength(20);
  expect(selection.min).toBe(2);
  expect(selection.max).toBe(2);
});
