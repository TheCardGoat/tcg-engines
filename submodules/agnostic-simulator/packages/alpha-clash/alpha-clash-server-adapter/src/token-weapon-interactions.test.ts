import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const moxie = getCard("ac-ac4-128");
const weapon = getCard("ac-ac6-162");
const favorable = getCard("ac-ac2-117");
const seats = { p1: "player-one", p2: "player-two" } as const;
const context = { gameId: "token-weapons", sourceAuthority: "server" as const };
function settle(game: Spec) {
  for (let i = 0; i < 20 && game.state.responseWindow; i++)
    game.asPlayer(game.state.responseWindow.openFor).passRound();
  expect(game.state.pendingChoices).toEqual([]);
}
function badgeFixture(resourceCount = 6) {
  const game = Spec.fromFixture({
    playerOne: {
      hand: [moxie],
      clash: [moxie],
      resource: Array.from({ length: resourceCount }, () => weapon),
    },
    playerTwo: { clash: [moxie] },
  });
  game.playerOne.play(moxie);
  settle(game);
  const badge = Object.values(game.state.cards).find((card) => card.isToken);
  if (!badge) throw new Error("Moxie did not create a Badge");
  return {
    game,
    badgeId: badge.instanceId,
    hosts: game.playerOne.instances(moxie).map((card) => card.instanceId),
  };
}
function restore(game: Spec) {
  return new AlphaClashServerEngine(JSON.parse(JSON.stringify(game.state)), seats);
}
function submit(engine: AlphaClashServerEngine, actionId: string, targetId?: string) {
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((entry) => entry.id === actionId);
  expect(action?.enabled, actionId).toBe(true);
  if (!action) throw new Error(`Missing ${actionId}`);
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values: targetId ? { targetId: [targetId] } : {} }),
    context,
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
}
it("attaches, directly reattaches, and detaches a created Badge through saved interactions", () => {
  const { game, badgeId, hosts } = badgeFixture();
  const engine = restore(game);
  for (const targetId of hosts) {
    const native = applyCommand(structuredClone(engine.state), {
      type: "attachWeapon",
      playerId: "player-one",
      weaponId: badgeId,
      targetId,
    });
    expect(native.success, native.error).toBe(true);
    submit(engine, `attachWeapon:${badgeId}`, targetId);
    expect(engine.state.cards).toEqual(native.state.cards);
    expect(engine.state.cards[badgeId].attachedTo).toBe(targetId);
  }
  const saved = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
  const native = applyCommand(structuredClone(saved.state), {
    type: "detachWeapon",
    playerId: "player-one",
    weaponId: badgeId,
  });
  expect(native.success, native.error).toBe(true);
  submit(saved, `detachWeapon:${badgeId}`);
  expect(saved.state.cards).toEqual(native.state.cards);
  expect(saved.state.cards[badgeId].attachedTo).toBeUndefined();
  expect(saved.state.cards[badgeId].zone).toBe("accessory");
  expect(
    Object.values(saved.state.cards).filter((card) => card.zone === "resource" && !card.ready),
  ).toHaveLength(5);
});
it("lists a created Clash token as a legal host for a printed Weapon", () => {
  const game = Spec.fromFixture({
    playerOne: { hand: [favorable], accessory: [weapon], resource: [weapon, weapon, weapon] },
    playerTwo: { clash: [moxie] },
  });
  game.playerOne.play(favorable, game.playerTwo.at(moxie, "clash"));
  settle(game);
  const token = Object.values(game.state.cards).find((card) => card.isToken);
  if (!token) throw new Error("Favorable Outcome did not create a War Minion");
  const source = game.playerOne.at(weapon, "accessory").instanceId;
  const native = applyCommand(structuredClone(game.state), {
    type: "attachWeapon",
    playerId: "player-one",
    weaponId: source,
    targetId: token.instanceId,
  });
  expect(native.success, native.error).toBe(true);
  const engine = restore(game);
  submit(engine, `attachWeapon:${source}`, token.instanceId);
  expect(engine.state.cards).toEqual(native.state.cards);
  expect(engine.state.cards[source].attachedTo).toBe(token.instanceId);
});
it("keeps unaffordable Badge attachments disabled and excludes opposing hosts", () => {
  const { game, badgeId } = badgeFixture(2);
  const engine = restore(game);
  const action = engine
    .getInteractionView("p1")
    .actions.find((entry) => entry.id === `attachWeapon:${badgeId}`);
  expect(action).toBeDefined();
  expect(action?.enabled).toBe(false);
  const before = structuredClone(engine.state);
  expect(
    engine.dispatch(
      "attachWeapon",
      "p1",
      { cardId: badgeId, targetId: game.playerTwo.at(moxie, "clash").instanceId },
      context,
    ).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
});
