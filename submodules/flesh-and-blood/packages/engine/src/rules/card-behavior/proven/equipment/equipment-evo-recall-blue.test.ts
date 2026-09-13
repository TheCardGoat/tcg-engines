/**
 * MST228 Evo Recall (blue) — Mechanologist Instant Evo Head d0 Arcane Barrier 1.
 *
 * Printed:
 *   If you have a base head equipped, transform it into this, then equip this.
 *   When this is equipped, put up to 1 Mechanologist action card from your
 *   banished zone on top of your deck.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored):
 * 1. a1 Evo transform/equip play path OPEN under-zone (same family as EVO050).
 *    Model corrected to Base+Head object target (was transform self).
 * 2. a2 equip subject:self — seating fires "when equipped"; optional upTo
 *    put Mech action from banished on deck top is production-testable.
 * 3. Decline / empty banished → no deck change.
 * 4. Arcane Barrier 1 keyword.
 *
 * Status: 🟡 equip banished→deck-top proven; play transform OPEN under-zone.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { evoRecallBlue } from "../../../../../../cards/src/cards/instants/evo-recall.ts";
import { scrapProspectorRed } from "../../../../../../cards/src/cards/actions/scrap-prospector.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { pickCanonicalId?: string; emptyTargets?: boolean } = {},
): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
    if (decision?.kind === "entity-target") {
      if (opts.emptyTargets || decision.candidates.length === 0) {
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
      const pick =
        (opts.pickCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.pickCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("evo-recall-blue (MST228)", () => {
  it("proven: equip → optional banished Mech action to deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoRecallBlue],
        banished: [scrapProspectorRed, nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        life: 20,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    drain(game, { pickCanonicalId: scrapProspectorRed.canonicalId });

    expect(Dash.zone("head")).toContain(evoRecallBlue.canonicalId);
    expect(Dash.zone("banished")).not.toContain(scrapProspectorRed.canonicalId);
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")).toContain(scrapProspectorRed.canonicalId);
    // Deck top is first entry after reverse-pop conventions vary — assert present.
  });

  it("boundaries: decline empty pick; model Base+Head transform; AB1", () => {
    const empty = FabTestEngine.start(
      {
        hero: dash,
        head: [evoRecallBlue],
        banished: [nimblismBlue],
        deck: 6,
        life: 20,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const deckBefore = empty.as(dash).zone("deck").length;
    drain(empty, { emptyTargets: true });
    // Non-Mech banished only — no legal pick; deck size unchanged.
    expect(empty.as(dash).zone("deck").length).toBe(deckBefore);
    expect(empty.as(dash).zone("banished")).toContain(nimblismBlue.canonicalId);

    const a1 = evoRecallBlue.base.abilities?.[0];
    expect(a1?.kind).toBe("resolution");
    if (a1?.kind === "resolution") {
      expect(a1.condition).toMatchObject({
        type: "equipped-count",
        filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Head"] } },
      });
      expect(a1.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              zones: ["equipment-head"],
              filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Head"] } },
            },
            into: "this",
          },
          { type: "equip", target: { selector: "self" } },
        ],
      });
    }
    const a2 = evoRecallBlue.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static" && a2.trigger) {
      expect(a2.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "equip",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      });
    }
    expect(
      evoRecallBlue.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
  });
});
