/**
 * HVY204 Ticket Puncher — Generic Arms Blade Break (set-base {d}).
 *
 * Printed:
 *   Ticket Puncher's {d} is equal to the number of opposing heroes with
 *   greater {h} than you.
 *   Blade Break
 *
 * Reasoning (case-by-case, 1v1 product; arms twin of HVY203 stadium-centerpiece):
 * 1. Continuous set-base defense = count opposing heroes with
 *    greater-life-than-controller (0 or 1 in 1v1). Same path as Headliner Helm
 *    / Stadium Centerpiece.
 * 2. Opponent higher life → d1 defend contributes 1 then Blade Break.
 * 3. Equal life → d0 defend (full damage) then Blade Break.
 * 4. Model is already correct (set-base + heroes count + greater-life filter).
 *
 * Status: ✅ set-base d from opposing higher life; equal-life d0; BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { ticketPuncher } from "../../../../../../cards/src/cards/equipment/ticket-puncher.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function armsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === ticketPuncher.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("ticket-puncher (HVY204)", () => {
  it("core mechanic: opponent higher life → evaluated d1; defend d1 + BB", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 15,
        arms: [ticketPuncher],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    // 1 opposing hero with greater {h} → set-base d1 before combat.
    expect(armsDefense(game, Defender.id)).toBe(1);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(ticketPuncher);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − d1 = 3.
    expect(Defender.life()).toBe(15 - (SNATCH - 1));
    expect(Defender.zone("graveyard")).toContain(ticketPuncher.canonicalId);
    expect(Defender.zone("arms")).not.toContain(ticketPuncher.canonicalId);
  });

  it("boundaries: equal life → d0 defend + BB; model set-base count", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [ticketPuncher],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    expect(armsDefense(game, Defender.id)).toBe(0);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(ticketPuncher);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // 0 heroes with greater life → d0; full snatch.
    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.zone("graveyard")).toContain(ticketPuncher.canonicalId);

    const a1 = ticketPuncher.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "set-base",
      amount: {
        type: "count",
        what: "heroes",
        player: "opponent",
        filter: { hasStatus: "greater-life-than-controller" },
      },
      target: { selector: "self" },
      duration: "permanent",
    });
    expect(ticketPuncher.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });

  it("boundaries: defender higher life than attacker → d0 (opponent not greater)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 10,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arms: [ticketPuncher],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    // Opponent has less life than you → count 0.
    expect(armsDefense(game, Defender.id)).toBe(0);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(ticketPuncher);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(20 - SNATCH);
    expect(Defender.zone("graveyard")).toContain(ticketPuncher.canonicalId);
  });
});
