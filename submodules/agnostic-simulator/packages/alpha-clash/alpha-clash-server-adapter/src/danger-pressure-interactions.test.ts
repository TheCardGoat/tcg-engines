import { expect, it } from "vite-plus/test";
import { clashCard, contender, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const danger = getCard("ac-sotv-034"),
  trap = getCard("ac-ac1-019"),
  ambush = getCard("ac-ac6-120"),
  blue = getCard("ac-ac4-113"),
  body = getCard("ac-ac3-007"),
  pressure = getCard("ac-ac4-006"),
  black = getCard("ac-ac4-008");
const context = { gameId: "danger-pressure-audit", sourceAuthority: "server" as const };
function submit(
  engine: AlphaClashServerEngine,
  actor: string,
  values: InteractionSubmission["values"],
  id?: string,
) {
  const view = engine.getInteractionView(actor),
    action = view.actions.find((a) => (id ? a.id === id : a.id.startsWith("resolveChoice:")));
  if (!action) throw Error("Missing action " + id);
  return engine.submitInteraction(
    actor,
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}
it.each([false, true])(
  "Danger exposes only facedown Accessories and completes the selected branch (Ambush: %s)",
  (isAmbush) => {
    const chosen = isAmbush ? ambush : trap,
      g = Spec.fromFixture({
        playerOne: { hand: [danger], resource: [blue], accessory: [trap] },
        playerTwo: {
          accessory: [{ card: chosen, faceDown: true, setOnTurn: 1 }],
          hand: [body, body],
        },
      }),
      id = g.playerTwo.at(chosen, "accessory").instanceId,
      source = g.playerOne.hand(danger).instanceId,
      copies = g.playerTwo.instances(body).map((c) => c.instanceId),
      resource = g.playerOne.at(blue, "resource").instanceId;
    let engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const action = engine
        .getInteractionView("p1")
        .actions.find((a) => a.id === `playCard:${source}`),
      input = action?.inputs.find((i) => i.id === "targetId");
    expect(input).toMatchObject({ kind: "entity-selection", required: true, min: 1, max: 1 });
    if (input?.kind !== "entity-selection") throw Error("Missing target picker");
    expect(input.candidates.map((c) => c.entity.instanceId)).toEqual([id]);
    const before = structuredClone(engine.state);
    expect(
      submit(
        engine,
        "p1",
        { resourcePayment: [JSON.stringify([resource, "blue"])] },
        `playCard:${source}`,
      ).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
    expect(
      submit(
        engine,
        "p1",
        { targetId: [id], resourcePayment: [JSON.stringify([resource, "blue"])] },
        `playCard:${source}`,
      ).success,
    ).toBe(true);
    if (isAmbush) {
      expect(engine.state.cards[id].zone).toBe("oblivion");
      expect(engine.state.pendingChoices).toHaveLength(0);
    } else {
      expect(engine.state.cards[id].zone).toBe("hand");
      engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
        p1: "player-one",
        p2: "player-two",
      });
      expect(submit(engine, "p2", { selection: [copies[1]] }).success).toBe(true);
      expect(engine.state.cards[copies[1]].zone).toBe("oblivion");
    }
    expect(engine.state.cards[copies[0]].zone).toBe("hand");
  },
);
it.each([false, true])(
  "Under Pressure preserves its target and optional discard through saved interactions (accept: %s)",
  (accept) => {
    const hero = contender({
      id: "pressure-audit-hero",
      name: "Hero",
      colors: ["black"],
      affiliation: "harbinger",
      health: 30,
      attack: 0,
      defense: 0,
    });
    const ally = clashCard({
      id: "pressure-audit-ally",
      name: "Ally",
      colors: [],
      affiliation: "alpha",
      cost: { total: 0 },
      attack: 2,
      defense: 4,
    });
    const g = Spec.fromFixture({
        definitions: [hero, ally],
        turnNumber: 3,
        playerOne: {
          contender: hero,
          clash: [ally],
          hand: [pressure, body, body],
          resource: [black, black],
          oblivion: Array(14).fill(black),
          deck: [body, body],
        },
        playerTwo: { contender: hero },
      }),
      id = g.playerOne.at(ally, "clash").instanceId,
      source = g.playerOne.hand(pressure).instanceId,
      resource = g.playerOne.instances(black).filter((c) => c.zone === "resource")[1].instanceId,
      copies = g.playerOne
        .instances(body)
        .filter((c) => c.zone === "hand")
        .map((c) => c.instanceId);
    g.playerOne.attack(ally, g.playerTwo.contender());
    g.playerTwo.passRound();
    g.playerTwo.passRound();
    let engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const played = submit(
      engine,
      "p1",
      { targetId: [id], resourcePayment: [JSON.stringify([resource, "black"])] },
      `playCard:${source}`,
    );
    expect(played.success, JSON.stringify(played)).toBe(true);
    const accepted = submit(engine, "p1", { confirm: accept });
    expect(accepted.success, JSON.stringify(accepted)).toBe(true);
    engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    if (accept) expect(submit(engine, "p1", { selection: [copies[1]] }).success).toBe(true);
    const saved = Spec.fromState(engine.state);
    expect(saved.playerOne.handCount()).toBe(accept ? 3 : 2);
    expect(saved.atk(saved.state.cards[id])).toBe(accept ? 4 : 3);
    expect(saved.dfn(saved.state.cards[id])).toBe(accept ? 6 : 5);
    expect(engine.state.cards[copies[0]].zone).toBe("hand");
    expect(engine.state.cards[copies[1]].zone).toBe(accept ? "oblivion" : "hand");
    expect(engine.state.cards[source].zone).toBe("oblivion");
    expect(engine.state.cards[resource].ready).toBe(false);
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.zone === "resource" && c.controller === "player-one" && c.ready,
      ),
    ).toHaveLength(1);
  },
);
