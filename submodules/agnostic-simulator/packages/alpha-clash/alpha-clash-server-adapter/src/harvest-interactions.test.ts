import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const harvest = getCard("ac-ac4-029"),
  body = getCard("ac-ac3-007"),
  black = getCard("ac-ac4-008");
const context = { gameId: "harvest-audit", sourceAuthority: "server" as const };
function submit(engine: AlphaClashServerEngine, actor: string, id?: string) {
  const view = engine.getInteractionView(actor),
    action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw Error("Missing Harvest choice");
  const input = action.inputs.find((i) => i.id === "selection");
  if (input?.kind !== "option-selection") throw Error("Missing options");
  const option = input.options.find((o) =>
    id ? o.entity?.instanceId === id : o.text.key === "Done",
  );
  if (!option) throw Error("Missing Harvest option");
  return engine.submitInteraction(
    actor,
    buildInteractionSubmission({ view, action, values: { selection: [option.id] } }),
    context,
  );
}
it("Harvest identifies individual duplicate copies for each seat and preserves both choices through JSON", () => {
  const g = Spec.fromFixture({
      playerOne: {
        hand: [harvest],
        oblivion: [body, body],
        resource: [black, black],
        deck: [black],
      },
      playerTwo: { oblivion: [body, body], deck: [black] },
    }),
    a = g.playerOne.instances(body).map((c) => c.instanceId),
    b = g.playerTwo.instances(body).map((c) => c.instanceId);
  g.playerOne.playAndResolve(harvest);
  let engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const action = engine
      .getInteractionView("p1")
      .actions.find((a) => a.id.startsWith("resolveChoice:")),
    input = action?.inputs[0];
  if (input?.kind !== "option-selection") throw Error("Missing options");
  expect(input.options.filter((o) => o.entity).map((o) => o.entity?.instanceId)).toEqual(a);
  expect(input.options.find((o) => o.text.key === "Done")?.entity).toBeUndefined();
  expect(submit(engine, "p1", a[1]).success).toBe(true);
  expect(submit(engine, "p1").success).toBe(true);
  expect(engine.state.cards[a[1]].zone).toBe("oblivion");
  engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  expect(submit(engine, "p2", b[0]).success).toBe(true);
  expect(submit(engine, "p2").success).toBe(true);
  expect(engine.state.cards[a[1]].zone).toBe("banished");
  expect(engine.state.cards[b[0]].zone).toBe("banished");
  expect(engine.state.cards[a[0]].zone).toBe("oblivion");
  expect(engine.state.cards[b[1]].zone).toBe("oblivion");
  expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(1);
  expect(Spec.fromState(engine.state).playerTwo.handCount()).toBe(1);
});
it("Harvest exposes Done without requiring a card selection", () => {
  const g = Spec.fromFixture({
    playerOne: { hand: [harvest], oblivion: [body], resource: [black, black] },
    playerTwo: { oblivion: [body] },
  });
  g.playerOne.playAndResolve(harvest);
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  expect(submit(engine, "p1").success).toBe(true);
  expect(submit(engine, "p2").success).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(Spec.fromState(engine.state).playerOne.zone(body)).toBe("oblivion");
  expect(Spec.fromState(engine.state).playerTwo.zone(body)).toBe("oblivion");
});
