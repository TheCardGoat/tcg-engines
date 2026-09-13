/**
 * IAR109 Grasp of the Darknight — Shadow Runeblade Arms d0.
 *
 * Printed:
 *   Action - {r}, destroy this: Opt 1, then create a Runechant token. Go again
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Action mixed cost 1{r} + destroy-self.
 * 2. Opt 1 partition on deck top (Seeker family drain).
 * 3. Create Runechant under controller.
 * 4. layerKeywords goAgain refunds Action AP.
 * 5. 0 RP illegal; model already clean.
 *
 * Status: ✅ Action {r} destroy → Opt 1 + Runechant + GA; 0 RP illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { graspOfTheDarknight } from "../../../../../../cards/src/cards/equipment/grasp-of-the-darknight.ts";

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
    if (decision?.kind === "partition") {
      const ids = decision.entries.map((e) => e.id);
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "partition",
            groups: { top: ids, bottom: [] },
          },
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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function hasRunechant(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const arena = state.containers.zonesByPlayerId[playerId]?.arena ?? [];
  return arena.some((id) => {
    const obj = state.objects[id];
    if (!obj) return false;
    const def = state.cardDefinitions[obj.canonicalId];
    const slug = def?.slug ?? obj.canonicalId;
    return /runechant/i.test(slug) || /runechant/i.test(obj.canonicalId);
  });
}

describe("grasp-of-the-darknight (IAR109)", () => {
  it("core mechanic: Action {r} destroy → Opt 1 + Runechant + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [graspOfTheDarknight],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        // Known deck top for opt (partition entries present).
        deck: [nimblismBlue, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const apBefore = game.getState().players[Bravo.id]!.actionPoints;

    Bravo.activate(graspOfTheDarknight);
    drain(game);

    // Cost: 1{r} + destroy-self → arms empty, GY.
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arms")).not.toContain(graspOfTheDarknight.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(graspOfTheDarknight.canonicalId);

    // Effect: Runechant created; go again refunds Action AP.
    expect(hasRunechant(game, Bravo.id)).toBe(true);
    expect(game.getState().players[Bravo.id]!.actionPoints).toBe(apBefore);
  });

  it("boundaries: 0 RP illegal; model Action mixed {r}+destroy-self opt+runechant GA", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        arms: [graspOfTheDarknight],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(graspOfTheDarknight)).toThrow();

    const a1 = graspOfTheDarknight.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 1 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "opt", count: 1 },
        { type: "create-token", token: "runechant", controller: "controller" },
      ],
    });
    expect(graspOfTheDarknight.base.numeric.defense).toBe(0);
  });
});
