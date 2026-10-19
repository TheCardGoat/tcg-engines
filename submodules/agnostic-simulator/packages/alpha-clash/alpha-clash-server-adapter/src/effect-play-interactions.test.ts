import { expect, it } from "vite-plus/test";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import type { AcClashCard } from "@tcg/alpha-clash-types";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const breath = getCard("ac-ac5-084"),
  white = getCard("ac-ac1-051"),
  blue = getCard("ac-ac4-113");
const body = clashCard({
  id: "effect-play-body",
  name: "Recovered Clash",
  affiliation: "alpha",
  colors: ["blue"],
  cost: { total: 2, pips: { blue: 2 } },
  attack: 2,
  defense: 5,
});
const context = { gameId: "effect-play", sourceAuthority: "server" as const };
function fixture(target: AcClashCard = body) {
  const g = Spec.fromFixture({
    definitions: [target],
    playerOne: {
      hand: [breath, white],
      oblivion: [target, target],
      resource: [blue, blue, white],
      deck: [white, blue],
    },
  });
  const ids = g.playerOne.instances(target).map((c) => c.instanceId);
  g.playerOne.play(breath);
  for (let i = 0; i < 40 && g.state.responseWindow && !g.state.pendingChoices.length; i++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  return {
    g,
    ids,
    engine: new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    }),
  };
}
function request(
  engine: AlphaClashServerEngine,
  cardId: string,
  values: InteractionSubmission["values"],
) {
  const view = engine.getInteractionView("p1"),
    action = view.actions.find(
      (a) => a.id.startsWith("resolveEffectPlay:") && a.id.endsWith(`:${cardId}`),
    );
  if (!action) throw Error(`Missing recovery action for ${cardId}`);
  return {
    action,
    result: engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values }),
      context,
    ),
  };
}
function resources(g: Spec) {
  return [white, blue].flatMap((card) =>
    g.playerOne
      .instances(card)
      .filter((c) => c.zone === "resource")
      .map((c) => JSON.stringify([c.instanceId, card === blue ? "blue" : "white"])),
  );
}
it("recovery choices expose separate same-name instances, quote the added white cost, and submit payment", () => {
  const { g, ids, engine } = fixture();
  const before = structuredClone(engine.state);
  const view = engine.getInteractionView("p1");
  expect(engine.state).toEqual(before);
  for (const id of ids)
    expect(
      view.actions.some((a) => a.id.endsWith(`:${id}`) && a.id.startsWith("resolveEffectPlay:")),
    ).toBe(true);
  const action = view.actions.find((a) => a.id.endsWith(`:${ids[1]}`))!;
  expect(action.inputs.find((i) => i.id === "resourcePayment")).toMatchObject({ min: 3, max: 3 });
  const { result } = request(engine, ids[1], { resourcePayment: resources(g) });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    type: "resolveChoice",
    optionId: ids[1],
    play: { resourcePayment: expect.any(Array) },
  });
  expect(engine.state.cards[ids[0]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[1]].zone).toBe("clash");
  const restored = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  expect(restored.dispatch("endTurn", "p1", {}, context).success).toBe(true);
  expect(restored.state.cards[ids[1]].zone).toBe("banished");
});
it("declining recovery uses the native decline option and spends no resources", () => {
  const { engine } = fixture();
  const before = structuredClone(engine.state);
  expect(request(engine, "decline", {}).result.success).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
  for (const c of Object.values(before.cards).filter((c) => c.zone === "resource"))
    expect(engine.state.cards[c.instanceId].ready).toBe(c.ready);
});
it("rejects an incomplete resource payment without consuming the recovery choice", () => {
  const { g, ids, engine } = fixture();
  const before = structuredClone(engine.state);
  expect(
    request(engine, ids[0], { resourcePayment: resources(g).slice(0, 2) }).result.success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
});
it("collects a mandatory discard and rejects an incomplete declaration atomically", () => {
  const target: AcClashCard = { ...body, additionalDiscard: 1 };
  const { g, ids, engine } = fixture(target);
  const before = structuredClone(engine.state);
  const incomplete = request(engine, ids[0], { costRoute: ["normal"] });
  expect(incomplete.action.inputs.find((i) => i.id === "discardCostIds")).toMatchObject({
    required: true,
    min: 1,
    max: 1,
  });
  expect(incomplete.result.success).toBe(false);
  expect(engine.state).toEqual(before);
  const discarded = g.playerOne.at(white, "hand").instanceId;
  const complete = request(engine, ids[0], {
    costRoute: ["normal"],
    discardCostIds: [discarded],
    costResources: resources(g),
  });
  expect(complete.result.success, JSON.stringify(complete.result)).toBe(true);
  expect(complete.result.acceptedMoveRecord?.processedCommand).toMatchObject({
    play: { discardCostIds: [discarded] },
  });
  expect(engine.state.cards[discarded].zone).toBe("oblivion");
  expect(engine.state.cards[ids[0]].zone).toBe("clash");
});
it.each([false, true])("combines X and required discard with manual payment=%s", (manual) => {
  const target: AcClashCard = { ...body, cost: { total: 0, x: true }, additionalDiscard: 1 };
  const { g, ids, engine } = fixture(target);
  const discarded = g.playerOne.at(white, "hand").instanceId;
  const values: InteractionSubmission["values"] = {
    costRoute: ["normal"],
    discardCostIds: [discarded],
    xValue: 2,
    ...(manual ? { xResourcePayment: resources(g) } : {}),
  };
  const result = request(engine, ids[1], values).result;
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    play: { xValue: 2, discardCostIds: [discarded] },
  });
  expect(engine.state.cards[discarded].zone).toBe("oblivion");
  expect(engine.state.cards[ids[0]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[1]].zone).toBe("clash");
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(0);
});

it("forwards X in a recovery play and rejects an unaffordable value without mutation", () => {
  const target: AcClashCard = { ...body, cost: { total: 0, x: true } };
  const { ids, engine } = fixture(target);
  const before = structuredClone(engine.state);
  expect(request(engine, ids[0], { xValue: 4 }).result.success).toBe(false);
  expect(engine.state).toEqual(before);
  const result = request(engine, ids[0], { xValue: 2 }).result;
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({ play: { xValue: 2 } });
  expect(
    Object.values(engine.state.cards).filter((c) => c.zone === "resource" && c.ready),
  ).toHaveLength(0);
});
it("forwards manual X payment through a saved recovery play including its added white resource", () => {
  const target: AcClashCard = { ...body, cost: { total: 0, x: true } };
  const { g, ids, engine } = fixture(target);
  const options = resources(g),
    selected = [options[0], options[2]];
  const result = request(engine, ids[1], { xValue: 1, xResourcePayment: selected }).result;
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    play: {
      xValue: 1,
      resourcePayment: selected.map((id) => {
        const [cardId, color] = JSON.parse(id);
        return { cardId, color };
      }),
    },
  });
  expect(engine.state.cards[JSON.parse(options[1])[0]].ready).toBe(true);
  expect(engine.state.cards[ids[1]].zone).toBe("clash");
});
it("does not offer an alternate sacrifice payment for a resource-cost recovery permission", () => {
  const target: AcClashCard = {
    ...body,
    alternateCost: {
      text: "Send another Clash",
      payments: [
        {
          target: { type: "card", controller: "friendly", cardTypes: ["clash"], zones: ["clash"] },
          amount: 1,
          destination: "oblivion",
        },
      ],
    },
  };
  const { g, ids, engine } = fixture(target);
  const { action, result } = request(engine, ids[0], { resourcePayment: resources(g) });
  expect(action.inputs.some((i) => i.id === "costRoute")).toBe(false);
  expect(result.success).toBe(true);
});

it.each(["all", "none"])("forwards the %s optional reduction route during recovery", (route) => {
  const target: AcClashCard = { ...body, selfCostReduction: { optional: true, pips: { blue: 1 } } };
  const { g, ids, engine } = fixture(target);
  const key = route === "all" ? "resourcePayment" : `discountResourcePayment:${route}`;
  const payment = resources(g).slice(0, route === "all" ? 2 : 3);
  const { action, result } = request(engine, ids[0], {
    optionalDiscounts: [route],
    [key]: payment,
  });
  expect(action.inputs.find((i) => i.id === key)).toMatchObject({
    min: payment.length,
    max: payment.length,
  });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    play: { declineSelfCostReduction: route === "none" },
  });
  expect(
    Object.values(engine.state.cards).filter((c) => c.zone === "resource" && c.ready),
  ).toHaveLength(route === "all" ? 1 : 0);
});

it("rejects a forged recovery option without consuming its choice or resources", () => {
  const { g, ids, engine } = fixture();
  const before = structuredClone(engine.state);
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id.endsWith(`:${ids[0]}`))!;
  const submission = buildInteractionSubmission({
    view,
    action,
    values: { resourcePayment: resources(g) },
  });
  const forged = {
    ...submission,
    actionId: action.id.replace(ids[0], g.playerOne.at(white, "hand").instanceId),
  };
  expect(engine.submitInteraction("p1", forged, context).success).toBe(false);
  expect(engine.state).toEqual(before);
});
