import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const seats = { p1: "player-one", p2: "player-two" } as const,
  host = getCard("ac-ac7-015"),
  black = getCard("ac-ac4-008");
function submit(
  e: AlphaClashServerEngine,
  id: string,
  values: InteractionSubmission["values"] = {},
) {
  const view = e.getInteractionView("p1"),
    a = view.actions.find((a) => a.id === id);
  if (!a) throw Error("Missing " + id);
  return e.submitInteraction("p1", buildInteractionSubmission({ view, action: a, values }), {
    gameId: "activation-zones",
    sourceAuthority: "server",
  });
}
it.each(["ac-ac3-013", "ac-ac3-016"])(
  "Hand discard activation %s is selectable and pays its exact source",
  (cardId) => {
    const card = getCard(cardId),
      targetCard = getCard("ac-ac6-181"),
      g = Spec.fromFixture({
        playerOne: { hand: [card, card], clash: [targetCard] },
        playerTwo: { clash: [targetCard] },
      }),
      sources = g.playerOne.instances(card).map((c) => c.instanceId),
      target = g.playerOne.at(targetCard, "clash").instanceId,
      id = `activateAbility:${sources[1]}:0`;
    expect(
      applyCommand(structuredClone(g.state), {
        type: "activateAbility",
        playerId: "player-one",
        cardId: sources[1],
        abilityIndex: 0,
        ...(cardId === "ac-ac3-016" ? { targetId: target } : {}),
      }).success,
    ).toBe(true);
    const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    expect(e.getInteractionView("p1").actions.find((a) => a.id === id)?.enabled).toBe(true);
    expect(e.getInteractionView("p2").actions.some((a) => a.id === id)).toBe(false);
    const result = submit(e, id, cardId === "ac-ac3-016" ? { targetId: [target] } : {});
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(e.state.cards[sources[1]].zone).toBe("oblivion");
    expect(e.state.cards[sources[0]].zone).toBe("hand");
    if (cardId === "ac-ac3-013") expect(e.state.portalOpen).toBe(true);
    else expect(Spec.fromState(e.state).atk(e.state.cards[target])).toBe(5);
  },
);
it.each([4, 5])(
  "Haven's Favorite Rock is exposed in the Resource Step with native %i-counter eligibility",
  (counters) => {
    const rock = getCard("ac-ac2-088"),
      g = Spec.fromFixture({
        phase: { name: "expansion", step: "resource" },
        playerOne: {
          accessory: [{ card: rock, counters: { collection: counters } }],
          hand: [black],
          deck: [host, black],
        },
      }),
      source = g.playerOne.at(rock, "accessory").instanceId,
      top = g.state.deckOrder["player-one"][0],
      id = `activateAbility:${source}:0`,
      e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
    expect(
      applyCommand(structuredClone(g.state), {
        type: "activateAbility",
        playerId: "player-one",
        cardId: source,
        abilityIndex: 0,
      }).success,
    ).toBe(counters === 5);
    expect(e.getInteractionView("p1").actions.find((a) => a.id === id)?.enabled).toBe(
      counters === 5,
    );
    const before = structuredClone(e.state),
      result = submit(e, id);
    expect(result.success, JSON.stringify(result)).toBe(counters === 5);
    if (counters === 4) expect(e.state).toEqual(before);
    else {
      expect(e.state.cards[top].zone).toBe("resource");
      const saved = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats);
      expect(saved.getInteractionView("p1").actions.some((a) => a.id === id && a.enabled)).toBe(
        false,
      );
      expect(
        saved.getInteractionView("p1").actions.some((a) => a.id === "deployResource" && a.enabled),
      ).toBe(false);
    }
  },
);
