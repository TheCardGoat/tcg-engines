import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const aim = getCard("ac-ac5-043"),
  shadows = getCard("ac-cd1-006"),
  overseer = getCard("ac-ac4-008"),
  body = getCard("ac-ac3-007");
const context = { gameId: "aim-shadows-overseer", sourceAuthority: "server" as const };
function submit(
  engine: AlphaClashServerEngine,
  id: string,
  values: InteractionSubmission["values"],
) {
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id === id);
  if (!action) throw Error(`Missing ${id}`);
  return engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}
it.each([false, true])(
  "Overseer projects the send cost with its %s-Portal declared targets and submits both",
  (open) => {
    const g = Spec.fromFixture({
      portalOpen: open,
      playerOne: { clash: [overseer, body, body] },
      playerTwo: { oblivion: [body, body] },
    });
    const source = g.playerOne.at(overseer, "clash").instanceId,
      sent = g.playerOne.instances(body)[1].instanceId;
    const ids = g.playerTwo
      .instances(body)
      .slice(0, open ? 2 : 1)
      .map((c) => c.instanceId);
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
        p1: "player-one",
        p2: "player-two",
      }),
      id = `activateAbility:${source}:0`;
    const valueKey = open ? "targetIds" : "targetId";
    const before = structuredClone(engine.state);
    expect(submit(engine, id, { [valueKey]: ids }).success).toBe(false);
    expect(engine.state).toEqual(before);
    const result = submit(engine, id, { [valueKey]: ids, sendCostCardIds: [sent] });
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({ sendCostCardIds: [sent] });
    expect(engine.state.cards[sent].zone).toBe("oblivion");
    for (const id of ids) expect(engine.state.cards[id].zone).toBe("banished");
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-one" && c.definitionId === body.id && c.zone === "clash",
      ),
    ).toHaveLength(1);
  },
);
it("Taking Aim selects the second same-name Clash and spends engagement", () => {
  const g = Spec.fromFixture({ playerOne: { clash: [aim, body, body] } }),
    source = g.playerOne.at(aim, "clash").instanceId,
    ids = g.playerOne.instances(body).map((c) => c.instanceId);
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  expect(submit(engine, `activateAbility:${source}:0`, { targetId: [ids[1]] }).success).toBe(true);
  expect(engine.state.cards[source].ready).toBe(false);
  const saved = Spec.fromState(JSON.parse(JSON.stringify(engine.state)));
  expect(saved.atk(saved.state.cards[ids[0]])).toBe(2);
  expect(saved.atk(saved.state.cards[ids[1]])).toBe(4);
});
it("Clarity's Defeat prompt submits its declared friendly target through JSON", () => {
  const kill = action({
    id: "adapter-shadows-kill",
    name: "Defeat",
    colors: [],
    cost: { total: 0 },
    subtype: "basic",
    effects: [
      {
        type: "dealDamage",
        amount: 20,
        damageType: "non-clash",
        target: { type: "card", zones: ["clash"], chosen: true },
      },
    ],
  });
  const g = Spec.fromFixture({
    definitions: [kill],
    playerOne: { hand: [kill], clash: [shadows, body, body] },
    playerTwo: { clash: [body] },
  });
  const ids = g.playerOne.instances(body).map((c) => c.instanceId);
  g.playerOne.play(kill, g.playerOne.at(shadows, "clash"));
  for (let i = 0; i < 40 && g.state.responseWindow && !g.state.pendingChoices.length; i++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  const choice = g.state.pendingChoices[0];
  expect(choice).toMatchObject({ triggerTarget: expect.any(Object) });
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  expect(submit(engine, `resolveChoice:${choice.id}`, { selection: [ids[1]] }).success).toBe(true);
  expect(engine.state.cards[ids[1]].zone).toBe("oblivion");
  expect(engine.state.cards[ids[0]].zone).toBe("clash");
});
