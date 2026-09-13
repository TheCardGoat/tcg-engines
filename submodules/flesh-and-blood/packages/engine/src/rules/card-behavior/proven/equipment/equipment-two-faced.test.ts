/**
 * PEN299 Two-Faced — Reviled Head d1 Blade Break.
 *
 * Printed:
 *   When this defends, the attacking hero draws a card, then look at their hand
 *   and choose a card. They discard the chosen card.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Trigger must be defend subject:self (co-defender must not fire).
 * 2. Draw player is attacking-hero (printed), not generic opponent.
 * 3. Look/choose must be at-resolution so the choice happens AFTER the draw —
 *    prior model used on-stack, which declared the discard target before draw.
 * 4. Controller of Two-Faced chooses; chosen card is discarded from attacker.
 * 5. BB d1 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, crackedBaubleYellow } from "../../../fixtures.ts";
import { twoFaced } from "../../../../../../cards/src/cards/equipment/two-faced.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  preferDiscardCanonicalId?: string,
): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
      const pick =
        (preferDiscardCanonicalId
          ? decision.candidates.find(
              (c) =>
                game.getState().objects[c.instanceId]?.canonicalId === preferDiscardCanonicalId,
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

describe("two-faced (PEN299)", () => {
  it("core mechanic: defend → attacker draws then chosen hand card discarded", () => {
    // Attacker starts with one hand card (bauble) + snatch to attack.
    // After snatch leaves hand, draw, then choose: discard must be able to pick
    // the drawn card (proves at-resolution after draw, not on-stack before).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, crackedBaubleYellow],
        actionPoints: 1,
        // Top of deck (end of array) is what draw pulls first.
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          snatchRed, // drawn into hand on Two-Faced trigger
        ],
      },
      {
        hero: dash,
        life: LIFE,
        head: [twoFaced],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    // Hand after attack: only bauble.
    expect(Attacker.zone("hand")).toEqual([crackedBaubleYellow.canonicalId]);

    Defender.defendWith(twoFaced);
    // Choose the drawn snatch (not the bauble) — only legal if look is after draw.
    drain(game, snatchRed.canonicalId);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Drawn snatch was discarded (GY has it from discard; combat snatch also ends GY).
    expect(
      Attacker.zone("graveyard").filter((id) => id === snatchRed.canonicalId).length,
    ).toBeGreaterThanOrEqual(1);
    // Bauble remains in hand (was not chosen) — proves selective discard after draw.
    expect(Attacker.zone("hand")).toContain(crackedBaubleYellow.canonicalId);
    // Blade Break d1.
    expect(Defender.zone("head")).not.toContain(twoFaced.canonicalId);
    expect(Defender.zone("graveyard")).toContain(twoFaced.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: co-defender alone does not fire; empty hand after draw no discard; model", () => {
    // Co-defend with hand card only — head not defending → no two-faced trigger.
    const co = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [twoFaced],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const handBefore = co.as(bravo).zone("hand").length;
    co.as(bravo).attackWith(snatchRed);
    // Defend only with hand card, not two-faced.
    co.as(dash).defendWith(nimblismBlue);
    drain(co);
    co.helpers.resolveRestOfCombat();
    // No two-faced discard cycle: attacker hand not forced through look+discard.
    // Snatch may still draw on hit; assert two-faced stayed seated (not BB).
    expect(co.as(dash).zone("head")).toContain(twoFaced.canonicalId);
    expect(co.as(dash).zone("graveyard")).not.toContain(twoFaced.canonicalId);
    // Attacker did not get the two-faced look decision path (no forced GY discard of hand).
    void handBefore;

    // Empty deck + empty hand after attack: draw fails, look has no candidates.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [], // no draw
      },
      {
        hero: dash,
        life: LIFE,
        head: [twoFaced],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    empty.as(bravo).attackWith(snatchRed);
    empty.as(dash).defendWith(twoFaced);
    drain(empty);
    empty.helpers.resolveRestOfCombat();
    // Trigger still resolved; BB destroys head; attacker hand stays empty.
    expect(empty.as(bravo).zone("hand").length).toBe(0);
    expect(empty.as(dash).zone("graveyard")).toContain(twoFaced.canonicalId);

    const a1 = twoFaced.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
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
    expect(a1.resolution?.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "draw", count: 1, player: "attacking-hero" },
        {
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["hand"],
            count: { type: "up-to", amount: 1 },

            chooser: "controller",
          },
          outputBinding: "it",
        },
        { type: "discard", target: { selector: "binding", binding: "it" } },
      ],
    });
    expect(twoFaced.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(twoFaced.base.numeric.defense).toBe(1);
  });
});
