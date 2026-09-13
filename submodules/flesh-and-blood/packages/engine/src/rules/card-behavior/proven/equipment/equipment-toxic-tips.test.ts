/**
 * ARA005 Toxic Tips — Assassin/Ranger Arms d1 Blade Break.
 *
 * Printed:
 *   Action - {r}, destroy Toxic Tips: The next attack action card you play
 *   this turn gains "When this hits a hero, create a Frailty, Inertia, or
 *   Bloodrot Pox token under their control." Go again
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Mixed cost {r} + destroy-self; go again refunds Action AP.
 * 2. Floating grant to next Action Attack this turn (appliesTo.next).
 * 3. Prior model used create-token token:"frailty-inertia-or-bloodrot-pox"
 *    — a synthetic slug that never resolves. Printed is a modal choose among
 *    three tokens → choose-and-create-token with options frailty/inertia/
 *    bloodrot-pox, chooser:controller, controller:attack-target.
 * 4. Non-random choose defaults to options[0] (frailty) when no UI answer —
 *    still a real create under the hit hero.
 * 5. Happy: activate → play Snatch → hit → opponent seats Frailty.
 * 6. Boundary: without activate, Snatch hit creates no plague token.
 * 7. Blade Break d1 when this defends (separate from destroy-self cost).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { toxicTips } from "../../../../../../cards/src/cards/equipment/toxic-tips.ts";

const LIFE = 40;
const SNATCH = 4;
const ARMS_D = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 96; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
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
    if (decision?.kind === "option" || decision?.kind === "effect-resolution") {
      const pick =
        decision.options.find((o) => /frailty/i.test(o.label) || /frailty/i.test(o.id)) ??
        decision.options[0];
      const optionId = pick?.id ?? decision.options[0]!.id;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer:
            decision.kind === "effect-resolution"
              ? { kind: "effect-resolution", optionId }
              : { kind: "option", optionIds: [optionId] },
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
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
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
    if (game.declareNoDefenseIfPending()) continue;
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

function plagueTokensUnder(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): string[] {
  const state = game.getState();
  const found: string[] = [];
  for (const zone of ["arena", "head", "chest", "arms", "legs"] as const) {
    for (const id of state.containers.zonesByPlayerId[playerId]?.[zone] ?? []) {
      const c = String(state.objects[id]?.canonicalId ?? id);
      if (/frailty|inertia|bloodrot/i.test(c)) found.push(c);
    }
  }
  return found;
}

describe("toxic-tips (ARA005)", () => {
  it("core mechanic: {r}+destroy → next AAC hit creates plague token under opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [toxicTips],
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(toxicTips);
    drain(game);

    // Destroy-self as cost; go again refunds Action AP; RP spent.
    expect(Bravo.zone("arms")).not.toContain(toxicTips.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(toxicTips.canonicalId);
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(game.getState().players[Bravo.id]!.resourcePoints).toBe(0);
    // Floating next-AAC grant armed.
    expect(
      game
        .getState()
        .continuousEffectInstances.some((inst) =>
          inst.atoms.some((atom) => atom.kind === "ability"),
        ),
    ).toBe(true);

    Bravo.play(snatchRed);
    drain(game);

    expect(Opp.life()).toBe(LIFE - SNATCH);
    // Token under hit hero (default option frailty when no chooser UI).
    const tokens = plagueTokensUnder(game, Opp.id);
    expect(tokens.length).toBe(1);
    expect(tokens[0]).toMatch(/frailty|inertia|bloodrot/i);
    expect(plagueTokensUnder(game, Bravo.id)).toHaveLength(0);
  });

  it("boundaries: without activate no token; Blade Break d1; model choose-and-create", () => {
    // Bare Snatch hit: no plague token.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).play(snatchRed);
    drain(bare);
    expect(plagueTokensUnder(bare, bare.as(dash).id)).toHaveLength(0);
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);

    // Blade Break when this defends (d1).
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [toxicTips],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defend(toxicTips);
    drain(bb);
    expect(bb.as(dash).zone("arms")).not.toContain(toxicTips.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(toxicTips.canonicalId);
    expect(bb.as(dash).life()).toBe(20 - (SNATCH - ARMS_D));

    // Model: choose-and-create-token options, not synthetic slug.
    const ability = toxicTips.base.abilities?.[0];
    expect(ability?.kind).toBe("activated");
    if (ability?.kind === "activated") {
      expect(ability.abilityType).toBe("action");
      expect(
        ability.layerKeywords?.some(
          (k) =>
            ("ref" in k && k.ref === "goAgain") || (k as { name?: string }).name === "go-again",
        ),
      ).toBe(true);
      expect(ability.effect?.type).toBe("grant-property");
      if (ability.effect?.type === "grant-property") {
        expect(ability.effect.appliesTo).toMatchObject({
          next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } },
        });
        const granted = ability.effect.property;
        expect(granted.kind).toBe("ability");
        if (
          granted.kind === "ability" &&
          granted.ability.kind === "static" &&
          granted.ability.staticKind === "triggered" &&
          granted.ability.resolution.kind === "effect"
        ) {
          expect(granted.ability.resolution.effect).toMatchObject({
            type: "choose-and-create-token",
            options: ["frailty", "inertia", "bloodrot-pox"],
            chooser: "controller",
            controller: "attack-target",
          });
        }
      }
    }
    expect(toxicTips.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
