/**
 * RVD003 Bone Vizier — Brute Head d1 Blade Break.
 *
 * Printed:
 *   When Bone Vizier is destroyed, reveal the top card of your deck. If it has
 *   6 or more {p}, put it on top of your deck. Otherwise, put it on the bottom.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. destroy subject:self — only this equipment's BB/destroy (was bare destroy).
 * 2. Defend + BB is the player-reachable destroy path (emit destroy on BB).
 * 3. Reveal top: deck top = last array element; hand:[] avoids opening-hand pop.
 * 4. power ≥ 6 → stay on top; power < 6 (or no power) → bottom.
 * 5. BB d1 block + GY.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { boneVizier } from "../../../../../../cards/src/cards/equipment/bone-vizier.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 1;

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

function deckCanonicals(game: ReturnType<typeof FabTestEngine.start>, playerId: string): string[] {
  return (game.getState().containers.zonesByPlayerId[playerId]!.deck ?? []).map(
    (id) => game.getState().objects[id]?.canonicalId ?? id,
  );
}

describe("bone-vizier (RVD003)", () => {
  it("core mechanic: BB destroy reveal top power≥6 stays top; low power bottoms", () => {
    // --- High power (brutal p6) stays on top ---
    const high = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [boneVizier],
        // Explicit empty hand so opening draw does not pop deck top.
        hand: [],
        // Top = last element.
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, brutalAssaultRed],
      },
      { autoPassPriority: false },
    );
    const High = high.as(dash);
    expect(deckCanonicals(high, High.id).at(-1)).toBe(brutalAssaultRed.canonicalId);

    high.as(bravo).attackWith(snatchRed);
    High.defendWith(boneVizier);
    drain(high);
    high.helpers.resolveRestOfCombat();
    drain(high);

    expect(High.zone("graveyard")).toContain(boneVizier.canonicalId);
    expect(High.zone("head")).not.toContain(boneVizier.canonicalId);
    expect(high.committedEvents().some((e) => e.name === "reveal")).toBe(true);
    // Brutal still on top after "put on top".
    expect(deckCanonicals(high, High.id).at(-1)).toBe(brutalAssaultRed.canonicalId);
    expect(High.life()).toBe(LIFE - (SNATCH - HELM_D));

    // --- Low power (snatch p4) goes to bottom ---
    const low = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [boneVizier],
        hand: [],
        deck: [brutalAssaultRed, nimblismBlue, nimblismBlue, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Low = low.as(dash);
    expect(deckCanonicals(low, Low.id).at(-1)).toBe(snatchRed.canonicalId);

    low.as(bravo).attackWith(snatchRed);
    Low.defendWith(boneVizier);
    drain(low);
    low.helpers.resolveRestOfCombat();
    drain(low);

    expect(Low.zone("graveyard")).toContain(boneVizier.canonicalId);
    // Snatch on bottom (index 0); top is no longer snatch.
    expect(deckCanonicals(low, Low.id)[0]).toBe(snatchRed.canonicalId);
    expect(deckCanonicals(low, Low.id).at(-1)).not.toBe(snatchRed.canonicalId);
  });

  it("boundaries: subject:self model; BB lifecycle", () => {
    const a1 = boneVizier.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered") return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "destroy",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({ type: "sequence" });
    expect(boneVizier.base.numeric.defense).toBe(1);
    expect(boneVizier.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
