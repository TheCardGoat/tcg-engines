/**
 * SEA009 Rust Belt — Mechanologist Chest d1 Battleworn.
 *
 * Printed:
 *   Instant - {t} a cog you control, destroy this: Gain {r}.
 *   Battleworn
 *
 * Reasoning (case-by-case):
 * 1. Instant mixed cost: tap filtered Cog + destroy-self → gain 1{r}.
 * 2. ENGINE: effect cost type "tap" with filter was DSL-only (returned null);
 *    wired tapTargets through activation quote/declare/pay (set-tapped).
 * 3. No untapped Cog → illegal; already-tapped Cog → illegal.
 * 4. Battleworn d1 defend keeps seat with −1{d}.
 * 5. Model: subtypes:["Cog"] (Cog is FAB_SUBTYPES) + destroy-self + gain-resources 1.
 *
 * Status: ✅ Instant tap cog + destroy → +1{r}; no-cog illegal; BW d1; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { rustBelt } from "../../../../../../cards/src/cards/equipment/rust-belt.ts";

const LIFE = 20;
const SNATCH = 4;
const DEF = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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

describe("rust-belt (SEA009)", () => {
  it("core mechanic: Instant tap cog + destroy → gain 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [rustBelt],
        arena: [fabToken("golden-cog")],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arena").length).toBeGreaterThanOrEqual(1);

    const result = Bravo.activate(rustBelt);
    expect(result.accepted).toBe(true);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(rustBelt.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(rustBelt.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    // Cog remains in arena, tapped.
    const cogId = game
      .getState()
      .containers.zonesByPlayerId[Bravo.id]!.arena.find(
        (id) => game.getState().objects[id]?.canonicalId === "token:golden-cog",
      );
    expect(cogId).toBeDefined();
    expect(game.getState().objects[cogId!]?.markers.some((m) => m.kind === "tapped")).toBe(true);
  });

  it("boundaries: no cog illegal; Battleworn d1; model tap filter Cog", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [rustBelt],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(rustBelt)).toThrow();

    const gw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [rustBelt],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    gw.as(dash).attackWith(snatchRed);
    gw.as(bravo).defendWith(rustBelt);
    gw.helpers.resolveRestOfCombat();
    // Battleworn: snatch 4 − d1 = 3; plate stays.
    expect(gw.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(gw.as(bravo).zone("chest")).toContain(rustBelt.canonicalId);

    const a1 = rustBelt.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "effect", type: "tap", filter: { typeBox: { subtypes: ["Cog"] } } },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    expect(rustBelt.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(rustBelt.base.numeric.defense).toBe(1);
  });
});
