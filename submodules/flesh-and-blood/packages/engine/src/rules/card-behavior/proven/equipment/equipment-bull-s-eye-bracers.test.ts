/**
 * ARC042 Bull's Eye Bracers — Ranger Arms d0 Arcane Barrier 1.
 *
 * Printed:
 *   Action - Destroy Bull's Eye Bracers: If you have no cards in your arsenal,
 *   you may put an arrow card from your hand face up into your arsenal. It
 *   gains +1{p} until end of turn. Go again
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored; case-by-case — sharp-shooters family):
 * 1. Action destroy-self + go again AP refund.
 * 2. Gate: only when controller arsenal count is 0; then optional put.
 * 3. Arrow hand → arsenal face-up; "It" (+1{p} UEoT) is the moved arrow via
 *    outputBinding it → modify-numeric binding (prior model buffed self /
 *    destroyed equipment — dead). Nested inside optional so decline / full
 *    arsenal never grants power.
 * 4. Happy: empty arsenal + Long Shot (p3) → accept → face-up arsenal p4; GY
 *    bracers; AP refunded.
 * 5. Decline optional: bracers destroyed, Long Shot stays hand, no buff.
 * 6. Arsenal occupied (Snatch): activate legal; hand Arrow stays; no put.
 * 7. Non-Arrow only (Snatch) + empty arsenal: activate; decline; Snatch stays.
 * 8. d0 seat + Arcane Barrier keyword present (AB damage not dual-exercised).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, longShotRed, snatchRed } from "../../../fixtures.ts";
import { bullSEyeBracers } from "../../../../../../cards/src/cards/equipment/bull-s-eye-bracers.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LONG_SHOT_BASE = 3;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const arrow = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === longShotRed.canonicalId,
      );
      const pick = arrow ?? decision.candidates[0];
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

function arsenalPower(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): number {
  const state = game.getState();
  const id = state.containers.zonesByPlayerId[playerId]?.arsenal.find(
    (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
  );
  if (!id) return -1;
  const rec = state.objects[id]!;
  const view = buildFabRulesView(state);
  return view.object({ instanceId: id, incarnation: rec.incarnation })?.current.numeric.power ?? -1;
}

describe("bull-s-eye-bracers (ARC042)", () => {
  it("core mechanic: empty arsenal → optional Arrow face-up +1{p}; destroy-self; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bullSEyeBracers],
        hand: [longShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("hand")).toContain(longShotRed.canonicalId);
    expect(Bravo.zone("arsenal")).not.toContain(longShotRed.canonicalId);

    const apBefore = Bravo.actionPoints();
    Bravo.activate(bullSEyeBracers);
    drain(game, { acceptOptional: true });

    // Destroy-self cost + go again refunds Action AP.
    expect(Bravo.zone("arms")).not.toContain(bullSEyeBracers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bullSEyeBracers.canonicalId);
    expect(Bravo.actionPoints()).toBe(apBefore);

    // Arrow left hand for face-up arsenal with +1{p} (base 3 → 4).
    expect(Bravo.zone("hand")).not.toContain(longShotRed.canonicalId);
    expect(Bravo.zone("arsenal")).toContain(longShotRed.canonicalId);
    const arrowId = Bravo.findCardInZone("arsenal", longShotRed);
    expect(game.getState().objects[arrowId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );
    expect(arsenalPower(game, Bravo.id, longShotRed)).toBe(LONG_SHOT_BASE + 1);
  });

  it("boundaries: decline optional; full arsenal skips put; non-Arrow; model + AB", () => {
    // Decline: destroy bracers, Long Shot stays hand, no arsenal load.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bullSEyeBracers],
        hand: [longShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const dBravo = decline.as(bravo);
    dBravo.activate(bullSEyeBracers);
    drain(decline, { acceptOptional: false });
    expect(dBravo.zone("graveyard")).toContain(bullSEyeBracers.canonicalId);
    expect(dBravo.zone("hand")).toContain(longShotRed.canonicalId);
    expect(dBravo.zone("arsenal")).not.toContain(longShotRed.canonicalId);

    // Full arsenal: gate fails — Arrow stays hand; occupied card remains.
    const full = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bullSEyeBracers],
        hand: [longShotRed],
        arsenal: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const fBravo = full.as(bravo);
    fBravo.activate(bullSEyeBracers);
    drain(full, { acceptOptional: true });
    expect(fBravo.zone("graveyard")).toContain(bullSEyeBracers.canonicalId);
    expect(fBravo.zone("hand")).toContain(longShotRed.canonicalId);
    expect(fBravo.zone("arsenal")).toContain(snatchRed.canonicalId);
    expect(fBravo.zone("arsenal")).not.toContain(longShotRed.canonicalId);

    // Non-Arrow only + empty arsenal: decline path; Snatch stays hand.
    const nonArrow = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bullSEyeBracers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const nBravo = nonArrow.as(bravo);
    nBravo.activate(bullSEyeBracers);
    drain(nonArrow, { acceptOptional: false });
    expect(nBravo.zone("graveyard")).toContain(bullSEyeBracers.canonicalId);
    expect(nBravo.zone("hand")).toContain(snatchRed.canonicalId);
    expect(nBravo.zone("arsenal")).not.toContain(snatchRed.canonicalId);

    // Model shape.
    const a1 = bullSEyeBracers.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.layerKeywords).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
      );
      expect(a1.effect).toMatchObject({
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "arsenal",
          comparison: { op: "eq", value: 0 },
        },
        then: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  zones: ["hand"],
                  declared: "at-resolution",
                  filter: { typeBox: { subtypes: ["Arrow"] } },
                  count: 1,
                },
                to: { zone: "arsenal", visibility: "face-up" },
                outputBinding: "it",
              },
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: { selector: "binding", binding: "it" },
                duration: "this-turn",
              },
            ],
          },
        },
      });
    }
    expect(bullSEyeBracers.base.numeric.defense).toBe(0);
    expect(bullSEyeBracers.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "arcane-barrier", value: 1 })]),
    );
  });
});
