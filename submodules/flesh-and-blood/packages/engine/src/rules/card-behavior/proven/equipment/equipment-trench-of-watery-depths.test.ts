/**
 * PEN168 Trench of Watery Depths — Pirate Chest d1 Blade Break.
 *
 * Printed:
 *   When this defends, you may pitch a blue card from your graveyard.
 *   Blade Break
 *
 * Reasoning (case-by-case; no batch script):
 * 1. Defend subject:self optional trigger → pitch blue from GY.
 * 2. Prior model used move-card + types:["Blue"] — neither generates pitch
 *    resources nor matches color. Remodeled to pitch-card + color:["blue"]
 *    (SEA179 color residue; CR 8.5.44 pitch generates {r}).
 * 3. ENGINE: pitch-card proposal + pitch reducer allow graveyard origin
 *    (was hand/deck only). Blue → +3{r}; card leaves GY to pitch zone.
 * 4. Decline optional / no blue GY → no pitch, no free RP; still BB d1.
 * 5. Red-only GY is not a legal blue pitch candidate.
 *
 * Status: ✅ defend optional pitch blue GY → +3{r}; color filter; BB d1; engine GY pitch.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { trenchOfWateryDepths } from "../../../../../../cards/src/cards/equipment/trench-of-watery-depths.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 1;
const BLUE_PITCH = 3;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const accept = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const bluePick = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === nimblismBlue.canonicalId,
      );
      const pick = bluePick ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
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

describe("trench-of-watery-depths (PEN168)", () => {
  it("core mechanic: defend → optional pitch blue GY → +3{r} + BB d1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [trenchOfWateryDepths],
        graveyard: [nimblismBlue, snatchRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);
    const rpBefore = game.getState().players[Defender.id]!.resourcePoints;

    expect(Defender.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("pitch")).not.toContain(nimblismBlue.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(trenchOfWateryDepths);
    drain(game, { acceptOptional: true });
    game.helpers.resolveRestOfCombat();

    // Blue pitched from GY → pitch zone + 3 resources.
    expect(Defender.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("pitch")).toContain(nimblismBlue.canonicalId);
    // Red GY fodder left behind (not blue).
    expect(Defender.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(game.getState().players[Defender.id]!.resourcePoints).toBe(rpBefore + BLUE_PITCH);

    // Snatch 4 − d1 = 3; bladeBreak → GY.
    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
    expect(Defender.zone("chest")).not.toContain(trenchOfWateryDepths.canonicalId);
    expect(Defender.zone("graveyard")).toContain(trenchOfWateryDepths.canonicalId);
  });

  it("boundaries: decline / no blue GY → no pitch; red GY not pitched; model", () => {
    // Decline optional: blue stays in GY, no free RP.
    const declined = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [trenchOfWateryDepths],
        graveyard: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const dRp = declined.getState().players[declined.as(dash).id]!.resourcePoints;
    declined.as(bravo).attackWith(snatchRed);
    declined.as(dash).defendWith(trenchOfWateryDepths);
    drain(declined, { acceptOptional: false });
    declined.helpers.resolveRestOfCombat();
    expect(declined.as(dash).zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(declined.as(dash).zone("pitch")).not.toContain(nimblismBlue.canonicalId);
    expect(declined.getState().players[declined.as(dash).id]!.resourcePoints).toBe(dRp);
    expect(declined.as(dash).zone("graveyard")).toContain(trenchOfWateryDepths.canonicalId);

    // Red-only GY: no blue pitch candidate → no pitch resources.
    const noBlue = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [trenchOfWateryDepths],
        graveyard: [snatchRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const nRp = noBlue.getState().players[noBlue.as(dash).id]!.resourcePoints;
    noBlue.as(bravo).attackWith(snatchRed);
    noBlue.as(dash).defendWith(trenchOfWateryDepths);
    drain(noBlue, { acceptOptional: true });
    noBlue.helpers.resolveRestOfCombat();
    expect(noBlue.as(dash).zone("pitch")).not.toContain(snatchRed.canonicalId);
    expect(noBlue.getState().players[noBlue.as(dash).id]!.resourcePoints).toBe(nRp);
    expect(noBlue.as(dash).life()).toBe(LIFE - (SNATCH - DEF));

    const a1 = trenchOfWateryDepths.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered" || a1.resolution.kind !== "effect")
      return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution.effect).toMatchObject({
      type: "optional",
      effect: {
        type: "pitch-card",
        target: {
          selector: "object",
          zones: ["graveyard"],
          filter: { color: ["blue"] },
          count: 1,
        },
      },
    });
    expect(trenchOfWateryDepths.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(trenchOfWateryDepths.base.numeric.defense).toBe(1);
  });
});
