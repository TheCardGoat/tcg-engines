import { expect, it } from "vite-plus/test";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const titan = getCard("ac-ac6-175"),
  black = getCard("ac-ac4-008"),
  green = getCard("ac-ac2-025");
const first = clashCard({
  id: "adapter-titan-first",
  name: "Ally",
  characterName: "Thragor",
  colors: [],
  affiliation: "discarded",
  cost: { total: 0 },
  attack: 1,
  defense: 4,
});
const second = clashCard({
  ...first,
  affiliation: "discarded",
  id: "adapter-titan-second",
  name: "Partner",
  characterName: "Cadavros",
});
const context = { gameId: "titan-audit", sourceAuthority: "server" as const };
it.each([true, false])(
  "Dread Titan quotes and pays its character-based Oblivion cost through saved interactions (eligible: %s)",
  (eligible) => {
    const a = eligible ? first : { ...first, name: "Thragor's follower", characterName: "Moxie" },
      b = eligible ? second : { ...second, name: "Cadavros's follower", characterName: "Haven" };
    const g = Spec.fromFixture({
      definitions: [a, b],
      playerOne: {
        clash: [a, b],
        oblivion: [titan],
        resource: [black, black, black, green, green, green, green, green, green],
      },
    });
    const id = g.playerOne.at(titan, "oblivion").instanceId;
    const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const view = engine.getInteractionView("p1"),
      action = view.actions.find((a) => a.id === `playCard:${id}`);
    if (!action) throw Error("Missing Titan replay");
    const payment = action.inputs.find((i) => i.id === "resourcePayment");
    expect(payment).toMatchObject({
      kind: "option-selection",
      min: eligible ? 7 : 9,
      max: eligible ? 7 : 9,
    });
    if (payment?.kind !== "option-selection") throw Error("Missing payment");
    const resources = Object.values(engine.state.cards).filter(
      (c) => c.zone === "resource" && c.controller === "player-one",
    );
    const selected = (
      eligible
        ? [
            resources[0],
            resources[1],
            resources[3],
            resources[2],
            resources[4],
            resources[5],
            resources[6],
          ]
        : resources
    ).map((c) => JSON.stringify([c.instanceId, c.definitionId === black.id ? "black" : "green"]));
    const before = structuredClone(engine.state);
    const short = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values: { resourcePayment: selected.slice(1) } }),
      context,
    );
    expect(short.success).toBe(false);
    expect(engine.state).toEqual(before);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values: { resourcePayment: selected } }),
      context,
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(engine.state.cards[id].zone).toBe("clash");
    expect(resources.filter((c) => !engine.state.cards[c.instanceId].ready)).toHaveLength(
      eligible ? 7 : 9,
    );
    const saved = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    expect(saved.getInteractionView("p1").actions.some((a) => a.id === `playCard:${id}`)).toBe(
      false,
    );
  },
);
