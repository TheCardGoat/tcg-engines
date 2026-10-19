import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const queen = getCard("ac-ac5-012"),
  black = getCard("ac-ac4-008"),
  green = getCard("ac-ac2-025");
const deaths = [black, getCard("ac-ac2-009"), getCard("ac-ac2-010")];
const context = { gameId: "queen-audit", sourceAuthority: "server" as const };
function fixture(n = 3) {
  const g = Spec.fromFixture({
    playerOne: {
      hand: [queen],
      oblivion: deaths.slice(0, n),
      resource: [black, black, black, green, green, green],
    },
  });
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const view = engine.getInteractionView("p1"),
    action = view.actions.find(
      (a) => a.id === `playCard:${g.playerOne.at(queen, "hand").instanceId}`,
    );
  if (!action) throw Error("Missing Queen play");
  return { g, engine, view, action };
}
it.each(["none", "count:1", "count:2", "all"])(
  "Queen quotes and pays the %s colored reduction route after JSON",
  (route) => {
    const { engine, view, action } = fixture(),
      count = route === "all" ? 3 : route === "none" ? 0 : Number(route.slice(6));
    const input = action.inputs.find((i) => i.id === "optionalDiscounts");
    expect(input).toMatchObject({
      kind: "option-selection",
      options: expect.arrayContaining([expect.objectContaining({ id: route })]),
    });
    const key = route === "all" ? "resourcePayment" : `discountResourcePayment:${route}`;
    const payment = action.inputs.find((i) => i.id === key);
    expect(payment).toMatchObject({ kind: "option-selection", min: 6 - count, max: 6 - count });
    if (payment?.kind !== "option-selection") throw Error("Missing payment");
    const blacks = Object.values(engine.state.cards).filter(
        (c) => c.zone === "resource" && c.definitionId === black.id,
      ),
      greens = Object.values(engine.state.cards).filter(
        (c) => c.zone === "resource" && c.definitionId === green.id,
      );
    const selected = [
      ...blacks.slice(0, 3 - count).map((c) => JSON.stringify([c.instanceId, "black"])),
      ...greens.map((c) => JSON.stringify([c.instanceId, "green"])),
    ];
    const before = structuredClone(engine.state);
    const bad = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: { optionalDiscounts: [route], [key]: selected.slice(1) },
      }),
      context,
    );
    expect(bad.success).toBe(false);
    expect(engine.state).toEqual(before);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: { optionalDiscounts: [route], [key]: selected },
      }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    if (route.startsWith("count:"))
      expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
        selfCostReductionCount: count,
      });
    expect(engine.state.cards[action.source!.instanceId!].zone).toBe("clash");
    expect(blacks.filter((c) => engine.state.cards[c.instanceId].ready)).toHaveLength(count);
    expect(greens.filter((c) => engine.state.cards[c.instanceId].ready)).toHaveLength(0);
  },
);
it.each([0, 1, 2])("Queen offers only eligible partial reductions with %s distinct names", (n) => {
  const { engine, view, action } = fixture(n),
    input = action.inputs.find((i) => i.id === "optionalDiscounts");
  if (input?.kind !== "option-selection") throw Error("Missing reductions");
  expect(input.options.map((o) => o.id)).toEqual(
    n === 2 ? ["all", "none", "count:1"] : ["all", "none"],
  );
  const before = structuredClone(engine.state);
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values: { optionalDiscounts: [`count:${n + 1}`] } }),
    context,
  );
  expect(result.success).toBe(false);
  expect(engine.state).toEqual(before);
});
it("Queen recovery quotes exclude the proposed Queen and submit a saved partial reduction", () => {
  const breath = getCard("ac-ac5-084"),
    white = getCard("ac-ac1-051");
  const g = Spec.fromFixture({
    playerOne: {
      hand: [breath],
      oblivion: [queen, ...deaths.slice(0, 2)],
      resource: [white, black, black, black, green, green, green],
    },
  });
  const id = g.playerOne.at(queen, "oblivion").instanceId;
  g.playerOne.play(breath);
  for (let n = 0; n < 30 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    }),
    view = engine.getInteractionView("p1"),
    action = view.actions.find(
      (a) => a.id.startsWith("resolveEffectPlay:") && a.id.endsWith(`:${id}`),
    );
  if (!action) throw Error("Missing Queen recovery");
  expect(action.inputs.find((i) => i.id === "resourcePayment")).toMatchObject({ min: 5, max: 5 });
  const key = "discountResourcePayment:count:1";
  expect(action.inputs.find((i) => i.id === key)).toMatchObject({ min: 6, max: 6 });
  const w = g.playerOne.at(white, "resource"),
    blacks = g.playerOne.instances(black).filter((c) => c.zone === "resource"),
    greens = g.playerOne.instances(green).filter((c) => c.zone === "resource");
  const payment = [
    JSON.stringify([w.instanceId, "white"]),
    ...blacks.slice(0, 2).map((c) => JSON.stringify([c.instanceId, "black"])),
    ...greens.map((c) => JSON.stringify([c.instanceId, "green"])),
  ];
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action,
      values: { optionalDiscounts: ["count:1"], [key]: payment },
    }),
    context,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    type: "resolveChoice",
    play: { selfCostReductionCount: 1 },
  });
  expect(engine.state.cards[id].zone).toBe("clash");
  expect(blacks.filter((c) => engine.state.cards[c.instanceId].ready)).toHaveLength(1);
});
