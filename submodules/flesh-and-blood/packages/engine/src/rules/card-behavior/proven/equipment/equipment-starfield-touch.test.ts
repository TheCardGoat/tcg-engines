/**
 * AZS005 Starfield Touch — Lightning Illusionist Arms d1 Battleworn.
 *
 * Printed:
 *   Instant - {r}, destroy this: {u} an Aphrodias you control.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case — AZS004 carapace sibling):
 * 1. Instant mixed cost {r} + destroy-self → untap one Aphrodias permanent.
 * 2. Prior model used filter subtypes:["Aphrodias"] — Aphrodias is a named
 *    2H Weapon Orb, not a subtype token. Dead filter → untap never legal.
 *    Remodel name: "Aphrodias" (same as carapace cost/grant targets).
 * 3. zones permanent matches weapon seats via catalogZoneMatchesTargetZones.
 * 4. Happy: seat tapped Aphrodias, activate Instant with 1{r} → arms GY,
 *    Aphrodias untapped, RP spent.
 * 5. Boundary: no Aphrodias → Instant still legal; destroy pays; untap has
 *    no subject (same as AZS004 carapace — at-resolution does not gate quote).
 * 6. Battleworn d1 defend keeps seat with −1{d}.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { starfieldTouch } from "../../../../../../cards/src/cards/equipment/starfield-touch.ts";
import { aphrodias } from "../../../../../../cards/src/cards/weapons/aphrodias.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
      const aph = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === aphrodias.canonicalId,
      );
      const pick = aph ?? decision.candidates[0];
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
    if (decision?.kind === "payment") {
      const pick = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
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

function isTapped(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): boolean {
  const state = game.getState();
  const id =
    state.containers.zonesByPlayerId[playerId]?.weapon1.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    ) ??
    state.containers.zonesByPlayerId[playerId]?.weapon2.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    );
  if (!id) return false;
  return state.objects[id]!.markers.some((m) => m.kind === "tapped");
}

describe("starfield-touch (AZS005)", () => {
  it("core mechanic: Instant {r}+destroy → untap Aphrodias", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [starfieldTouch],
        weapon1: [{ card: aphrodias, state: { tapped: true } }],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(isTapped(game, Bravo.id, aphrodias)).toBe(true);
    expect(Bravo.zone("arms")).toContain(starfieldTouch.canonicalId);

    Bravo.activate(starfieldTouch);
    drain(game);

    // Cost: 1{r} + destroy arms.
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arms")).not.toContain(starfieldTouch.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(starfieldTouch.canonicalId);
    // Aphrodias ready again.
    expect(isTapped(game, Bravo.id, aphrodias)).toBe(false);
    expect(Bravo.zone("weapon1")).toContain(aphrodias.canonicalId);
  });

  it("boundaries: no Aphrodias still destroys; BW d1; model name filter", () => {
    // No Aphrodias: Instant still resolves costs; untap has empty subjects.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [starfieldTouch],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    empty.as(bravo).activate(starfieldTouch);
    drain(empty);
    expect(empty.as(bravo).zone("arms")).not.toContain(starfieldTouch.canonicalId);
    expect(empty.as(bravo).zone("graveyard")).toContain(starfieldTouch.canonicalId);
    expect(empty.as(bravo).resourcePoints()).toBe(0);

    // Battleworn d1: defend keeps arms, −1 defense counter.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [starfieldTouch],
        weapon1: [aphrodias],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    bw.as(bravo).defendWith(starfieldTouch);
    drain(bw);
    expect(bw.as(bravo).zone("arms")).toContain(starfieldTouch.canonicalId);
    const armsId = bw.as(bravo).findCardInZone("arms", starfieldTouch);
    // Battleworn stamps −1 defense counter (engine convention).
    expect(bw.objectState(armsId).defenseCounterTotal).toBe(-1);
    expect(bw.as(bravo).life()).toBe(LIFE - (SNATCH - ARMS_D));

    // Model: name Aphrodias, not subtypes residue.
    const a1 = starfieldTouch.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
      });
      expect(a1.effect).toMatchObject({
        type: "untap",
        target: {
          zones: ["permanent"],
          filter: { name: "Aphrodias" },
          count: 1,
        },
      });
      // Explicitly reject dead subtype residue.
      if (a1.effect?.type === "untap" && a1.effect.target?.selector === "object") {
        expect(a1.effect.target.filter).not.toMatchObject({
          subtypes: ["Aphrodias"],
        });
      }
    }
    expect(starfieldTouch.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
  });
});
