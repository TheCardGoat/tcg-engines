import { expect, it } from "vite-plus/test";
import { action, skirmisher, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const blank = action({
  id: "resource-colorless",
  name: "Colorless resource",
  colors: [],
  subtype: "basic",
  cost: { total: 0 },
  effects: [],
});
const seats = { p1: "player-one", p2: "player-two" } as const;
const context = { gameId: "colorless-payment", sourceAuthority: "server" as const };
it("the normal route of an alternate-cost card accepts colorless resources", () => {
  const rising = getCard("ac-ac2-014");
  const g = Spec.fromFixture({
    definitions: [blank],
    playerOne: { hand: [rising], resource: [blank, { card: skirmisher, faceDown: true }] },
  });
  const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  const view = e.getInteractionView("p1"),
    play = view.actions.find(
      (entry) => entry.id === `playCard:${g.playerOne.hand(rising).instanceId}`,
    );
  if (!play) throw Error("Missing alternate-cost card action");
  const payment = play.inputs.find((input) => input.id === "costResources");
  if (payment?.kind !== "option-selection") throw Error("Missing normal-route payment");
  expect(payment.options).toHaveLength(2);
  expect(payment.options.every((option) => JSON.parse(option.id)[1] === "colorless")).toBe(true);
  const result = e.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action: play,
      values: { costRoute: ["normal"], costResources: payment.options.map((option) => option.id) },
    }),
    context,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(
    Object.values(e.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(0);
});
it.each(["colorless", "face-down"])(
  "projects and submits the second %s resource through a saved payment choice",
  (kind) => {
    const resource = kind === "colorless" ? blank : skirmisher;
    const g = Spec.fromFixture({
      definitions: [blank],
      playerOne: {
        hand: [skirmisher],
        resource: [
          { card: resource, faceDown: kind === "face-down" },
          { card: resource, faceDown: kind === "face-down" },
        ],
      },
    });
    const ids = g.playerOne
      .instances(resource)
      .filter((card) => card.zone === "resource")
      .map((card) => card.instanceId);
    const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
      view = e.getInteractionView("p1"),
      play = view.actions.find(
        (entry) => entry.id === `playCard:${g.playerOne.hand(skirmisher).instanceId}`,
      );
    if (!play) throw Error("Missing play action");
    const payment = play.inputs.find((input) => input.id === "resourcePayment");
    if (payment?.kind !== "option-selection") throw Error("Missing colorless payment options");
    expect(payment.options.map((option) => JSON.parse(option.id))).toEqual(
      ids.map((id) => [id, "colorless"]),
    );
    const result = e.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action: play,
        values: { resourcePayment: [JSON.stringify([ids[1], "colorless"])] },
      }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
      resourcePayment: [{ cardId: ids[1], color: "colorless" }],
    });
    expect(e.state.cards[ids[0]].ready).toBe(true);
    expect(e.state.cards[ids[1]].ready).toBe(false);
  },
);
it("colorless options are available only to generic slots in a mixed colored cost", () => {
  const host = getCard("ac-ac7-015"),
    black = getCard("ac-ac4-008");
  const g = Spec.fromFixture({
    definitions: [blank],
    playerOne: {
      hand: [host],
      resource: [black, black, blank, { card: skirmisher, faceDown: true }],
    },
  });
  const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
    view = e.getInteractionView("p1"),
    play = view.actions.find(
      (entry) => entry.id === `playCard:${g.playerOne.hand(host).instanceId}`,
    );
  if (!play) throw Error("Missing New Host action");
  const payment = play.inputs.find((input) => input.id === "resourcePayment");
  if (payment?.kind !== "option-selection" || payment.presentation?.kind !== "cost-slots")
    throw Error("Missing mixed cost slots");
  expect(payment.presentation.slots).toHaveLength(4);
  for (const slot of payment.presentation.slots.filter((slot) => slot.color))
    expect(slot.optionIds.every((id) => JSON.parse(id)[1] === "black")).toBe(true);
  const selected = payment.options.map((option) => option.id);
  expect(selected.filter((id) => JSON.parse(id)[1] === "colorless")).toHaveLength(2);
  const result = e.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action: play, values: { resourcePayment: selected } }),
    context,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(
    Object.values(e.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(0);
});
