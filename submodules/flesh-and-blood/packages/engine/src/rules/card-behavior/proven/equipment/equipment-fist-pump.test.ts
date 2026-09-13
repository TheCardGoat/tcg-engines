/**
 * AMX005 Fist Pump — Mechanologist Arms d1 Battleworn.
 *
 * Printed:
 *   Whenever you banish a Hyper Driver from boosting, target wrench you
 *   control gets +1{p} this turn.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Boost banishes deck top and stamps status marker "from-boosting"
 *    (boost.ts / CR 8.3.9e). Prior model filtered hasStatus
 *    "banished-from-boosting" — never stamped → trigger dead.
 * 2. Name filter "Hyper Driver" matches slug-derived names (hyper-driver-red
 *    → Hyper Driver).
 * 3. "target wrench you control" is a single at-resolution choice among
 *    controller wrenches in weapon/permanent/combat-chain — not star-scan
 *    and not subtypes:["Target"] (English residue).
 * 4. Happy: seat Bank Breaker (Wrench weapon p3), deck-top Hyper Driver,
 *    boost Throttle → choose wrench → evaluated power 4.
 * 5. Boundary: boost banishes non-HD (Snatch) → no buff (power stays 3).
 * 6. Boundary: HD banished without boost stamp (plain banish) → no fire.
 * 7. Battleworn d1 defend → −1{d} counter.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { fistPump } from "../../../../../../cards/src/cards/equipment/fist-pump.ts";
import { bankBreaker } from "../../../../../../cards/src/cards/weapons/bank-breaker.ts";
import { throttleRed } from "../../../../../../cards/src/cards/actions/throttle.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 1;
const WRENCH_BASE = 3;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const wrench = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === bankBreaker.canonicalId,
      );
      const pick = wrench ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
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

function weaponPower(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): number {
  const state = game.getState();
  const id =
    state.containers.zonesByPlayerId[playerId]?.weapon1.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    ) ??
    state.containers.zonesByPlayerId[playerId]?.weapon2.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    );
  if (!id) return -1;
  const rec = state.objects[id]!;
  const view = buildFabRulesView(state);
  return view.object({ instanceId: id, incarnation: rec.incarnation })?.current.numeric.power ?? -1;
}

describe("fist-pump (AMX005)", () => {
  it("core mechanic: boost banishes Hyper Driver → target wrench +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fistPump],
        weapon1: [bankBreaker],
        hand: [throttleRed],
        // Last deck entry is top — Hyper Driver banished from boosting.
        deck: [nimblismBlue, snatchRed, snatchRed, hyperDriverRed],
        actionPoints: 1,
        resourcePoints: 2,
        life: LIFE,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(weaponPower(game, Bravo.id, bankBreaker)).toBe(WRENCH_BASE);

    Bravo.play(throttleRed, { boost: true });
    drain(game);

    expect(Bravo.zone("banished")).toContain(hyperDriverRed.canonicalId);
    expect(
      game
        .committedEvents()
        .some(
          (e) =>
            e.name === "banish" &&
            e.data.object.canonicalId === hyperDriverRed.canonicalId &&
            e.data.object.markers.some((m) => m.kind === "status" && m.value === "from-boosting"),
        ),
    ).toBe(true);
    expect(weaponPower(game, Bravo.id, bankBreaker)).toBe(WRENCH_BASE + 1);
    expect(
      game
        .getState()
        .continuousEffectInstances.some((inst) =>
          inst.atoms.some((atom) => atom.kind === "numeric" && atom.property === "power"),
        ),
    ).toBe(true);
  });

  it("boundaries: non-HD boost no buff; Battleworn; model from-boosting + Wrench", () => {
    // Boost banishes Snatch (not Hyper Driver) → wrench stays p3.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fistPump],
        weapon1: [bankBreaker],
        hand: [throttleRed],
        deck: [nimblismBlue, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bare.as(bravo).play(throttleRed, { boost: true });
    drain(bare);
    expect(weaponPower(bare, bare.as(bravo).id, bankBreaker)).toBe(WRENCH_BASE);
    expect(bare.as(bravo).zone("banished")).toContain(snatchRed.canonicalId);

    // Battleworn d1.
    const bw = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [fistPump],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = bw.as(dash);
    const armsId = bw
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.arms.find(
        (id) => bw.getState().objects[id]?.canonicalId === fistPump.canonicalId,
      )!;
    bw.as(bravo).attackWith(snatchRed);
    Defender.defend(fistPump);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    expect(bw.objectState(armsId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.zone("arms")).toContain(fistPump.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - ARMS_D));

    // Model surface.
    const ability = fistPump.base.abilities?.[0];
    expect(ability?.kind).toBe("static");
    if (
      ability?.kind === "static" &&
      ability.staticKind === "triggered" &&
      ability.resolution.kind === "effect" &&
      ability.resolution.effect.type === "modify-numeric"
    ) {
      expect(ability.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "banish",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "event-object", filter: { name: "Hyper Driver" } },
        },
      });
      expect(ability.resolution.effect.target).toMatchObject({
        selector: "object",
        declared: "at-resolution",
        count: 1,
        filter: { typeBox: { subtypes: ["Wrench"] } },
      });
      expect(ability.resolution.effect.duration).toBe("this-turn");
    }
    expect(fistPump.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
  });
});
