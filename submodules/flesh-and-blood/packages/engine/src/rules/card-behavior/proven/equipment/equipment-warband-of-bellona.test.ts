/**
 * EVO247 Warband of Bellona — Light Warrior Head d2 temper.
 *
 * Printed:
 *   Action - {r}{r}, destroy this: The next time you attack this turn, you may
 *   charge your hero's soul. If a yellow card is charged this way, draw a card.
 *   Go again. Temper
 *
 * Reasoning:
 * 1. Prior model put yellow-draw as a sibling of delayed-trigger at activation
 *    (always fail-closed) and charged `controller` instead of a hand card.
 * 2. Nested charge+yellow-draw inside one-shot delayed attack matches ASB003.
 * 3. Temper d2 is production. Activate destroy + delayed charge is the core.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { warbandOfBellona } from "../../../../../../cards/src/cards/equipment/warband-of-bellona.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; chargeCanonicalId?: string } = {},
): void {
  for (let safety = 0; safety < 60; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptOptional ?? false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.chargeCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.chargeCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("warband-of-bellona (EVO247)", () => {
  it("proven: temper d2 defend keeps seat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        head: [warbandOfBellona],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(dash).attackWith(snatchRed);
    game.as(bravo).defendWith(warbandOfBellona);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(LIFE - (SNATCH - 2));
    expect(game.as(bravo).zone("head")).toContain(warbandOfBellona.canonicalId);
  });

  it("core mechanic: Action 2{r}+destroy → next attack charge yellow → soul + draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [warbandOfBellona],
        // Yellow to charge on attack; snatch to attack; deck for draw.
        hand: [tomeOfFyendalYellow, snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(warbandOfBellona);
    drain(game);
    expect(Bravo.zone("head")).not.toContain(warbandOfBellona.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(warbandOfBellona.canonicalId);
    // Go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);

    const deckBeforeAttack = Bravo.zone("deck").length;
    const handBeforeAttack = Bravo.zone("hand").length;
    Bravo.play(snatchRed);
    drain(game, {
      acceptOptional: true,
      chargeCanonicalId: tomeOfFyendalYellow.canonicalId,
    });
    // Resolve charge/draw before combat close draws or other end-of-link noise.
    for (let i = 0; i < 12 && game.getState().rulesStack.length > 0; i += 1) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
      else break;
    }

    expect(Bravo.zone("soul")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(tomeOfFyendalYellow.canonicalId);
    // Play snatch (−1 hand), charge yellow (−1 hand), draw yellow-way (+1 hand).
    // Core outcome: yellow in soul; deck shrank from the yellow-way draw.
    expect(Bravo.zone("deck").length).toBeLessThan(deckBeforeAttack);
    expect(Bravo.zone("hand").length).toBeGreaterThanOrEqual(handBeforeAttack - 2);
  });

  it("boundaries: 0 RP cannot pay destroy Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [warbandOfBellona],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(warbandOfBellona)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(warbandOfBellona.canonicalId);
  });

  it("model guard: delayed attack nests optional hand charge + yellow draw", () => {
    const a1 = warbandOfBellona.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.effect).toMatchObject({
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      policy: {
        kind: "windowed",
        duration: "this-turn",
        matching: "first",
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "charge",
                target: {
                  selector: "object",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "chargedCard",
                filter: { color: ["yellow"] },
              },
              then: { type: "draw", count: 1, player: "controller" },
            },
          ],
        },
      },
    });
  });
});
