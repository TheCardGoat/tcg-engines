/**
 * AIO005 Heavy Industry Ram Stop — Mechanologist Arms d1 Temper.
 *
 * Printed:
 *   When this defends, you may pay {r}. If you do, it gets +1{d} until end of turn.
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. "When this defends" requires subject:self. Prior bare defend fired when
 *    a hand card alone defended (probe: paid {r} without arms defending).
 * 2. Optional pay 1{r} → continuous +1{d} UEoT on self. Same-link damage
 *    sees the buff (snatch 4 − (1+1) = 2).
 * 3. Decline: no pay, printed d1 only (snatch 4 − 1 = 3).
 * 4. Temper on d1: after defend put −1{d} counter; if total {d} ≤ 0 destroy.
 *    - Decline: 1 − 1 = 0 → destroy to GY (not an "engine removal bug").
 *    - Accept: 1 − 1 + continuous +1 = 1 → survives with −1 counter.
 *    Prior remaining-alpha it.todo misdiagnosed Temper d1 destroy as a
 *    generic "defense-modifying equipment leaves slot" gap.
 * 5. Co-defender alone (hand card): subject:self → no optional, no pay.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { heavyIndustryRamStop } from "../../../../../../cards/src/cards/equipment/heavy-industry-ram-stop.ts";

const LIFE = 20;
const SNATCH = 4;

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
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && need > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
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

describe("heavy-industry-ram-stop (AIO005)", () => {
  it("core mechanic: defend pay {r} → +1{d} same link; Temper leaves d1 seat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [heavyIndustryRamStop],
        resourcePoints: 2,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const armsId = game
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.arms.find(
        (id) => game.getState().objects[id]?.canonicalId === heavyIndustryRamStop.canonicalId,
      )!;

    game.as(bravo).attackWith(snatchRed);
    Defender.defend(heavyIndustryRamStop);
    drain(game, { acceptOptional: true });
    game.helpers.resolveRestOfCombat();

    // Pay 1{r}; +1{d} UEoT → snatch 4 − 2 = 2 damage.
    expect(game.getState().players[Defender.id]!.resourcePoints).toBe(1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    // Temper −1 counter + continuous +1 → total d>0, remains equipped.
    expect(game.objectState(armsId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.zone("arms")).toContain(heavyIndustryRamStop.canonicalId);
    expect(game.committedEvents().some((e) => e.name === "continuous-effect-generated")).toBe(true);
  });

  it("boundaries: decline → Temper d1 destroy; co-defender no fire; subject:self model", () => {
    // Decline optional: d1 only (4−1=3), Temper −1 → 0{d} → destroy.
    const decline = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [heavyIndustryRamStop],
        resourcePoints: 2,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dec = decline.as(dash);
    decline.as(bravo).attackWith(snatchRed);
    Dec.defend(heavyIndustryRamStop);
    drain(decline, { acceptOptional: false });
    decline.helpers.resolveRestOfCombat();

    expect(decline.getState().players[Dec.id]!.resourcePoints).toBe(2);
    expect(Dec.life()).toBe(LIFE - (SNATCH - 1));
    expect(Dec.zone("arms")).not.toContain(heavyIndustryRamStop.canonicalId);
    expect(Dec.zone("graveyard")).toContain(heavyIndustryRamStop.canonicalId);

    // Co-defender only (hand): subject:self → no pay, arms untouched.
    const co = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [heavyIndustryRamStop],
        hand: [nimblismBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Co = co.as(dash);
    co.as(bravo).attackWith(snatchRed);
    Co.defend(nimblismBlue);
    drain(co, { acceptOptional: true });
    co.helpers.resolveRestOfCombat();

    expect(co.getState().players[Co.id]!.resourcePoints).toBe(2);
    expect(Co.zone("arms")).toContain(heavyIndustryRamStop.canonicalId);
    expect(co.committedEvents().filter((e) => e.name === "pay-resources")).toHaveLength(0);

    // Model: defend subject:self + optional pay then +1{d}.
    const ability = heavyIndustryRamStop.base.abilities?.[0];
    expect(ability?.kind).toBe("static");
    if (ability?.kind === "static" && ability.staticKind === "triggered") {
      expect(ability.trigger).toMatchObject({
        kind: "event",
        event: { name: "defend", observes: { kind: "source", selector: "defender" } },
      });
      expect(ability.resolution).toMatchObject({ kind: "effect", effect: { type: "optional" } });
    }
    expect(heavyIndustryRamStop.base.keywords?.some((k) => k.name === "temper")).toBe(true);
  });
});
