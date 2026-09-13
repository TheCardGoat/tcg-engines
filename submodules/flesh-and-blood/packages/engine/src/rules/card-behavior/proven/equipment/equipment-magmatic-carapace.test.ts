/**
 * PEN017 Magmatic Carapace — Guardian Chest d2 Guardwell.
 *
 * Printed:
 *   Whenever you play an aura, you may {t} this and pay {r}. If you do,
 *   create a Seismic Surge token.
 *   Guardwell
 *
 * Reasoning (case-by-case):
 * 1. Play-aura trigger needs actor:controller + types:["Aura"] (was subtypes
 *    Aura — type-box Aura is not a subtype vocabulary match).
 * 2. Optional pay: tap carapace + 1{r} → Seismic Surge under controller.
 * 3. Decline / 0 RP: no Surge; carapace untapped.
 * 4. Non-aura play (Snatch) does not open the optional.
 * 5. Guardwell: defend d2 → −2 defense counters, stays equipped.
 *
 * Status: ✅ play aura → tap+{r} → Seismic Surge; decline/non-aura; guardwell.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { magmaticCarapace } from "../../../../../../cards/src/cards/equipment/magmatic-carapace.ts";
import { distantRumblingRed } from "../../../../../../cards/src/cards/actions/distant-rumbling.ts";

const SNATCH = 4;
const LIFE = 20;

function seismicSurgeCount(
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  return player.zone("arena").filter((id) => id === "token:seismic-surge").length;
}

/**
 * Walk decisions. Boolean optionals answered with `accept`.
 * Distant Rumbling enter-arena may ask for a hand card to deck.
 */
function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts?: { acceptBoolean?: boolean },
): void {
  const accept = opts?.acceptBoolean ?? true;
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
      if (picks.length < need && need > 0) {
        // mayFail empty when allowed
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
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
    if (decision?.kind === "payment") {
      // RP pre-seeded; pitch unexpected.
      throw new Error(`unexpected payment decision: ${decision.label ?? decision.kind}`);
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

describe("magmatic-carapace (PEN017)", () => {
  it("core mechanic: play aura → optional tap + {r} → Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [magmaticCarapace],
        // Distant Rumbling is a free Guardian Action Aura.
        // Extra hand card for its enter-arena "put a card into deck" step.
        hand: [distantRumblingRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const plateId = Bravo.findCardInZone("chest", magmaticCarapace);

    expect(seismicSurgeCount(Bravo)).toBe(0);
    expect(game.objectState(plateId)?.tapped).toBeFalsy();

    Bravo.play(distantRumblingRed);
    drain(game, { acceptBoolean: true });

    expect(Bravo.zone("arena")).toContain(distantRumblingRed.canonicalId);
    expect(game.objectState(plateId)?.tapped).toBe(true);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(seismicSurgeCount(Bravo)).toBe(1);
    // Carapace stays equipped (only tapped).
    expect(Bravo.zone("chest")).toContain(magmaticCarapace.canonicalId);
  });

  it("boundaries: decline; non-aura no trigger; 0 RP no free Surge; guardwell; model", () => {
    // Decline optional: no Surge, carapace untapped, RP kept.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        chest: [magmaticCarapace],
        hand: [distantRumblingRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const dId = decline.as(bravo).findCardInZone("chest", magmaticCarapace);
    decline.as(bravo).play(distantRumblingRed);
    drain(decline, { acceptBoolean: false });
    expect(decline.objectState(dId)?.tapped).toBeFalsy();
    expect(seismicSurgeCount(decline.as(bravo))).toBe(0);
    expect(decline.as(bravo).resourcePoints()).toBe(1);

    // Non-aura Action Attack does not fire magmatic optional.
    const nonAura = FabTestEngine.start(
      {
        hero: bravo,
        chest: [magmaticCarapace],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    nonAura.as(bravo).attackWith(snatchRed);
    drain(nonAura, { acceptBoolean: true });
    nonAura.helpers.resolveRestOfCombat();
    expect(seismicSurgeCount(nonAura.as(bravo))).toBe(0);
    expect(nonAura.as(bravo).resourcePoints()).toBe(1);

    // 0 RP: accept optional cannot invent free Seismic Surge (pay fails closed).
    const noRp = FabTestEngine.start(
      {
        hero: bravo,
        chest: [magmaticCarapace],
        hand: [distantRumblingRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const nId = noRp.as(bravo).findCardInZone("chest", magmaticCarapace);
    noRp.as(bravo).play(distantRumblingRed);
    // Accept may open; pay with 0 RP must not stage then.
    drain(noRp, { acceptBoolean: true });
    expect(seismicSurgeCount(noRp.as(bravo))).toBe(0);
    expect(noRp.objectState(nId)?.tapped).toBeFalsy();

    // Guardwell: defend d2 → −2 counters, stay equipped.
    const gw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [magmaticCarapace],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = gw.as(dash);
    const plateId = Defender.findCardInZone("chest", magmaticCarapace);
    gw.as(bravo).attackWith(snatchRed);
    Defender.defendWith(magmaticCarapace);
    gw.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(magmaticCarapace.canonicalId);
    expect(gw.objectState(plateId)?.defenseCounterTotal).toBe(-2);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));

    const a1 = magmaticCarapace.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: { typeBox: { subtypes: ["Aura"] } },
          },
        },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "pay",
          cost: {
            class: "mixed",
            type: "all",
            costs: expect.arrayContaining([
              expect.objectContaining({ class: "effect", type: "tap-self" }),
              expect.objectContaining({ class: "asset", type: "resources", amount: 1 }),
            ]),
          },
        },
        then: {
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
        },
      });
    }
    expect(magmaticCarapace.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
    expect(magmaticCarapace.base.numeric.defense).toBe(2);
  });
});
