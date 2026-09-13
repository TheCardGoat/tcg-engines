/**
 * ASR005 Okana Scar Wraps — Ninja Arms d2 Blade Break.
 *
 * Printed:
 *   Attack Reaction - {t}, banish an Edge of Autumn you control: Target Ninja
 *   attack action card gets +1{p}.
 *   Whenever an attack you control with Vengeance in its name hits, you may
 *   equip an Edge of Autumn from your banished zone.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. AR mixed cost: tap-self + banish named Edge of Autumn from arena. Edge is
 *    a 2H weapon seated in weapon1 — catalog from:arena maps to permanent, and
 *    payment/quote must match weapon seats via catalogZoneMatchesTargetZones
 *    (strict zone === permanent was a silent reject).
 * 2. Effect targets on-stack Ninja Action Attack (+1{p} UEoT). Generic Snatch
 *    is not a legal target; Seek Vengeance (Ninja AAC) is.
 * 3. Hit trigger: controller's attack with nameContains "Vengeance" → optional
 *    equip Edge from banished into free weapon seats (2H needs both free).
 * 4. Residual equip.zone:"banished" removed — destination is type-derived.
 * 5. Happy AR: banish Edge → Seek Vengeance power 4→5 → 5 damage.
 * 6. Happy hit re-equip: Edge in banished, free seats → accept → weapon1.
 * 7. Boundaries: no Edge illegal; non-Vengeance hit no re-equip; decline
 *    optional keeps Edge banished; BB on defend; out of AR illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { okanaScarWraps } from "../../../../../../cards/src/cards/equipment/okana-scar-wraps.ts";
import { edgeOfAutumn } from "../../../../../../cards/src/cards/weapons/edge-of-autumn.ts";
import { seekVengeanceRed } from "../../../../../../cards/src/cards/actions/seek-vengeance.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 40;
const SEEK_BASE = 4;
const ARMS_D = 2;
const SNATCH = 4;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: {
    acceptOptional?: boolean;
    preferCanonicalId?: string;
  } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 96; safety += 1) {
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
      const preferred = opts.preferCanonicalId
        ? decision.candidates.find(
            (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.preferCanonicalId,
          )
        : undefined;
      const pick = preferred ?? decision.candidates[0];
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
    const combat = game.combat();
    if (combat?.step === "defend" && combat.defenseDeclarationPending && combat.activeLink) {
      game.defend(combat.activeLink.defendingPlayerId, []);
      continue;
    }
    const prio = game.getPriorityPlayerId();
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

function chainPower(
  game: ReturnType<typeof FabTestEngine.start>,
  card: { canonicalId: string },
): number {
  const state = game.getState();
  const id = state.containers.zonesByPlayerId[
    state.priority?.holderPlayerId ?? ""
  ]?.combatChain?.find((iid) => state.objects[iid]?.canonicalId === card.canonicalId);
  // Prefer combat active link attack, then any combat-chain seat.
  const attackId =
    state.combat?.activeLink?.activeAttack.sourceObjectId ??
    Object.values(state.containers.zonesByPlayerId)
      .flatMap((zones) => zones.combatChain)
      .find((iid) => state.objects[iid]?.canonicalId === card.canonicalId) ??
    id;
  if (!attackId) return -1;
  const rec = state.objects[attackId];
  if (!rec) return -1;
  const view = buildFabRulesView(state);
  return (
    view.object({ instanceId: attackId, incarnation: rec.incarnation })?.current.numeric.power ?? -1
  );
}

function finishCombat(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; preferCanonicalId?: string } = {},
): void {
  for (let safety = 0; safety < 80; safety += 1) {
    drain(game, opts);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    const prio = game.getPriorityPlayerId();
    if (prio && !game.getState().decision) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    if (!game.getState().decision && !prio) return;
  }
}

describe("okana-scar-wraps (ASR005)", () => {
  it("core mechanic: AR {t}+banish Edge → Ninja AAC +1{p}; Edge leaves weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [okanaScarWraps],
        weapon1: [edgeOfAutumn],
        hand: [seekVengeanceRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("weapon1")).toContain(edgeOfAutumn.canonicalId);
    expect(Bravo.zone("arms")).toContain(okanaScarWraps.canonicalId);

    Bravo.attackWith(seekVengeanceRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    game.passBoth();
    expect(game.combat()?.step).toBe("reaction");

    expect(chainPower(game, seekVengeanceRed)).toBe(SEEK_BASE);

    // Sole Edge + sole Ninja AAC: costs/targets auto-resolve on activate.
    Bravo.activate(okanaScarWraps);

    // Assert cost payment *before* combat closes (hit would optional re-equip).
    expect(Bravo.zone("weapon1")).not.toContain(edgeOfAutumn.canonicalId);
    expect(Bravo.zone("banished")).toContain(edgeOfAutumn.canonicalId);
    expect(Bravo.zone("arms")).toContain(okanaScarWraps.canonicalId);

    // Resolve AR layer onto the chain attack.
    finishCombat(game, {
      acceptOptional: false,
      preferCanonicalId: seekVengeanceRed.canonicalId,
    });

    // 5 damage from base 4 + AR +1{p}; decline re-equip so Edge stays banished.
    expect(Opponent.life()).toBe(LIFE - (SEEK_BASE + 1));
    expect(Bravo.zone("banished")).toContain(edgeOfAutumn.canonicalId);
    expect(Bravo.zone("weapon1")).not.toContain(edgeOfAutumn.canonicalId);
  });

  it("core mechanic: Vengeance hit → optional equip Edge from banished", () => {
    // Pre-banish Edge (weapon seats free) so only the hit re-equip is under test.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [okanaScarWraps],
        banished: [edgeOfAutumn],
        hand: [seekVengeanceRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("banished")).toContain(edgeOfAutumn.canonicalId);
    expect(Bravo.zone("weapon1")).not.toContain(edgeOfAutumn.canonicalId);

    Bravo.attackWith(seekVengeanceRed);
    finishCombat(game, {
      acceptOptional: true,
      preferCanonicalId: edgeOfAutumn.canonicalId,
    });

    expect(Bravo.zone("weapon1")).toContain(edgeOfAutumn.canonicalId);
    expect(Bravo.zone("banished")).not.toContain(edgeOfAutumn.canonicalId);
  });

  it("boundaries: no Edge illegal; non-Vengeance no equip; decline; BB; model", () => {
    // No Edge seated: AR banish cost unavailable.
    const noEdge = FabTestEngine.start(
      {
        hero: bravo,
        arms: [okanaScarWraps],
        hand: [seekVengeanceRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    noEdge.as(bravo).attackWith(seekVengeanceRed);
    noEdge.as(dash).defendWith([]);
    noEdge.passBoth();
    expect(noEdge.combat()?.step).toBe("reaction");
    const reject = noEdge.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: noEdge.as(bravo).card(okanaScarWraps) },
    });
    expect(reject.accepted).toBe(false);
    expect(noEdge.as(bravo).zone("arms")).toContain(okanaScarWraps.canonicalId);

    // Out of combat: AR illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [okanaScarWraps],
        weapon1: [edgeOfAutumn],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(okanaScarWraps)).toThrow();

    // Non-Vengeance hit (Snatch) does not re-equip Edge from banished.
    const snatchHit = FabTestEngine.start(
      {
        hero: bravo,
        arms: [okanaScarWraps],
        banished: [edgeOfAutumn],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    snatchHit.as(bravo).attackWith(snatchRed);
    finishCombat(snatchHit, { acceptOptional: true });
    expect(snatchHit.as(bravo).zone("banished")).toContain(edgeOfAutumn.canonicalId);
    expect(snatchHit.as(bravo).zone("weapon1")).not.toContain(edgeOfAutumn.canonicalId);

    // Decline optional re-equip after Vengeance hit.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        arms: [okanaScarWraps],
        banished: [edgeOfAutumn],
        hand: [seekVengeanceRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    decline.as(bravo).attackWith(seekVengeanceRed);
    finishCombat(decline, { acceptOptional: false });
    expect(decline.as(bravo).zone("banished")).toContain(edgeOfAutumn.canonicalId);
    expect(decline.as(bravo).zone("weapon1")).not.toContain(edgeOfAutumn.canonicalId);

    // Blade Break d2 when this defends.
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [okanaScarWraps],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(okanaScarWraps);
    finishCombat(bb);
    expect(bb.as(dash).zone("arms")).not.toContain(okanaScarWraps.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(okanaScarWraps.canonicalId);
    expect(bb.as(dash).life()).toBe(20 - (SNATCH - ARMS_D));

    // Model shape.
    const a1 = okanaScarWraps.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("attack-reaction");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
      });
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
              supertypes: ["Ninja"],
            },
          },
        },
      });
    }
    const a2 = okanaScarWraps.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static") {
      expect(a2.trigger).toMatchObject({
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "attack",
            filter: { nameContains: "Vengeance" },
          },
        },
      });
      expect(a2.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "equip",
          target: {
            zones: ["banished"],
            filter: { name: "Edge of Autumn" },
          },
        },
      });
      // No residual source-as-destination zone on equip.
      if (a2.effect?.type === "optional" && a2.effect.effect.type === "equip") {
        expect("zone" in a2.effect.effect && a2.effect.effect.zone).toBeFalsy();
      }
    }
    expect(okanaScarWraps.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
