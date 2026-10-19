import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const black = getCard("ac-ac4-008"),
  seats = { p1: "player-one", p2: "player-two" } as const;
// Explicit native-contract fixture; official cards' printed timing remains authoritative.
const fighter = getCard("ac-ac7-015"),
  abilityIndex = 2;
const grant = action({
  id: "predamage-grant",
  name: "Grant pre-damage ability",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [
    {
      type: "grantAbility",
      target: { type: "card", zones: ["clash"] },
      duration: "endOfTurn",
      ability: {
        kind: "activated",
        text: "Pay a black resource: target friendly Clash gets +2 attack",
        oncePerTurn: true,
        cost: { kind: "resources", cost: { total: 1, pips: { black: 1 } } },
        effects: [
          {
            type: "modifyStats",
            target: { type: "card", controller: "friendly", zones: ["clash"], chosen: true },
            attack: 2,
            defense: 0,
            duration: "endOfTurn",
          },
        ],
      },
    },
  ],
});
function fixture(foe = false) {
  const g = Spec.fromFixture({
    definitions: [grant],
    playerOne: { hand: [grant], clash: [fighter], resource: [black] },
    ...(foe ? { playerTwo: { clash: [{ card: fighter, ready: false }], resource: [black] } } : {}),
  });
  g.playerOne.play(grant);
  while (g.state.responseWindow && !g.state.pendingChoices.length)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  return g;
}
function submit(
  e: AlphaClashServerEngine,
  seat: "p1" | "p2",
  id: string,
  values: InteractionSubmission["values"] = {},
) {
  const view = e.getInteractionView(seat),
    a = view.actions.find((a) => a.id === id);
  if (!a) throw Error("Missing " + id);
  return e.submitInteraction(seat, buildInteractionSubmission({ view, action: a, values }), {
    gameId: "before-damage",
    sourceAuthority: "server",
  });
}
function beforeDamage() {
  const g = fixture(true);
  g.playerOne.attack(fighter, g.playerTwo.contender());
  g.playerTwo.passRound();
  g.playerTwo.passRound();
  g.playerOne.passRound();
  g.playerTwo.passRound();
  expect(g.state.clash?.step).toBe("beforeDamage");
  return g;
}
it("The attack interaction stops at a legal pre-damage activation instead of auto-passing it", () => {
  const g = fixture(),
    source = g.playerOne.at(fighter, "clash").instanceId,
    e = new AlphaClashServerEngine(g.state, seats);
  const attacked = submit(e, "p1", "initiateClash", {
    attackerId: [source],
    targetId: [g.playerTwo.contender().instanceId],
  });
  expect(attacked.success, JSON.stringify(attacked)).toBe(true);
  expect(e.state.clash?.step).toBe("beforeDamage");
  expect(e.state.players["player-two"].health).toBe(25);
  expect(e.getActivePlayerId()).toBe("p1");
  const saved = new AlphaClashServerEngine(JSON.parse(JSON.stringify(e.state)), seats),
    activated = submit(saved, "p1", `activateAbility:${source}:${abilityIndex}`, {
      targetId: [source],
    });
  expect(activated.success, JSON.stringify(activated)).toBe(true);
  expect(saved.state.players["player-two"].health).toBe(21);
  expect(saved.state.cards[g.playerOne.at(black, "resource").instanceId].ready).toBe(false);
  expect(saved.state.clash).toBeNull();
});
it("The pre-damage activation uses native target legality and is absent from the defender's actions", () => {
  const g = beforeDamage(),
    source = g.playerOne.at(fighter, "clash").instanceId,
    foe = g.playerTwo.at(fighter, "clash").instanceId;
  expect(
    applyCommand(structuredClone(g.state), {
      type: "activateAbility",
      playerId: "player-one",
      cardId: source,
      abilityIndex,
      targetId: source,
    }).success,
  ).toBe(true);
  const e = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats),
    id = `activateAbility:${source}:${abilityIndex}`;
  expect(e.getInteractionView("p1").actions.find((a) => a.id === id)?.enabled).toBe(true);
  expect(
    e
      .getInteractionView("p2")
      .actions.some((a) => a.id.startsWith("activateAbility:") && a.enabled),
  ).toBe(false);
  const before = structuredClone(e.state);
  expect(submit(e, "p1", id, { targetId: [foe] }).success).toBe(false);
  expect(e.state).toEqual(before);
});
it("Passing pre-damage priority does not leave an attacker activation available", () => {
  const g = beforeDamage(),
    source = g.playerOne.at(fighter, "clash").instanceId;
  g.playerOne.passRound();
  expect(g.state.clash?.attackerPassedBeforeDamage).toBe(true);
  const e = new AlphaClashServerEngine(g.state, seats);
  expect(
    e
      .getInteractionView("p1")
      .actions.some((a) => a.id === `activateAbility:${source}:${abilityIndex}` && a.enabled),
  ).toBe(false);
  expect(e.getActivePlayerId()).toBe("p2");
  const before = structuredClone(e.state);
  expect(
    e.dispatch(
      "activateAbility",
      "p1",
      { cardId: source, abilityIndex, targetId: source },
      { gameId: "before-damage", sourceAuthority: "server" },
    ).success,
  ).toBe(false);
  expect(e.state).toEqual(before);
});
