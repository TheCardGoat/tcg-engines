/**
 * OSC004 Ink-lined Cloak — Wizard Chest d0.
 *
 * Printed:
 *   Instant - Destroy this: Gain {r}. Activate this only if you control an
 *   aura permanent with Sigil in its name.
 *
 * Reasoning (case-by-case):
 * 1. Gate is control-object of Aura permanent with name containing "Sigil".
 * 2. Aura is a type-box type — subtypes:["Aura"] never matches Sigil of Fate
 *    (types: Wizard/Token/Aura). Remodeled to types:["Aura"].
 * 3. Instant destroy-self → +1{r} with Sigil in arena; bare illegal.
 * 4. Non-Sigil aura does not open the gate.
 *
 * Status: ✅ Sigil gate + destroy → {r}; bare/non-Sigil illegal; types Aura.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { inkLinedCloak } from "../../../../../../cards/src/cards/equipment/ink-lined-cloak.ts";
import { lightningFlow } from "../../../../../../cards/src/cards/tokens/lightning-flow.ts";
import { sigilOfSolaceRed } from "../../../../../../cards/src/cards/instants/sigil-of-solace.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
    if (game.answerForcedDecision()) continue;
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

describe("ink-lined-cloak (OSC004)", () => {
  it("core mechanic: with Sigil aura → Instant destroy → gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [inkLinedCloak],
        arena: [fabToken("sigil-of-fate")],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.resourcePoints()).toBe(0);
    Bravo.activate(inkLinedCloak);
    drain(game);

    expect(Bravo.zone("graveyard")).toContain(inkLinedCloak.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(inkLinedCloak.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
  });

  it("boundaries: no Sigil / non-Sigil aura illegal; model types Aura + nameContains", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [inkLinedCloak],
        arena: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(inkLinedCloak)).toThrow();
    expect(bare.as(bravo).zone("chest")).toContain(inkLinedCloak.canonicalId);

    // Lightning Flow is an Aura token but not a Sigil.
    const nonSigil = FabTestEngine.start(
      {
        hero: bravo,
        chest: [inkLinedCloak],
        arena: [lightningFlow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => nonSigil.as(bravo).activate(inkLinedCloak)).toThrow();

    const a1 = inkLinedCloak.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
      expect(a1.condition).toMatchObject({
        type: "control-object",
        filter: {
          and: [{ typeBox: { subtypes: ["Aura"] } }, { nameContains: "Sigil" }],
        },
      });
      expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    }
    expect(inkLinedCloak.base.numeric.defense).toBe(0);
  });

  it("control boundary: a Sigil aura card in hand does not unlock the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [inkLinedCloak],
        hand: [sigilOfSolaceRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(inkLinedCloak)).toThrow();
    expect(Bravo.zone("chest")).toContain(inkLinedCloak.canonicalId);
    expect(Bravo.zone("hand")).toContain(sigilOfSolaceRed.canonicalId);
  });
});
