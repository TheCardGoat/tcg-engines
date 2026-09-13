/**
 * ASB005 Bracers of Bellona's Grace — Light Warrior Arms d2 Blade Break.
 *
 * Printed:
 *   When this defends, you may charge your hero's soul. If a yellow card is
 *   charged this way, create a Courage token.
 *   Blade Break
 *
 * Reasoning (hand-authored; ASB003 helm-of-halo-s-grace sibling):
 * 1. defend subject:self — co-defenders must not fire.
 * 2. Optional charge at-resolution hand card (not bare controller).
 * 3. yellow-charged-this-way → Courage under controller.
 * 4. Happy: defend + charge yellow tome → soul + courage token; BB destroys arms.
 * 5. Boundary: charge blue → soul, no courage.
 * 6. Boundary: decline → no soul, no courage; still BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { bracersOfBellonaSGrace } from "../../../../../../cards/src/cards/equipment/bracers-of-bellona-s-grace.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 2;

function drainDefendCharge(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptCharge: boolean; chargeCanonicalId?: string },
): void {
  for (let safety = 0; safety < 56; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptCharge },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.chargeCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.chargeCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function courageCount(
  game: ReturnType<typeof FabTestEngine.start>,
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  const state = game.getState();
  return player.zone("arena").filter((id) => {
    if (/courage/i.test(id)) return true;
    const canon = state.objects[id]?.canonicalId ?? "";
    return /courage/i.test(canon);
  }).length;
}

describe("bracers-of-bellona-s-grace (ASB005)", () => {
  it("core mechanic: defend → charge yellow → Courage token; blade break", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [bracersOfBellonaSGrace],
        hand: [tomeOfFyendalYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(courageCount(game, Bravo)).toBe(0);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(bracersOfBellonaSGrace);
    drainDefendCharge(game, {
      acceptCharge: true,
      chargeCanonicalId: tomeOfFyendalYellow.canonicalId,
    });
    game.helpers.resolveRestOfCombat();
    drainDefendCharge(game, { acceptCharge: false });

    expect(Bravo.zone("soul")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(tomeOfFyendalYellow.canonicalId);
    expect(courageCount(game, Bravo)).toBe(1);
    // Blade Break after defend.
    expect(Bravo.zone("arms")).not.toContain(bracersOfBellonaSGrace.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bracersOfBellonaSGrace.canonicalId);
    // Defended for 2 before destroy.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - ARMS_D));
  });

  it("boundaries: non-yellow charge no token; decline; subject:self model", () => {
    // Charge blue → soul, no Courage.
    const blue = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [bracersOfBellonaSGrace],
        hand: [nimblismBlue],
        deck: [tomeOfFyendalYellow, tomeOfFyendalYellow, tomeOfFyendalYellow],
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    blue.as(dash).attackWith(snatchRed);
    blue.as(bravo).defendWith(bracersOfBellonaSGrace);
    drainDefendCharge(blue, {
      acceptCharge: true,
      chargeCanonicalId: nimblismBlue.canonicalId,
    });
    blue.helpers.resolveRestOfCombat();
    drainDefendCharge(blue, { acceptCharge: false });
    expect(blue.as(bravo).zone("soul")).toContain(nimblismBlue.canonicalId);
    expect(courageCount(blue, blue.as(bravo))).toBe(0);

    // Decline charge → no soul, no courage.
    const decline = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [bracersOfBellonaSGrace],
        hand: [tomeOfFyendalYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    decline.as(dash).attackWith(snatchRed);
    decline.as(bravo).defendWith(bracersOfBellonaSGrace);
    drainDefendCharge(decline, { acceptCharge: false });
    decline.helpers.resolveRestOfCombat();
    drainDefendCharge(decline, { acceptCharge: false });
    expect(decline.as(bravo).zone("soul")).not.toContain(tomeOfFyendalYellow.canonicalId);
    expect(decline.as(bravo).zone("hand")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(courageCount(decline, decline.as(bravo))).toBe(0);
    expect(decline.as(bravo).zone("graveyard")).toContain(bracersOfBellonaSGrace.canonicalId);

    const a1 = bracersOfBellonaSGrace.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        event: { name: "defend", observes: { kind: "source" } },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "charge",
              target: {
                zones: ["hand"],
                declared: "at-resolution",
                count: 1,
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "chargedCard",
              filter: { color: ["yellow"] },
            },
            then: {
              type: "create-token",
              token: "courage",
              controller: "controller",
            },
          },
        ],
      });
    }
    expect(bracersOfBellonaSGrace.base.numeric.defense).toBe(2);
    expect(bracersOfBellonaSGrace.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
