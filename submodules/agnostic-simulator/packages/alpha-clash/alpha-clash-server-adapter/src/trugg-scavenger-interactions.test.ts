import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const trugg = getCard("ac-ac6-181"),
  gur = getCard("ac-ac3-007"),
  black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
function fixture() {
  const g = Spec.fromFixture({
    portalOpen: true,
    playerOne: {
      clash: [trugg],
      oblivion: [gur, gur],
      resource: [
        { card: black, ready: false },
        { card: black, ready: false },
      ],
    },
  });
  return {
    g,
    source: g.playerOne.at(trugg, "clash").instanceId,
    copies: g.playerOne.instances(gur).map((c) => c.instanceId),
    resources: g.playerOne.instances(black).map((c) => c.instanceId),
  };
}
function submit(e: AlphaClashServerEngine, values: InteractionSubmission["values"], id?: string) {
  const view = e.getInteractionView("p1"),
    a = view.actions.find((a) => (id ? a.id === id : a.id.startsWith("resolveChoice:")));
  if (!a) throw Error("Missing action " + id);
  return e.submitInteraction("p1", buildInteractionSubmission({ view, action: a, values }), {
    gameId: "trugg-audit",
    sourceAuthority: "server",
  });
}
it("Trugg declares its return target before offering the optional banish, which may be declined", () => {
  const { g, source, copies } = fixture();
  const e = new AlphaClashServerEngine(g.state, seats),
    before = structuredClone(e.state);
  expect(submit(e, {}, `activateAbility:${source}:1`).success).toBe(false);
  expect(e.state).toEqual(before);
  const activated = submit(e, { targetId: [copies[1]] }, `activateAbility:${source}:1`);
  expect(activated.success, JSON.stringify(activated)).toBe(true);
  expect(submit(e, { confirm: false }).success).toBe(true);
  for (const id of copies) expect(e.state.cards[id].zone).toBe("oblivion");
  const saved = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
  expect(
    saved
      .getInteractionView("p1")
      .actions.some((action) => action.id === `activateAbility:${source}:1` && action.enabled),
  ).toBe(false);
});
it.each([false, true])(
  "Trugg's saved choices banish one duplicate and return the other, with independent Ambush acceptance (%s)",
  (set) => {
    const { g, source, copies, resources } = fixture();
    let e = new AlphaClashServerEngine(g.state, seats);
    const activated = submit(e, { targetId: [copies[1]] }, `activateAbility:${source}:1`);
    expect(activated.success, JSON.stringify(activated)).toBe(true);
    expect(submit(e, { confirm: true }).success).toBe(true);
    e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
    const input = e
      .getInteractionView("p1")
      .actions.find((a) => a.id.startsWith("resolveChoice:"))
      ?.inputs.find((i) => i.id === "selection");
    if (input?.kind !== "option-selection") throw Error("Expected banish selection");
    expect(input.options.map((o) => o.entity?.instanceId)).toEqual(copies);
    const chosen = input.options.find((o) => o.entity?.instanceId === copies[0]);
    if (!chosen) throw Error("Missing first copy");
    const selected = submit(e, { selection: [chosen.id] });
    expect(selected.success, JSON.stringify(selected)).toBe(true);
    expect(e.state.cards[copies[0]].zone).toBe("banished");
    expect(e.state.cards[copies[1]].zone).toBe("hand");
    e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
    expect(submit(e, { confirm: set }).success).toBe(true);
    if (set) {
      const ready = submit(e, { selection: [resources[1]] });
      expect(ready.success, JSON.stringify(ready)).toBe(true);
      expect(e.state.cards[copies[1]]).toMatchObject({
        zone: "accessory",
        faceDown: true,
        setOnTurn: e.state.turnNumber,
      });
      expect(e.state.cards[resources[1]].ready).toBe(true);
    } else expect(e.state.cards[copies[1]].zone).toBe("hand");
    expect(e.state.cards[resources[0]].ready).toBe(false);
  },
);
