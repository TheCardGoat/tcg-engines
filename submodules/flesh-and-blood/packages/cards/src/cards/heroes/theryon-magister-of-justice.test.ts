import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { theryonMagisterOfJustice } from "./theryon-magister-of-justice.ts";
import { runicReclamationRed as runicReclamation } from "../actions/runic-reclamation.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";

/**
 * Hero behavior acceptance test — theryon-magister-of-justice (JDG006).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: first time each turn another hero destroys a card they don't
 *   control → you may pay {r}{r} → they destroy a non-hero permanent they control
 * - Core interaction: declining optional pay-2 → no forced destroy
 * - Boundaries: forced-destroy candidates are the destroyer's non-hero permanents,
 *   20hp health
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Seat the Theryon destroy scenario: opponent attacks with runic-reclamation
 * (on-hit: destroy target aura). Theryon has a Lightning Flow aura to be
 * destroyed plus 2 resource points to pay the optional cost. Opponent side
 * has Runechant + 2x Ponder tokens for forced-destroy candidates. */
function seatTheryonDestroyScenario() {
  return FabTestEngine.start(
    {
      hero: opponentHero,
      hand: [runicReclamation],
      head: [ironrotHelm],
      arena: [fabToken("ponder"), fabToken("ponder")],
      resourcePoints: 3,
      actionPoints: 1,
      deck: 6,
    },
    {
      hero: theryonMagisterOfJustice,
      arena: [fabToken("lightning-flow")],
      resourcePoints: 2,
      deck: 6,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

/** Drive combat + Theryon optional (accept/decline) + forced-destroy answers. */
function resolveTheryonForcedDestroy(
  game: ReturnType<typeof FabTestEngine.start>,
  options: {
    acceptOptional: boolean;
    opponentId: string;
    onForcedDestroy?: (decision: {
      actorId: string;
      candidates: readonly { instanceId: string; label: string }[];
      label: string;
    }) => void;
  },
): void {
  let acceptedTheryonOptional = false;
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) break;
    if (!game.combat()?.open && !game.isStackWaiting() && !game.pendingDecision()) break;
    const d = game.pendingDecision();
    if (d) {
      if (d.kind === "entity-target") {
        // Forced-destroy is only after Theryon's optional is accepted.
        const isTheryonForcedDestroy =
          acceptedTheryonOptional && d.actorId === options.opponentId && /theryon/i.test(d.label);
        if (isTheryonForcedDestroy) {
          options.onForcedDestroy?.(d);
        }
        // Prefer a Runechant token over equipped head (blade-break noise).
        const pick =
          d.candidates.find((c) => c.label.toLowerCase().includes("runechant"))?.instanceId ??
          d.candidates[0]?.instanceId;
        if (pick) {
          game.exec({
            move: "answer-decision",
            actorId: d.actorId,
            payload: {
              decisionId: d.decisionId,
              stateVersion: d.stateVersion,
              answer: { kind: "entity-target", instanceIds: [pick] },
            },
          });
          continue;
        }
      }
      if (d.kind === "boolean") {
        if (/theryon/i.test(d.label) && options.acceptOptional) {
          acceptedTheryonOptional = true;
        }
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: options.acceptOptional },
          },
        });
        continue;
      }
      if (d.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "ordering", orderedIds: d.entries.map((e) => e.id) },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
    }
    game.passBoth();
  }
}

// ---------------------------------------------------------------------------
// theryon-magister-of-justice (JDG006) — Light/Adjudicator — 20hp
// Printed: "The first time each turn another hero destroys a card they don't
// control, you may pay {r}{r}. If you do, they destroy a non-hero permanent
// they control."
// ---------------------------------------------------------------------------

describe("theryon-magister-of-justice (JDG006)", () => {
  it("core mechanic: when an opponent destroys a card Theryon controls, pay 2 to force them to destroy a non-hero permanent they control", () => {
    // Opponent attacks with runic-reclamation (on-hit destroy Aura) →
    // destroys Theryon's Lightning Flow → optional pay {r}{r} → they destroy
    // one of their non-hero permanents.
    const game = seatTheryonDestroyScenario();
    const Theryon = game.as(theryonMagisterOfJustice);
    const Opponent = game.as(opponentHero);

    // Act — fluent attack.
    Opponent.attackWith(runicReclamation);

    let forcedDestroySeatedOnOpponent = false;
    resolveTheryonForcedDestroy(game, {
      acceptOptional: true,
      opponentId: Opponent.id,
      onForcedDestroy: (d) => {
        forcedDestroySeatedOnOpponent = d.actorId === Opponent.id;
        expect(d.candidates.length).toBeGreaterThan(0);
      },
    });

    // Assert — runic-reclamation destroyed Theryon's Lightning Flow aura…
    expect(Theryon.zone("arena")).not.toContain("token:lightning-flow");
    // …and the forced-destroy destroyed the opponent-selected Runechant.
    expect(Opponent.zone("arena")).not.toContain("token:runechant");
    expect(Opponent.zone("arena").filter((id) => id === "token:ponder")).toHaveLength(2);
    // Theryon paid {r}{r} (2 -> 0).
    expect(Theryon.resourcePoints()).toBe(0);
    // Printed "they destroy" — opponent answers the permanent selection.
    expect(forcedDestroySeatedOnOpponent).toBe(true);
  });

  it("core interaction: declining the optional pay-2 deals no forced destroy", () => {
    const game = seatTheryonDestroyScenario();
    const Theryon = game.as(theryonMagisterOfJustice);
    const Opponent = game.as(opponentHero);

    Opponent.attackWith(runicReclamation);

    let sawForcedDestroy = false;
    resolveTheryonForcedDestroy(game, {
      acceptOptional: false,
      opponentId: Opponent.id,
      onForcedDestroy: () => {
        sawForcedDestroy = true;
      },
    });

    // Assert — Lightning Flow destroyed, but no forced-destroy.
    expect(Theryon.zone("arena")).not.toContain("token:lightning-flow");
    // Optional declined — Theryon keeps {r}{r}; opponent keeps permanents.
    expect(Theryon.resourcePoints()).toBe(2);
    expect(Opponent.zone("arena")).toContain("token:runechant");
    expect(Opponent.zone("arena").filter((id) => id === "token:ponder")).toHaveLength(2);
    expect(Opponent.zone("head")).toContain(ironrotHelm.canonicalId);
    expect(sawForcedDestroy).toBe(false);
  });

  it("boundaries: forced-destroy candidates are the destroyer's non-hero permanents (not Theryon's)", () => {
    const game = seatTheryonDestroyScenario();
    const Theryon = game.as(theryonMagisterOfJustice);
    const Opponent = game.as(opponentHero);

    Opponent.attackWith(runicReclamation);

    let candidateLabels: string[] = [];
    resolveTheryonForcedDestroy(game, {
      acceptOptional: true,
      opponentId: Opponent.id,
      onForcedDestroy: (d) => {
        candidateLabels = d.candidates.map((c) => c.label);
      },
    });

    // Assert — candidates exist and are from the destroyer's side.
    expect(candidateLabels.length).toBeGreaterThan(0);
    // Hero cards are excluded; Theryon's permanents never offered.
    expect(candidateLabels.some((label) => /theryon/i.test(label))).toBe(false);
    expect(Theryon.zone("arena")).not.toContain("token:lightning-flow");
  });
});
