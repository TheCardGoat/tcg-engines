import { expect, it } from "vite-plus/test";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const morac = getCard("ac-ac3-011"),
  black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
const body = clashCard({
  id: "adapter-devourer-eligible",
  name: "Morac's Challenger",
  characterName: "Krung",
  affiliation: "discarded",
  colors: [],
  cost: { total: 3 },
  attack: 1,
  defense: 8,
});
const excluded = clashCard({
  ...body,
  id: "adapter-devourer-excluded",
  name: "Another title",
  characterName: "Morac",
  affiliation: "discarded",
});
function submit(e: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = e.getInteractionView("p1"),
    a = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!a) throw Error("Expected choice");
  return e.submitInteraction("p1", buildInteractionSubmission({ view, action: a, values }), {
    gameId: "morac-audit",
    sourceAuthority: "server",
  });
}
it("Morac's search presents only eligible character identities and restores the selected duplicate", () => {
  const g = Spec.fromFixture({
      definitions: [body, excluded],
      playerOne: { hand: [morac], resource: [black, black, black], deck: [excluded, body, body] },
    }),
    ids = g.state.deckOrder["player-one"].slice();
  g.playerOne.play(morac);
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  let e = new AlphaClashServerEngine(g.state, seats);
  const yes = submit(e, { confirm: true });
  expect(yes.success, JSON.stringify(yes)).toBe(true);
  e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
  const input = e
    .getInteractionView("p1")
    .actions.find((a) => a.id.startsWith("resolveChoice:"))
    ?.inputs.find((i) => i.id === "selection");
  if (input?.kind !== "option-selection") throw Error("Expected card picker");
  expect(input.options.flatMap((o) => (o.entity ? [o.entity.instanceId] : []))).toEqual([
    ids[1],
    ids[2],
  ]);
  const chosen = input.options.find((o) => o.entity?.instanceId === ids[2]);
  if (!chosen) throw Error("Missing duplicate");
  const before = structuredClone(e.state);
  expect(submit(e, { selection: [ids[0]] }).success).toBe(false);
  expect(e.state).toEqual(before);
  const result = submit(e, { selection: [chosen.id], destination: ["player-one:hand"] });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(e.state.cards[ids[2]].zone).toBe("hand");
  expect(e.state.cards[ids[1]].zone).toBe("deck");
  expect(e.state.moveLog.filter((x) => x.type === "effect.reveal")).toHaveLength(1);
  expect(e.state.moveLog.filter((x) => x.type === "effect.shuffle")).toHaveLength(1);
});
it("Morac's search can finish without choosing an eligible card and still shuffles", () => {
  const g = Spec.fromFixture({
    definitions: [body],
    playerOne: { hand: [morac], resource: [black, black, black], deck: [body] },
  });
  g.playerOne.play(morac);
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  let e = new AlphaClashServerEngine(g.state, seats);
  expect(submit(e, { confirm: true }).success).toBe(true);
  e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
  const input = e
    .getInteractionView("p1")
    .actions.find((a) => a.id.startsWith("resolveChoice:"))
    ?.inputs.find((i) => i.id === "selection");
  if (input?.kind !== "option-selection") throw Error("Expected picker");
  const done = input.options.find((o) => o.text.key === "Done");
  if (!done) throw Error("Missing Done");
  const result = submit(e, { selection: [done.id] });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(Spec.fromState(e.state).playerOne.handCount()).toBe(0);
  expect(e.state.moveLog.filter((x) => x.type === "effect.shuffle")).toHaveLength(1);
  expect(e.state.moveLog.filter((x) => x.type === "effect.reveal")).toHaveLength(0);
});
