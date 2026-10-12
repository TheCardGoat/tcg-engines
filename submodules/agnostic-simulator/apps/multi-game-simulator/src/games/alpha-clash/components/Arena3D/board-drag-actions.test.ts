import { expect, test } from "vitest";
import { projectState } from "@tcg/alpha-clash-engine";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { parseProjectedState } from "../../pages/LiveMatch.page";
import { createCombatCounterFixture } from "../../combat-fixture";
import { alphaClashVisualFixtures, createAlphaClashVisualFixture } from "../../visual-fixtures";
import { fixtureAttack, fixtureSubmit } from "../../native-fixture-test-actions";
import { boardDragActions } from "./board-drag-actions";
import type { AcSeat } from "../board-types";

function routes(engine: AlphaClashServerEngine, seat: AcSeat = "player-one") {
  const board = parseProjectedState(projectState(engine.state, seat));
  if (!board) throw new Error("Invalid native projection");
  const view = engine.getInteractionView(seat === "player-one" ? "human" : "bot");
  return { board, view, routes: boardDragActions(board, view.actions) };
}

test("Missile Barrage drops into Accessories through its native Set action", () => {
  const engine = createCombatCounterFixture();
  const before = routes(engine);
  const missile = before.board.cards.find((card) => card.name === "Missile Barrage")!;
  const drop = before.routes.find((route) => route.sourceId === missile.instanceId)!;
  expect(drop.destination).toBe("accessory");
  expect(drop.action.id).toBe(`setCard:${missile.instanceId}`);
  fixtureSubmit(engine, drop.action.id, drop.values);
  const after = routes(engine);
  expect(after.board.cards.find((card) => card.instanceId === missile.instanceId)).toMatchObject({
    zone: "accessory",
    faceDown: true,
  });
  expect(after.routes.some((route) => route.sourceId === missile.instanceId)).toBe(false);
});

test("attack drops select native attacker-specific legal targets", () => {
  const engine = createCombatCounterFixture();
  const before = routes(engine);
  const attack = before.routes.find((route) => route.action.id === "initiateClash")!;
  expect(Object.values(attack.values)).toContainEqual([attack.destination.slice("card:".length)]);
  fixtureSubmit(engine, attack.action.id, attack.values);
  expect(engine.state.clash?.attackerId).toBe(attack.sourceId);
});

test("Counter responses remain draggable outside Primary", () => {
  const engine = createCombatCounterFixture();
  fixtureAttack(engine);
  const response = routes(engine, "player-two");
  const earth = response.board.cards.find(
    (card) => card.zone === "hand" && card.controller === "player-two",
  )!;
  const drops = response.routes.filter((route) => route.sourceId === earth.instanceId);
  expect(drops.some((route) => route.action.id === `respond:${earth.instanceId}`)).toBe(true);
  expect(drops.some((route) => route.destination === "clash")).toBe(true);
  expect(drops.some((route) => route.destination.startsWith("card:"))).toBe(true);
});

test("weapon drops attach to legal targets and detach back to Accessories", () => {
  const engine = createAlphaClashVisualFixture("board-actions");
  const attach = routes(engine).routes.find((route) =>
    route.action.id.startsWith("attachWeapon:"),
  )!;
  fixtureSubmit(engine, attach.action.id, attach.values);
  expect(engine.state.cards[attach.sourceId].attachedTo).toBe(
    attach.destination.slice("card:".length),
  );
  const detach = routes(engine).routes.find(
    (route) => route.action.id === `detachWeapon:${attach.sourceId}`,
  )!;
  expect(detach.destination).toBe("accessory");
  fixtureSubmit(engine, detach.action.id, detach.values);
  expect(engine.state.cards[attach.sourceId].attachedTo).toBeUndefined();
});

test("attack drop targets stay scoped to each native attacker", () => {
  const current = routes(createAlphaClashVisualFixture("combat-target-legality"));
  const attack = current.view.actions.find((action) => action.id === "initiateClash")!;
  for (const route of current.routes.filter((route) => route.action.id === attack.id)) {
    const targets = attack.inputs.find(
      (input) => input.id === `targetId:${route.sourceId}` || input.id === "targetId",
    );
    if (targets?.kind !== "entity-selection") throw new Error("Missing native targets");
    expect(
      targets.candidates.some(
        (candidate) =>
          candidate.enabled && route.destination === `card:${candidate.entity.instanceId}`,
      ),
    ).toBe(true);
  }
  const disabled = current.view.actions.map((action) => ({ ...action, enabled: false }));
  expect(boardDragActions(current.board, disabled)).toEqual([]);
});

test("every enabled card action in the native fixture catalog has a drag route", () => {
  for (const fixture of alphaClashVisualFixtures) {
    const engine = createAlphaClashVisualFixture(fixture.id);
    for (const seat of ["player-one", "player-two"] as const) {
      const current = routes(engine, seat);
      for (const action of current.view.actions) {
        if (!action.enabled || !action.source?.instanceId) continue;
        expect(
          current.routes.some((route) => route.action.id === action.id),
          `${fixture.id}: ${action.id}`,
        ).toBe(true);
      }
      const enabledIds = new Set(
        current.view.actions.filter((action) => action.enabled).map((action) => action.id),
      );
      expect(current.routes.every((route) => enabledIds.has(route.action.id))).toBe(true);
    }
  }
});
