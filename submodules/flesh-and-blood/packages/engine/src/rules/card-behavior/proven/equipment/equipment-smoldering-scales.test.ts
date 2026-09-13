/**
 * PEN253 Smoldering Scales — Draconic Chest d2 Guardwell.
 *
 * Printed:
 *   If one or more Frostbite tokens would be created under your control,
 *   instead you may destroy this.
 *   Guardwell
 *
 * Reasoning (case-by-case; no batch script):
 * 1. Continuous create replacement: Frostbite create under controller →
 *    instead destroy this (cancel create). Its controller explicitly accepts
 *    or declines the replacement when it is live.
 * 2. Prior path unsupported in continuous corpus — wired apply cancel+destroy.
 * 3. Filter name Frostbite + player controller (pattern.player match).
 * 4. Without scales, coat-of-frost create lands under the target hero.
 * 5. Guardwell: defend d2 → −2 defense counters; remains equipped.
 *
 * Status: ✅ Frostbite create → destroy scales (no frostbite); bare create;
 * Guardwell −2; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { smolderingScales } from "../../../../../../cards/src/cards/equipment/smoldering-scales.ts";
import { coatOfFrost } from "../../../../../../cards/src/cards/equipment/coat-of-frost.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      // Accept optional destroy-instead if ever prompted.
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: decision.options.map((option) => option.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      // Prefer targeting the scales controller (dash) for Frostbite create.
      const dashId = game.as(dash).id;
      const dashPick =
        decision.candidates.find((c) => c.instanceId === dashId) ?? decision.candidates[0];
      if (!dashPick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: dashPick ? [dashPick.instanceId] : [],
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

function hasFrostbite(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const zones = ["arena", "head", "chest", "arms", "legs"] as const;
  for (const zone of zones) {
    for (const id of state.containers.zonesByPlayerId[playerId]?.[zone] ?? []) {
      const canonical = state.objects[id]?.canonicalId ?? id;
      if (/frostbite/i.test(canonical)) return true;
    }
  }
  return false;
}

describe("smoldering-scales (PEN253)", () => {
  it("core mechanic: Frostbite would enter under you → destroy scales instead (no Frostbite)", () => {
    // Bravo wears coat; Dash wears scales. Coat creates Frostbite under target
    // hero — target Dash so create is under scales' controller.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [coatOfFrost],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [smolderingScales],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Dash.zone("chest")).toContain(smolderingScales.canonicalId);
    expect(hasFrostbite(game, Dash.id)).toBe(false);

    Bravo.activate(coatOfFrost);
    drain(game);

    // Coat destroyed as cost.
    expect(Bravo.zone("chest")).not.toContain(coatOfFrost.canonicalId);
    // Scales destroyed instead of Frostbite creation under Dash.
    expect(Dash.zone("chest")).not.toContain(smolderingScales.canonicalId);
    expect(Dash.zone("graveyard")).toContain(smolderingScales.canonicalId);
    expect(hasFrostbite(game, Dash.id)).toBe(false);
  });

  it("boundaries: without scales Frostbite creates; Guardwell d2; model", () => {
    // No scales: coat → Frostbite under dash.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [coatOfFrost],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).activate(coatOfFrost);
    drain(bare);
    expect(hasFrostbite(bare, bare.as(dash).id)).toBe(true);

    // Guardwell: defend for d2 → −1 counters equal to defense (−2), stays equipped.
    const gw = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [smolderingScales],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const plateId = gw.as(dash).findCardInZone("chest", smolderingScales);
    gw.as(bravo).attackWith(snatchRed);
    gw.as(dash).defendWith(smolderingScales);
    gw.helpers.resolveRestOfCombat();
    // Snatch 4 − d2 = 2 damage; Guardwell −2 counters; seat remains.
    expect(gw.as(dash).life()).toBe(LIFE - (SNATCH - DEF));
    expect(gw.as(dash).zone("chest")).toContain(smolderingScales.canonicalId);
    expect(gw.objectState(plateId)?.defenseCounterTotal).toBe(-2);

    const a1 = smolderingScales.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.effect).toMatchObject({
      type: "replacement",
      replacementKind: "standard",
      replaces: {
        name: "create",
        filter: { name: "Frostbite" },
        player: "controller",
      },
      duration: "while-in-arena",
    });
    if (a1.effect.type !== "replacement") return;
    // Optional destroy self (or bare destroy self after remodel).
    const mod = a1.effect.modification;
    if (mod.type === "optional") {
      expect(mod.effect).toMatchObject({
        type: "destroy",
        target: { selector: "self" },
      });
    } else {
      expect(mod).toMatchObject({
        type: "destroy",
        target: { selector: "self" },
      });
    }
    expect(smolderingScales.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
    expect(smolderingScales.base.numeric.defense).toBe(2);
  });
});
