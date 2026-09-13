/**
 * PEN094 Runebleed Robe — Runeblade Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   Instant - Destroy this and a Runechant you control: Prevent the next 1
 *   arcane damage that would be dealt to you this turn.
 *   Arcane Barrier 1
 *
 * Reasoning (case-by-case):
 * 1. Mixed Instant cost: destroy-self + destroy a Runechant you control.
 * 2. Filter was subtypes:["Runechant"] (never matches Token+Aura type-box) →
 *    remodel name: "Runechant" (Bloodsheath / Amethyst family).
 * 3. Then: fixed prevention 1 arcane this turn for controller.
 * 4. No Runechant → activate illegal (destroy cost unavailable).
 * 5. AB1: pay {r} prevent 1 arcane without destroying robe (independent path).
 *
 * Status: ✅ Instant destroy robe+Runechant → prevent 1 arcane; bare illegal; AB1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { runebleedRobe } from "../../../../../../cards/src/cards/equipment/runebleed-robe.ts";
import { runechant } from "../../../../../../cards/src/cards/tokens/runechant.ts";

const LIFE = 20;

const arcaneBolt2 = {
  canonicalId: "trainer-arcane-bolt-pen094",
  types: ["Wizard", "Action"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
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
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      // Prefer Runechant for destroy cost when present among candidates.
      const pick =
        decision.candidates.find((c) => {
          const cid = game.getState().objects[c.instanceId]?.canonicalId ?? "";
          return cid === runechant.canonicalId || cid === "token:runechant";
        }) ?? decision.candidates[0];
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

function runechantArenaCount(
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  return player
    .zone("arena")
    .filter((id) => id === runechant.canonicalId || id === "token:runechant").length;
}

describe("runebleed-robe (PEN094)", () => {
  it("core mechanic: destroy robe + Runechant → prevent next 1 arcane", () => {
    // Dash deals arcane; Bravo Instant-arms prevent on priority then takes bolt.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [runebleedRobe],
        arena: [runechant],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(runechantArenaCount(Bravo)).toBe(1);
    expect(Bravo.zone("chest")).toContain(runebleedRobe.canonicalId);

    // Instant on Dash's turn — give Bravo priority.
    if (game.getState().priority?.holderPlayerId !== Bravo.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Bravo.activate(runebleedRobe);
    drain(game);

    // Both costs paid: robe + Runechant leave.
    expect(Bravo.zone("chest")).not.toContain(runebleedRobe.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(runebleedRobe.canonicalId);
    expect(runechantArenaCount(Bravo)).toBe(0);

    // Dash resolves arcane 2 into armed prevent 1 → take 1.
    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.play(arcaneBolt2, { target: Bravo.id });
    drain(game);

    expect(Bravo.life()).toBe(LIFE - 1);
    expect(
      game
        .committedEvents()
        .some(
          (e) =>
            e.name === "prevent" &&
            e.data &&
            "preventedAmount" in e.data &&
            e.data.preventedAmount === 1,
        ),
    ).toBe(true);
  });

  it("boundaries: no Runechant illegal; AB1; model name Runechant destroy + prevent", () => {
    // No Runechant → Instant destroy cost unavailable.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [runebleedRobe],
        hand: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const rejected = bare.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: bare.as(bravo).card(runebleedRobe) },
    });
    expect(rejected.accepted).toBe(false);
    expect(bare.as(bravo).zone("chest")).toContain(runebleedRobe.canonicalId);

    // Arcane Barrier 1: 2 arcane → pay 1{r} prevent 1 → take 1; robe stays.
    const ab = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [runebleedRobe],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    ab.as(bravo).play(arcaneBolt2, { target: ab.as(dash).id });
    drain(ab);
    const barrierChoice = ab.as(dash).expectDecision("option");
    expect(barrierChoice.options).toHaveLength(1);
    ab.as(dash).chooseOptions(barrierChoice.options[0]!.id);
    drain(ab);
    expect(ab.as(dash).life()).toBe(LIFE - 1);
    expect(ab.as(dash).zone("chest")).toContain(runebleedRobe.canonicalId);
    expect(ab.as(dash).resourcePoints()).toBe(0);

    const a1 = runebleedRobe.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "effect", type: "destroy-self" },
        { class: "effect", type: "destroy", filter: { name: "Runechant" } },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      damageType: "arcane",
      duration: "this-turn",
    });
    expect(runebleedRobe.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "arcane-barrier", value: 1 })]),
    );
    expect(runebleedRobe.base.numeric.defense).toBe(0);
  });
});
