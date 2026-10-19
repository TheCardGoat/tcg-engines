import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const horseman = getCard("ac-ac2-123");
const ally = getCard("ac-ac1-055");
const hero = getCard("ac-ac2-098");
const context = { gameId: "horseman-choice", sourceAuthority: "server" as const };
function fixture() {
  const g = Spec.fromFixture({
    playerOne: { contender: hero, clash: [horseman] },
    playerTwo: { contender: hero, clash: [ally, ally] },
  });
  g.playerOne.attack(horseman, g.playerTwo.contender());
  return {
    engine: new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }),
    ids: g.playerTwo.instances(ally).map((c) => c.instanceId),
  };
}
function submit(engine: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("p2");
  const action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw Error("Missing defender choice");
  return engine.submitInteraction(
    "p2",
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}
it("Horseman's defender can select the second of two same-name allies through the simulator", () => {
  let { engine, ids } = fixture();
  expect(submit(engine, { confirm: true }).success).toBe(true);
  engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const view = engine.getInteractionView("p2");
  const input = view.actions.find((a) => a.id.startsWith("resolveChoice:"))?.inputs[0];
  if (input?.kind !== "option-selection") throw Error("Expected allies");
  expect(input.options.map((o) => o.entity?.instanceId)).toEqual(ids);
  expect(submit(engine, { selection: [input.options[1].id] }).success).toBe(true);
  expect(engine.state.cards[ids[0]].zone).toBe("clash");
  expect(engine.state.cards[ids[1]].zone).toBe("oblivion");
  expect(engine.state.players["player-two"].health).toBe(30);
});
it("Horseman's simulator prompt can decline and applies damage only to the defender", () => {
  const { engine, ids } = fixture();
  expect(submit(engine, { confirm: false }).success).toBe(true);
  expect(engine.state.players["player-two"].health).toBe(28);
  expect(engine.state.players["player-one"].health).toBe(30);
  for (const id of ids) expect(engine.state.cards[id].zone).toBe("clash");
});
