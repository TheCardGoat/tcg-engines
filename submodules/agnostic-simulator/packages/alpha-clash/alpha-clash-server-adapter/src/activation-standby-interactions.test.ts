import { expect, it } from "vite-plus/test";
import { clashCard, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
it("a send-cost trigger interrupts the activation interaction and resumes its saved Standby ability afterward", () => {
  const overseer = getCard("ac-ac4-008"),
    victim = getCard("ac-ac1-051");
  const donor = clashCard({
    id: "adapter-activation-order-donor",
    name: "Send cost observer",
    affiliation: "alpha",
    colors: [],
    cost: { total: 0 },
    attack: 1,
    defense: 4,
    abilities: [
      {
        kind: "triggered",
        text: "Return opposing Oblivion card",
        trigger: { event: "sentToOblivion" },
        effects: [
          {
            type: "returnToHand",
            target: { type: "card", controller: "opponent", zones: ["oblivion"], chosen: true },
          },
        ],
      },
    ],
  });
  const g = Spec.fromFixture({
    definitions: [donor],
    playerOne: { clash: [overseer, donor] },
    playerTwo: { oblivion: [victim] },
  });
  const source = g.playerOne.at(overseer, "clash").instanceId,
    sent = g.playerOne.at(donor, "clash").instanceId,
    target = g.playerTwo.at(victim, "oblivion").instanceId;
  const context = { gameId: "activation-order", sourceAuthority: "server" as const };
  let engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id === `activateAbility:${source}:0`);
  if (!action) throw Error("Missing activation");
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: { targetId: [target], sendCostCardIds: [sent] },
      }),
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.cards[sent].zone).toBe("oblivion");
  expect(engine.state.cards[target].zone).toBe("oblivion");
  expect(engine.state.standby).toHaveLength(1);
  expect(engine.state.responseWindow).toBeNull();
  expect(engine.getInteractionView("p2").actions.map((action) => action.id)).toEqual(["concede"]);
  engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const pending = engine.getInteractionView("p1"),
    choice = pending.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!choice) throw Error("Missing cost-trigger target declaration");
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view: pending,
        action: choice,
        values: { selection: [target] },
      }),
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.cards[target].zone).toBe("hand");
  expect(engine.state.standby).toHaveLength(0);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.responseWindow).toBeNull();
});
