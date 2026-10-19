import { expect, it } from "vite-plus/test";
import { action, clashground, getCard } from "@tcg/alpha-clash-cards";
import type { AcAbility } from "@tcg/alpha-clash-types";
import { abilitiesOf, applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const host = getCard("ac-ac7-015"),
  black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
const gift: Extract<AcAbility, { kind: "activated" }> = {
  kind: "activated",
  text: "Granted targeted activation",
  phase: "primary",
  oncePerTurn: true,
  cost: { kind: "engage", target: { type: "self" } },
  alternateCosts: [{ kind: "resources", cost: { total: 1, pips: { black: 1 } } }],
  effects: [
    {
      type: "modifyStats",
      target: { type: "card", controller: "friendly", zones: ["clash"], chosen: true },
      attack: 2,
      defense: 0,
      duration: "endOfTurn",
    },
  ],
};
const grant = action({
  id: "grant-activation",
  name: "Grant",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [
    {
      type: "grantAbility",
      target: { type: "card", zones: ["clash"], controller: "friendly", chosen: true },
      ability: gift,
      duration: "endOfTurn",
    },
  ],
});
function settle(g: Spec) {
  for (let n = 0; n < 40 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
}
function submit(
  e: AlphaClashServerEngine,
  id: string,
  values: InteractionSubmission["values"] = {},
  seat: "p1" | "p2" = "p1",
) {
  const view = e.getInteractionView(seat),
    a = view.actions.find((a) => a.id === id);
  if (!a) throw Error("Missing " + id);
  return e.submitInteraction(seat, buildInteractionSubmission({ view, action: a, values }), {
    gameId: "grant-audit",
    sourceAuthority: "server",
  });
}
function fixture() {
  const g = Spec.fromFixture({
      definitions: [grant],
      playerOne: { hand: [grant], clash: [host, host], resource: [black] },
      playerTwo: { clash: [host] },
    }),
    ids = g.playerOne.instances(host).map((c) => c.instanceId);
  g.playerOne.play(grant, g.state.cards[ids[0]]);
  settle(g);
  return { g, ids, index: abilitiesOf(host).length };
}
it.each([false, true])(
  "A temporary granted activation exposes targets and its payment route (alternative %s)",
  (alternative) => {
    const { g, ids, index } = fixture();
    const native = applyCommand(structuredClone(g.state), {
      type: "activateAbility",
      playerId: "player-one",
      cardId: ids[0],
      abilityIndex: index,
      costIndex: alternative ? 1 : 0,
      targetId: ids[1],
    });
    expect(native.success).toBe(true);
    let e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    const id = `activateAbility:${ids[0]}:${index}${alternative ? ":1" : ""}`,
      a = e.getInteractionView("p1").actions.find((a) => a.id === id);
    expect(a?.enabled, JSON.stringify(a)).toBe(true);
    expect(a?.text.key).toContain(gift.text);
    const before = structuredClone(e.state);
    expect(submit(e, id, { targetId: [g.playerTwo.at(host, "clash").instanceId] }).success).toBe(
      false,
    );
    expect(e.state).toEqual(before);
    const result = submit(e, id, { targetId: [ids[1]] });
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(Spec.fromState(e.state).atk(e.state.cards[ids[1]])).toBe(5);
    expect(e.state.cards[ids[0]].ready).toBe(alternative);
    expect(e.state.cards[g.playerOne.at(black, "resource").instanceId].ready).toBe(!alternative);
    e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
    expect(
      e
        .getInteractionView("p1")
        .actions.filter((a) => a.id.startsWith(`activateAbility:${ids[0]}:${index}`))
        .every((a) => !a.enabled),
    ).toBe(true);
  },
);
it("Static granted abilities expose their send-cost declaration and disappear when the source leaves", () => {
  const aura = clashground({
    id: "grant-aura",
    name: "Aura",
    colors: [],
    cost: { total: 0 },
    abilities: [
      {
        kind: "static",
        text: "Grant activation",
        grantAbility: {
          target: { type: "card", controller: "friendly", zones: ["clash"] },
          ability: {
            kind: "activated",
            text: "Granted sacrifice",
            phase: "primary",
            sendCost: {
              amount: 1,
              target: { type: "card", controller: "friendly", zones: ["clash"] },
            },
            effects: [{ type: "gainHealth", controller: "friendly", amount: 2 }],
          },
        },
      },
    ],
  });
  const remove = action({
    id: "grant-remove",
    name: "Remove",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [
      { type: "sendToOblivion", target: { type: "card", zones: ["clashground"], chosen: true } },
    ],
  });
  const g = Spec.fromFixture({
      definitions: [aura, remove],
      playerOne: { health: 20, clash: [host, host], clashground: [aura], hand: [remove] },
    }),
    ids = g.playerOne.instances(host).map((c) => c.instanceId),
    index = abilitiesOf(host).length;
  const e = new AlphaClashServerEngine(g.state, seats),
    id = `activateAbility:${ids[0]}:${index}`;
  expect(
    e
      .getInteractionView("p1")
      .actions.find((a) => a.id === id)
      ?.inputs.some((i) => i.id === "sendCostCardIds"),
  ).toBe(true);
  expect(submit(e, id, { sendCostCardIds: [ids[1]] }).success).toBe(true);
  expect(e.state.cards[ids[1]].zone).toBe("oblivion");
  expect(e.state.players["player-one"].health).toBe(22);
  const saved = Spec.fromState(e.state);
  saved.playerOne.play(remove, saved.playerOne.at(aura, "clashground"));
  settle(saved);
  const gone = new AlphaClashServerEngine(saved.state, seats);
  expect(gone.getInteractionView("p1").actions.some((a) => a.id === id)).toBe(false);
});
it("Jian's granted Counter - Attack is available on its attached host during the opponent's attack", () => {
  const jian = getCard("ac-ac3-077"),
    cao = getCard("ac-ac3-063"),
    g = Spec.fromFixture({
      playerOne: {
        clash: [{ card: cao, ready: false }],
        accessory: [jian],
        resource: [jian, jian],
        deck: [black],
      },
      playerTwo: { clash: [host], deck: [black] },
    });
  g.playerOne.attach(jian, cao);
  g.playerOne.endTurn();
  g.playerTwo.turn("skip");
  g.playerTwo.attack(host, g.playerOne.contender());
  const source = g.playerOne.at(cao, "clash").instanceId,
    index = abilitiesOf(cao).length,
    e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
    id = `activateAbility:${source}:${index}`;
  expect(e.getInteractionView("p1").actions.find((a) => a.id === id)?.enabled).toBe(true);
  const result = submit(e, id);
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(e.state.cards[source].ready).toBe(true);
  expect(e.state.clash?.requiredObstructorIds).toContain(source);
});
it("Suppression removes earlier temporary grants and a later grant remains available", () => {
  const suppress = action({
    id: "grant-suppress",
    name: "Suppress",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [
      { type: "suppressAbilities", target: { type: "card", zones: ["clash"], chosen: true } },
    ],
  });
  const g = Spec.fromFixture({
      definitions: [grant, suppress],
      playerOne: { hand: [grant, grant, suppress], clash: [host, host] },
    }),
    source = g.playerOne.instances(host)[0],
    target = g.playerOne.instances(host)[1],
    index = abilitiesOf(host).length;
  g.playerOne.play(g.playerOne.instances(grant).find((c) => c.zone === "hand")!, source);
  settle(g);
  g.playerOne.play(suppress, source);
  settle(g);
  let e = new AlphaClashServerEngine(g.state, seats),
    id = `activateAbility:${source.instanceId}:${index}`;
  expect(e.getInteractionView("p1").actions.some((a) => a.id === id)).toBe(false);
  g.playerOne.play(g.playerOne.instances(grant).find((c) => c.zone === "hand")!, source);
  settle(g);
  e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(e.getInteractionView("p1").actions.find((a) => a.id === id)?.enabled).toBe(true);
  expect(submit(e, id, { targetId: [target.instanceId] }).success).toBe(true);
});
it("A temporary grant disappears at expiry instead of leaving a stale action", () => {
  const { g, ids, index } = fixture();
  g.playerOne.endTurn();
  g.playerTwo.turn("skip");
  g.playerTwo.endTurn();
  g.playerOne.turn("skip");
  const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  expect(
    e
      .getInteractionView("p1")
      .actions.some((a) => a.id.startsWith(`activateAbility:${ids[0]}:${index}`)),
  ).toBe(false);
});
it("A granted requiredTargets ability retains its count and native selected-card binding", () => {
  const pair = action({
    id: "grant-pair",
    name: "Pair",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [
      {
        type: "grantAbility",
        target: { type: "card", zones: ["clash"], chosen: true },
        duration: "endOfTurn",
        ability: {
          kind: "activated",
          text: "Granted pair",
          phase: "primary",
          requiredTargets: {
            amount: 2,
            target: { type: "card", controller: "friendly", zones: ["clash"] },
          },
          effects: [
            {
              type: "modifyStats",
              target: { type: "selected", zones: ["clash"] },
              attack: 1,
              defense: 0,
              duration: "endOfTurn",
            },
          ],
        },
      },
    ],
  });
  const g = Spec.fromFixture({
      definitions: [pair],
      playerOne: { hand: [pair], clash: [host, host, host] },
    }),
    ids = g.playerOne.instances(host).map((c) => c.instanceId);
  g.playerOne.play(pair, g.state.cards[ids[0]]);
  settle(g);
  const e = new AlphaClashServerEngine(g.state, seats),
    id = `activateAbility:${ids[0]}:${abilitiesOf(host).length}`,
    input = e
      .getInteractionView("p1")
      .actions.find((a) => a.id === id)
      ?.inputs.find((i) => i.id === "targetIds");
  expect(input).toMatchObject({ kind: "entity-selection", min: 2, max: 2 });
  const before = structuredClone(e.state);
  expect(submit(e, id, { targetIds: [ids[1]] }).success).toBe(false);
  expect(e.state).toEqual(before);
  expect(submit(e, id, { targetIds: ids.slice(1) }).success).toBe(true);
  expect(Spec.fromState(e.state).atk(e.state.cards[ids[0]])).toBe(3);
  for (const selected of ids.slice(1))
    expect(Spec.fromState(e.state).atk(e.state.cards[selected])).toBe(4);
});
