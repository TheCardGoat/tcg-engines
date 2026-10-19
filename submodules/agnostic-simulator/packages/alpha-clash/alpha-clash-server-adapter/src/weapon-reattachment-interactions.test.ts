import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const weapon = getCard("ac-ac6-162"); // Conquering Might: attach RR without a Clashground.
const body = getCard("ac-ac6-181");
const seats = { p1: "player-one", p2: "player-two" } as const;
function setup(resources = 6) {
  const g = Spec.fromFixture({
    playerOne: {
      accessory: [weapon, weapon],
      clash: [body, body, body],
      resource: Array.from({ length: resources }, () => weapon),
    },
    playerTwo: { clash: [body] },
  });
  const weapons = g.playerOne.instances(weapon).filter((card) => card.zone === "accessory");
  const hosts = g.playerOne.instances(body);
  for (const [index, target] of [hosts[0], hosts[2]].entries()) {
    g.run({
      type: "attachWeapon",
      playerId: "player-one",
      weaponId: weapons[index].instanceId,
      targetId: target.instanceId,
    });
  }
  return { g, source: weapons[0].instanceId, hosts: hosts.map((card) => card.instanceId) };
}
it("reattaches an attached Weapon directly for one attach payment after JSON restore (305.8)", () => {
  const { g, source, hosts } = setup();
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), seats);
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((action) => action.id === `attachWeapon:${source}`);
  expect(action?.enabled).toBe(true);
  if (!action) throw Error("Missing reattachment action");
  expect(view.actions.find((action) => action.id === `detachWeapon:${source}`)?.enabled).toBe(true);
  const input = action.inputs[0];
  if (input.kind !== "entity-selection") throw Error("Missing host selection");
  expect(
    input.candidates.find((candidate) => candidate.entity.instanceId === hosts[1])?.enabled,
  ).toBe(true);
  expect(
    input.candidates.find((candidate) => candidate.entity.instanceId === hosts[2])?.enabled,
  ).toBe(false);
  expect(
    input.candidates.some(
      (candidate) => candidate.entity.instanceId === g.playerTwo.at(body, "clash").instanceId,
    ),
  ).toBe(false);
  const native = applyCommand(structuredClone(g.state), {
    type: "attachWeapon",
    playerId: "player-one",
    weaponId: source,
    targetId: hosts[1],
  });
  expect(native.success).toBe(true);
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values: { targetId: [hosts[1]] } }),
    { gameId: "reattach", sourceAuthority: "server" },
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(engine.state.cards[source].attachedTo).toBe(hosts[1]);
  expect(engine.state.cards).toEqual(native.state.cards);
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && !card.ready),
  ).toHaveLength(6);
});
it("disables direct reattachment when its actual attach payment is unavailable", () => {
  const { g, source, hosts } = setup(4);
  expect(
    applyCommand(structuredClone(g.state), {
      type: "attachWeapon",
      playerId: "player-one",
      weaponId: source,
      targetId: hosts[1],
    }).success,
  ).toBe(false);
  const engine = new AlphaClashServerEngine(g.state, seats);
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((action) => action.id === `attachWeapon:${source}`);
  expect(action).toBeDefined();
  expect(action?.enabled).toBe(false);
});
