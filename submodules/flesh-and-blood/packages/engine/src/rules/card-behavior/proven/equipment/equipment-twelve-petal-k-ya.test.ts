/**
 * MST048 Twelve Petal Kāṣāya — Mystic Ninja Chest d2 Blade Break.
 *
 * Printed:
 *   Whenever you transcend, you may gain {r}.
 *   Instant - {c}{c}{c}, destroy this: Create a Zen State token.
 *   Blade Break
 *
 * Reasoning (case-by-case; no batch script):
 * 1. Transcend is an observation event emitted when a played card carries a
 *    `label: { name: "transcend" }` ability (CR 8.5.48 / play finalize).
 *    Homage to Ancestors (ENG026) is a free Instant with that label — playing
 *    it stamps history.turn.transcended and must collect MST048-a1.
 * 2. a1 is optional gain-resources 1 — accept → +1{r}; decline → no RP.
 *    Non-transcend plays (Snatch) must not open the optional or invent RP.
 * 3. a2 is Instant (no AP): mixed cost 3 chi + destroy-self → create-token
 *    zen-state. Seed chiPoints; chi spent; equipment leaves chest; Zen State
 *    enters arena. Insufficient chi is illegal.
 * 4. Blade Break d2: defend → snatch 4 − 2 = 2 damage; equipment → GY.
 *
 * Status: ✅ transcend optional {r}; Instant 3 chi destroy→Zen State; BB d2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "../../../../index.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { twelvePetalKYa } from "../../../../../../cards/src/cards/equipment/twelve-petal-k-ya.ts";
import { homageToAncestorsBlue } from "../../../../../../cards/src/cards/instants/homage-to-ancestors.ts";

const SNATCH = 4;
const LIFE = 20;

/**
 * Walk decisions / priority. Boolean optionals answered with `accept`.
 */
function resolveWithOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
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

describe("twelve-petal-k-ya (MST048)", () => {
  it("core mechanic: transcend → optional gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [twelvePetalKYa],
        hand: [homageToAncestorsBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(game.getState().players[Bravo.id]?.history.turn.transcended).toBeFalsy();
    expect(Bravo.resourcePoints()).toBe(0);

    // Play a blue card first to satisfy ENG026's transcend condition.
    Bravo.play(nimblismBlue);
    game.passBoth();
    // Homage's a2 resolution effect is {type:"transcend"} (CR 8.5.48).
    Bravo.play(homageToAncestorsBlue);
    resolveWithOptional(game, true);

    expect(game.getState().players[Bravo.id]?.history.turn.transcended).toBe(true);
    // Accept optional → +1{r}. Homage also gains 1{h}; ignore life.
    expect(Bravo.resourcePoints()).toBe(1);
    // Equipment still equipped (not destroyed by transcend path).
    expect(Bravo.zone("chest")).toContain(twelvePetalKYa.canonicalId);
  });

  it("boundaries: decline optional; non-transcend play does not invent {r}", () => {
    // Decline: transcend stamps history but RP stays 0.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        chest: [twelvePetalKYa],
        hand: [homageToAncestorsBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    decline.as(bravo).play(nimblismBlue);
    decline.passBoth();
    decline.as(bravo).play(homageToAncestorsBlue);
    resolveWithOptional(decline, false);

    expect(decline.getState().players[decline.as(bravo).id]?.history.turn.transcended).toBe(true);
    expect(decline.as(bravo).resourcePoints()).toBe(0);

    // Non-transcend: Snatch attack does not fire MST048-a1.
    const noTranscend = FabTestEngine.start(
      {
        hero: bravo,
        chest: [twelvePetalKYa],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    noTranscend.as(bravo).attackWith(snatchRed);
    resolveWithOptional(noTranscend, true);
    noTranscend.helpers.resolveRestOfCombat();
    resolveWithOptional(noTranscend, true);

    expect(
      noTranscend.getState().players[noTranscend.as(bravo).id]?.history.turn.transcended,
    ).toBeFalsy();
    expect(noTranscend.as(bravo).resourcePoints()).toBe(0);
  });

  it("core mechanic: Instant 3 chi + destroy-self → Zen State token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [twelvePetalKYa],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        chiPoints: 3,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(twelvePetalKYa);
    resolveWithOptional(game, true);

    expect(game.getState().players[Bravo.id]!.chiPoints).toBe(0);
    expect(Bravo.zone("chest")).not.toContain(twelvePetalKYa.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(twelvePetalKYa.canonicalId);
    // Zen State token enters arena under controller.
    expect(Bravo.zone("arena")).toContain("token:zen-state");
    // AP unchanged — Instant activation has no action-point cost.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: Instant activate illegal with fewer than 3 chi", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [twelvePetalKYa],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
        chiPoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(twelvePetalKYa)).toThrow();
    expect(Bravo.zone("chest")).toContain(twelvePetalKYa.canonicalId);
    expect(game.getState().players[Bravo.id]!.chiPoints).toBe(2);
  });

  it("core mechanic: Blade Break d2 after defend", () => {
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
        chest: [twelvePetalKYa],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(twelvePetalKYa);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).not.toContain(twelvePetalKYa.canonicalId);
    expect(Defender.zone("graveyard")).toContain(twelvePetalKYa.canonicalId);
  });

  it("model: a1 transcend optional {r}; a2 Instant chi×3 + destroy-self → zen-state; BB", () => {
    expect(twelvePetalKYa.base.numeric.defense).toBe(2);
    expect(twelvePetalKYa.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);

    const a1 = twelvePetalKYa.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.staticKind).toBe("triggered");
      expect(a1.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "transcend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: { type: "gain-resources", amount: 1 },
      });
    }

    const a2 = twelvePetalKYa.base.abilities?.[1];
    expect(a2?.kind).toBe("activated");
    if (a2?.kind === "activated") {
      expect(a2.abilityType).toBe("instant");
      expect(a2.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: expect.arrayContaining([
          expect.objectContaining({ class: "asset", type: "chi", amount: 3 }),
          expect.objectContaining({ class: "effect", type: "destroy-self" }),
        ]),
      });
      expect(a2.effect).toMatchObject({
        type: "create-token",
        token: "zen-state",
        controller: "controller",
      });
    }

    // Registry resolves the token slug used by create-token.
    expect(fabToken("zen-state").canonicalId).toBeTruthy();
  });
});
