import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import {
  EngineInteractionView,
  INTERACTION_PROTOCOL_VERSION,
  type InteractionSubmission,
} from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const magnate = getCard("ac-tp1-010"),
  flare = getCard("ac-ac3-117"),
  red = getCard("ac-ac2-112");
const context = { gameId: "activation-costs", sourceAuthority: "server" as const };
function submit(
  e: AlphaClashServerEngine,
  id: string,
  values: InteractionSubmission["values"] = {},
) {
  const view = e.getInteractionView("p1");
  expect(EngineInteractionView.safeParse(view).success).toBe(true);
  const a = view.actions.find((a) => a.id === id);
  if (!a) throw Error(`Missing ${id}`);
  return e.submitInteraction(
    "p1",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: a.requestId,
      actionId: a.id,
      values,
    },
    context,
  );
}
function settle(e: AlphaClashServerEngine) {
  for (let n = 0; n < 30 && e.state.responseWindow && !e.state.pendingChoices.length; n++)
    expect(e.dispatch("pass", e.getActivePlayerId()!, {}, context).success).toBe(true);
}
function magnateFixture(ready: boolean, resources = [magnate, magnate, magnate]) {
  const g = Spec.fromFixture({
    playerOne: { clash: [{ card: magnate, ready }], hand: [magnate], resource: resources },
  });
  return {
    e: new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }),
    source: g.playerOne.at(magnate, "clash").instanceId,
    arrival: g.playerOne.hand(magnate).instanceId,
  };
}
it.each([true, false])(
  "Magnate exposes and pays GGG while ready = %s, preserving JSON continuation",
  (ready) => {
    const { e, source, arrival } = magnateFixture(ready);
    const id = `activateAbility:${source}:1:1`;
    expect(e.getInteractionView("p1").actions.find((a) => a.id === id)?.enabled).toBe(true);
    expect(submit(e, id).success).toBe(true);
    settle(e);
    expect(
      Object.values(e.state.cards).filter((c) => c.zone === "resource" && c.ready),
    ).toHaveLength(0);
    const restored = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const choice = restored.state.pendingChoices[0];
    if (choice?.kind !== "modal") throw Error("Expected incoming Magnate choice");
    const option = choice.options.find((o) => o.label === magnate.name);
    if (!option) throw Error("Missing Magnate");
    expect(submit(restored, `resolveChoice:${choice.id}`, { selection: [option.id] }).success).toBe(
      true,
    );
    settle(restored);
    expect(restored.state.cards[source].zone).toBe("oblivion");
    expect(restored.state.cards[arrival].zone).toBe("clash");
  },
);
it("Magnate's ordinary engage route does not pay resources", () => {
  const { e, source } = magnateFixture(true);
  expect(submit(e, `activateAbility:${source}:1`).success).toBe(true);
  expect(Object.values(e.state.cards).filter((c) => c.zone === "resource" && c.ready)).toHaveLength(
    3,
  );
});
it("Magnate disables unavailable costs and rejects a forged alternative atomically", () => {
  const { e, source } = magnateFixture(false, [red, red, red]);
  const view = e.getInteractionView("p1");
  expect(view.actions.find((a) => a.id === `activateAbility:${source}:1`)?.enabled).toBe(false);
  expect(view.actions.find((a) => a.id === `activateAbility:${source}:1:1`)?.enabled).toBe(false);
  const before = structuredClone(e.state);
  expect(submit(e, `activateAbility:${source}:1:1`).success).toBe(false);
  expect(e.state).toEqual(before);
});
const maker = action({
  id: "activation-novas",
  name: "Create Novas",
  colors: [],
  subtype: "basic",
  cost: { total: 0 },
  effects: [
    {
      type: "createTokens",
      controller: "any",
      amount: 2,
      token: { cardType: "accessory", name: "Nova Relic", colors: ["red"] },
    },
  ],
});
const guard = action({
  id: "activation-guard",
  name: "Protect Nova",
  colors: [],
  subtype: "basic",
  cost: { total: 0 },
  effects: [
    {
      type: "preventSendingToOblivion",
      target: { type: "card", tokenOnly: true, zones: ["accessory"], chosen: true },
      duration: "endOfTurn",
    },
  ],
});
function flareFixture() {
  const g = Spec.fromFixture({
    definitions: [maker, guard],
    playerOne: {
      contender: getCard("ac-ac2-098"),
      clash: [flare],
      hand: [maker, guard],
      resource: [red],
    },
    playerTwo: { contender: getCard("ac-ac2-098") },
  });
  g.playerOne.playAndResolve(maker);
  const own = Object.values(g.state.cards).filter(
    (c) => c.isToken && c.controller === "player-one",
  );
  const opposing = Object.values(g.state.cards).filter(
    (c) => c.isToken && c.controller === "player-two",
  );
  g.playerOne.playAndResolve(guard, own[0]);
  return {
    e: new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }),
    source: g.playerOne.at(flare, "clash").instanceId,
    legal: own[1].instanceId,
    protectedId: own[0].instanceId,
    opposing: opposing[0].instanceId,
    target: g.playerTwo.contender().instanceId,
  };
}
it("Flare offers only eligible Nova tokens and submits the selected instance", () => {
  const { e, source, legal, protectedId, target } = flareFixture();
  const id = `activateAbility:${source}:1`;
  const input = e
    .getInteractionView("p1")
    .actions.find((a) => a.id === id)
    ?.inputs.find((i) => i.id === "sendCostCardIds");
  if (input?.kind !== "entity-selection") throw Error("Missing Nova cost selection");
  expect(input.cardDestination).toEqual({
    label: { key: "Oblivion" },
    confirmText: { key: "Send card" },
  });
  expect(input.role).toBe("cost");
  expect(input.min).toBe(1);
  expect(input.max).toBe(1);
  expect(input.candidates.map((c) => c.entity.instanceId)).toEqual([legal]);
  expect(submit(e, id, { targetId: [target], sendCostCardIds: [legal] }).success).toBe(true);
  settle(e);
  expect(e.state.cards[legal]).toBeUndefined();
  expect(e.state.cards[protectedId].zone).toBe("accessory");
  expect(e.state.players["player-one"].health).toBe(29);
  expect(e.state.players["player-two"].health).toBe(28);
});
it.each(["missing", "protected", "opposing", "duplicate"])(
  "Flare rejects %s cost selection without paying resources or using once per turn",
  (kind) => {
    const { e, source, legal, protectedId, opposing, target } = flareFixture();
    const selected =
      kind === "missing"
        ? []
        : kind === "protected"
          ? [protectedId]
          : kind === "opposing"
            ? [opposing]
            : [legal, legal];
    const before = structuredClone(e.state);
    expect(
      submit(e, `activateAbility:${source}:1`, { targetId: [target], sendCostCardIds: selected })
        .success,
    ).toBe(false);
    expect(e.state).toEqual(before);
    expect(
      submit(e, `activateAbility:${source}:1`, { targetId: [target], sendCostCardIds: [legal] })
        .success,
    ).toBe(true);
  },
);
