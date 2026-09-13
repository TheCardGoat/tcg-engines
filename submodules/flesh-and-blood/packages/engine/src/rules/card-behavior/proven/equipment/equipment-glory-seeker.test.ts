/**
 * HVY196 Glory Seeker — Generic Head (no printed defense).
 *
 * Printed:
 *   Instant - {r}{r}{r}, destroy this: Draw a card.
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self + 3 resources → draw 1.
 * 2. Insufficient resources illegal.
 * 3. Second activate after destroy illegal.
 * 4. No defend path (no defense value) — equip seat only.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { glorySeeker } from "../../../../../../cards/src/cards/equipment/glory-seeker.ts";

describe("glory-seeker (HVY196)", () => {
  it("core mechanic: Instant 3{r} destroy → draw 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [glorySeeker],
        resourcePoints: 3,
        deck: 6,
        hand: [],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(glorySeeker);
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.answerForcedDecision()) continue;
      if (!game.getState().decision && game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }

    expect(Bravo.zone("head")).not.toContain(glorySeeker.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(glorySeeker.canonicalId);
    expect(Bravo.zone("hand").length).toBe(1);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: insufficient RP illegal; destroyed not re-activatable; model", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [glorySeeker],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const rejected = poor.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: poor.as(bravo).card(glorySeeker) },
    });
    expect(rejected.accepted).toBe(false);

    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [glorySeeker],
        hand: [],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(glorySeeker);
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.answerForcedDecision()) continue;
      if (!game.getState().decision && game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }
    expect(() => Bravo.activate(glorySeeker)).toThrow();

    const a1 = glorySeeker.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 3 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({ type: "draw", count: 1, player: "controller" });
    expect(glorySeeker.base.numeric.defense).toBeUndefined();
  });
});
