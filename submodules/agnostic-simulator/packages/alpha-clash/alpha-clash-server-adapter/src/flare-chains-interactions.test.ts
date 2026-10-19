import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const flare = getCard("ac-ks-ac1-107"),
  chains = getCard("ac-ac7-205"),
  linn = getCard("ac-ac1-057"),
  haven = getCard("ac-ac1-051"),
  conquest = getCard("ac-ac4-147");
const context = { gameId: "flare-chains", sourceAuthority: "server" as const };
it("Flare's attack interaction resolves its untargeted sweep without a target prompt", () => {
  const g = Spec.fromFixture({
    playerOne: { clash: [flare, { card: conquest, ready: false }] },
    playerTwo: { clash: [linn, haven] },
  });
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const havenId = g.playerTwo.at(haven, "clash").instanceId;
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id === "initiateClash");
  if (!action) throw Error("Missing attack");
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action,
      values: {
        attackerId: [g.playerOne.at(flare, "clash").instanceId],
        targetId: [g.playerTwo.contender().instanceId],
      },
    }),
    context,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.cards[g.playerOne.at(flare, "clash").instanceId].phaseDamage).toBe(0);
  expect(engine.state.cards[g.playerOne.at(conquest, "clash").instanceId].phaseDamage).toBe(2);
  expect(engine.state.cards[g.playerTwo.at(linn, "clash").instanceId].phaseDamage).toBe(2);
  expect(engine.state.cards[havenId].zone).toBe("oblivion");
});
it("Chains cannot be activated through the adapter during before-damage priority", () => {
  const g = Spec.fromFixture({ playerOne: { clash: [conquest], accessory: [chains] } });
  g.playerOne.attack(conquest, g.playerTwo.contender());
  g.playerTwo.passRound();
  g.playerTwo.passRound();
  g.playerOne.passRound();
  g.playerTwo.passRound();
  expect(g.state.clash?.step).toBe("beforeDamage");
  const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
  const cardId = g.playerOne.at(chains, "accessory").instanceId;
  const before = structuredClone(engine.state);
  expect(
    engine.getInteractionView("p1").actions.find((a) => a.id === `activateAbility:${cardId}:0`)
      ?.enabled,
  ).not.toBe(true);
  expect(
    engine.dispatch("activateAbility", "p1", { cardId, abilityIndex: 0 }, context).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
});
