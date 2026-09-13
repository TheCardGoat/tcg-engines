/**
 * OMN209 Helm of Astral Sanctuary — Generic Head d0.
 *
 * Printed:
 *   Instant - {t} your hero, destroy this: Prevent the next 1 damage that
 *   would be dealt to you this turn.
 *
 * Reasoning (hand-authored):
 * 1. Instant tap-hero + destroy-self arms prevent 1 this-turn.
 * 2. Defend priority activate → helm GY, hero tapped, then snatch 4−1.
 * 3. Already-tapped hero / second activate after destroy illegal.
 */
import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { helmOfAstralSanctuary } from "../../../../../../cards/src/cards/equipment/helm-of-astral-sanctuary.ts";
import { shelterFromTheStormRed } from "../../../../../../cards/src/cards/defense-reactions/shelter-from-the-storm.ts";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";

const fourPackets = defineFleshAndBloodCard({
  canonicalId: "test-four-packets",
  slug: "test-four-packets",
  types: ["Generic", "Instant"],
  color: "Blue",
  pitch: "3",
  cost: 0,
  abilities: [
    {
      id: "test-four-packets-a1",
      kind: "resolution",
      text: "Deal 1 damage to target hero.",
      effect: {
        type: "deal-damage",
        damageType: "generic",
        amount: 1,
        target: { selector: "any-hero" },
      },
    },
  ],
});

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("helm-of-astral-sanctuary (OMN209)", () => {
  it("core mechanic: Instant tap-hero + destroy → prevent 1 on next damage", () => {
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
        head: [helmOfAstralSanctuary],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const heroId = game.getState().containers.zonesByPlayerId[Defender.id]!.heroZone[0]!;

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(helmOfAstralSanctuary);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("graveyard")).toContain(helmOfAstralSanctuary.canonicalId);
    expect(Defender.zone("head")).not.toContain(helmOfAstralSanctuary.canonicalId);
    expect(game.objectState(heroId)?.tapped).toBe(true);
    // Snatch 4, prevent 1 → 3 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: already-tapped hero illegal; model Instant tap-hero+destroy prevention", () => {
    const tapped = FabTestEngine.start(
      {
        hero: bravo,
        heroState: { tapped: true },
        head: [helmOfAstralSanctuary],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => tapped.as(bravo).activate(helmOfAstralSanctuary)).toThrow();

    const a1 = helmOfAstralSanctuary.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "effect", type: "tap-hero" },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
  });

  it("consumes Helm on the first packet and Shelter on exactly the next three packets", () => {
    let game = FabTestEngine.start(
      { hero: bravo, hand: [fourPackets, fourPackets, fourPackets, fourPackets], deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [helmOfAstralSanctuary],
        hand: [shelterFromTheStormRed, snatchRed, snatchRed, snatchRed],
        arsenal: [snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    let Attacker = game.as(bravo);
    let Defender = game.as(dash);

    Attacker.pass();
    Defender.activate(helmOfAstralSanctuary);
    drain(game);
    Attacker.play(fourPackets, { target: Defender });
    drain(game);

    Attacker.pass();
    Defender.activate(shelterFromTheStormRed);
    drain(game);

    const armed = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(armed),
        createFabMatchContext(armed.cardDefinitions, armed.publicCardIdentities),
      ),
    );
    Attacker = game.as(bravo);
    Defender = game.as(dash);

    for (let packet = 0; packet < 3; packet += 1) {
      Attacker.play(fourPackets, { target: Defender });
      drain(game);
    }

    expect(Defender.life()).toBe(LIFE);
    expect(Defender.zone("graveyard")).toEqual(
      expect.arrayContaining([
        helmOfAstralSanctuary.canonicalId,
        shelterFromTheStormRed.canonicalId,
      ]),
    );
    expect(game.getState().replacementEffects).toHaveLength(0);
  });
});
