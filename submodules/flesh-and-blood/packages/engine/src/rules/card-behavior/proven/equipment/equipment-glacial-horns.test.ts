/**
 * UPR137 Glacial Horns — Ice Head d0.
 *
 * Printed:
 *   Action - Destroy Glacial Horns: Choose a hero. Freeze up to 1 card in their
 *   arsenal and 1 ally they control until the start of your next turn. Go again
 *
 * Reasoning (hand-authored, 1v1 product):
 * 1. Action destroy-self + go again AP refund.
 * 2. Choose a hero → sole opponent (1v1); freezes use player:opponent
 *    at-resolution (model was on-stack + target-controller which returned null).
 * 3. Up to 1 arsenal + up to 1 Ally freeze latch continuous restrict freeze.
 * 4. Empty arsenal/ally → still destroys + go again (upTo empty).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, cintariSellsword } from "../../../fixtures.ts";
import { glacialHorns } from "../../../../../../cards/src/cards/equipment/glacial-horns.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { emptyTargets?: boolean } = {},
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
      const picks =
        opts.emptyTargets || decision.candidates.length === 0
          ? []
          : decision.candidates.slice(0, 1).map((c) => c.instanceId);
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function freezeLatchedTo(
  game: ReturnType<typeof FabTestEngine.start>,
  instanceId: string,
): boolean {
  return game.getState().continuousEffectInstances.some((instance) => {
    const hasFreeze = instance.atoms.some(
      (atom) =>
        atom.kind === "rule" && atom.mode === "restrict" && atom.parameters.kind === "freeze",
    );
    if (!hasFreeze) return false;
    return instance.initialSubjects.some((s) => s.instanceId === instanceId);
  });
}

describe("glacial-horns (UPR137)", () => {
  it("core mechanic: destroy-self freezes opponent arsenal + ally; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [glacialHorns],
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        // Face-down arsenal is still a card in arsenal (freeze target).
        arsenal: [snatchRed],
        arena: [cintariSellsword],
        hand: [],
        deck: 4,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const arsenalId = game.getState().containers.zonesByPlayerId[Dash.id]!.arsenal[0]!;
    const allyId = game
      .getState()
      .containers.zonesByPlayerId[Dash.id]!.arena.find(
        (id) => game.getState().objects[id]?.canonicalId === cintariSellsword.canonicalId,
      )!;

    Bravo.activate(glacialHorns);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(glacialHorns.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(glacialHorns.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
    expect(freezeLatchedTo(game, arsenalId)).toBe(true);
    expect(freezeLatchedTo(game, allyId)).toBe(true);
  });

  it("boundaries: empty arsenal/ally still destroys; model opponent at-resolution freezes", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [glacialHorns],
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [],
        deck: 4,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(glacialHorns);
    drain(game, { emptyTargets: true });

    expect(Bravo.zone("graveyard")).toContain(glacialHorns.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);

    const a1 = glacialHorns.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "freeze",
          target: {
            player: "opponent",
            zones: ["arsenal"],
            count: { type: "up-to", amount: 1 },

            declared: "at-resolution",
          },
          duration: "until-start-of-own-next-turn",
        },
        {
          type: "freeze",
          target: {
            player: "opponent",
            zones: ["permanent"],
            filter: { typeBox: { subtypes: ["Ally"] } },
            count: { type: "up-to", amount: 1 },

            declared: "at-resolution",
          },
          duration: "until-start-of-own-next-turn",
        },
      ],
    });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
    expect(glacialHorns.base.numeric.defense).toBe(0);
  });
});

// temporary debug only if needed
