/**
 * HNT005 Arakni, Orb Weaver — demi-hero acceptance.
 *
 * a1: "Graphene Chelicerae cost you {r} less to activate."
 * a2: "Once per Turn Instant - Discard an Assassin card: Equip a Graphene
 *      Chelicera token. Your next attack with stealth this turn gets +3{p}."
 * a3: "At the beginning of your end phase, return to the brood."
 *     — already covered by arakni-agents-brood.test.ts.
 */
import { describe, expect, it } from "vitest";

import { arakniOrbWeaver } from "../../../../cards/src/cards/demi-heroes/arakni-orb-weaver.ts";
import { arakniMarionette } from "../../../../cards/src/cards/heroes/arakni-marionette.ts";
import { biteRed } from "../../../../cards/src/cards/actions/bite.ts";
import { grapheneChelicera } from "../../../../cards/src/cards/weapons/graphene-chelicera.ts";
import { runicReclamationRed as runicReclamation } from "../../../../cards/src/cards/actions/runic-reclamation.ts";
import { theryonMagisterOfJustice } from "../../../../cards/src/cards/heroes/theryon-magister-of-justice.ts";
import {
  createFabMatchContext,
  fabToken,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import { dash } from "../../rules/fixtures.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function orbWeaverGame(options: { source?: boolean; weapons?: number } = {}) {
  const weapons = options.weapons ?? 1;
  return FabTestEngine.start(
    {
      hero: arakniMarionette,
      arena: options.source === false ? [] : [arakniOrbWeaver],
      weapon1: weapons >= 1 ? [grapheneChelicera] : [],
      weapon2: weapons >= 2 ? [grapheneChelicera] : [],
      deck: 8,
      actionPoints: 2,
      resourcePoints: 0,
    },
    { hero: dash, deck: 8 },
    manual,
  );
}

describe("Arakni, Orb Weaver demi-hero (HNT005)", () => {
  it("a1: Graphene Chelicerae cost 1 less to activate while Orb Weaver is in arena", () => {
    const abilities = arakniOrbWeaver.base.abilities;
    const a1 = abilities?.find(
      (a) => a.id === "hJDM6fWpRRf6jLqrW8KRr:reduceGrapheneCheliceraeCost",
    );
    if (!a1 || a1.kind !== "static" || a1.staticKind !== "continuous") {
      throw new Error("HNT005-a1 must remain a static continuous ability");
    }
    expect(a1.effect).toMatchObject({
      type: "modify-activation-cost",
      op: "subtract",
      amount: 1,
    });
  });

  it("a1 AAA: while Orb Weaver is functional, Graphene Chelicera activates for 0 resources", () => {
    const game = orbWeaverGame();
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(grapheneChelicera);

    expect(Arakni.resourcePoints()).toBe(0);
    expect(game.getState().decision).toBeNull();
    expect(game.getState().rulesStack).toHaveLength(1);
  });

  it("a1 boundary: without Orb Weaver, activation requires its printed 1 resource", () => {
    const game = orbWeaverGame({ source: false });
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(grapheneChelicera);

    expect(game.getState().decision).toMatchObject({
      kind: "payment",
      actorId: Arakni.id,
      amount: 1,
    });
  });

  it("a1 applies independently to both Graphene Chelicera instances", () => {
    const game = orbWeaverGame({ weapons: 2 });
    const Arakni = game.as(arakniMarionette);
    const chelicerae = [
      Arakni.cardIn("weapon1", grapheneChelicera),
      Arakni.cardIn("weapon2", grapheneChelicera),
    ];

    expect(chelicerae).toHaveLength(2);
    game.exec({
      move: "activate",
      actorId: Arakni.id,
      payload: { instanceId: chelicerae[0]!.instanceId },
    });
    game.helpers.resolveRestOfCombat();
    game.exec({
      move: "activate",
      actorId: Arakni.id,
      payload: { instanceId: chelicerae[1]!.instanceId },
    });

    expect(Arakni.resourcePoints()).toBe(0);
    expect(game.getState().decision).toBeNull();
    expect(game.getState().rulesStack).toHaveLength(1);
  });

  it("a1 remains deterministic across a persisted snapshot restore", () => {
    let game = orbWeaverGame();
    const beforeRestore = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(beforeRestore),
        createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
      ),
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(grapheneChelicera);

    expect(Arakni.resourcePoints()).toBe(0);
    expect(game.getState().decision).toBeNull();
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(19);
  });

  it("a1 ceases after a public effect removes Orb Weaver from the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [runicReclamation],
        arena: [arakniOrbWeaver],
        weapon1: [grapheneChelicera],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: theryonMagisterOfJustice,
        arena: [fabToken("lightning-flow")],
        resourcePoints: 2,
        deck: 8,
      },
      manual,
    );
    const Arakni = game.as(arakniMarionette);
    const Theryon = game.as(theryonMagisterOfJustice);
    const orbWeaver = Arakni.cardIn("arena", arakniOrbWeaver);

    // Runic Reclamation destroys Theryon's Lightning Flow. Theryon's public
    // trigger pays 2 and makes Arakni destroy a non-hero permanent they
    // control; Orb Weaver is the sole candidate in the permanent zone.
    Arakni.attackWith(runicReclamation);
    for (let safety = 0; safety < 48; safety += 1) {
      const state = game.getState();
      if (
        !state.combat?.open &&
        state.rulesStack.length === 0 &&
        !state.rulesProcess &&
        !state.decision
      )
        break;
      const decision = state.decision;
      if (decision?.kind === "boolean") {
        (decision.actorId === Arakni.id ? Arakni : Theryon).chooseBoolean(true);
        continue;
      }
      if (decision?.kind === "entity-target") {
        const targetId = decision.candidates.some(
          (candidate) => candidate.instanceId === orbWeaver.instanceId,
        )
          ? orbWeaver.instanceId
          : decision.candidates[0]!.instanceId;
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [targetId] },
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
            answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
          },
        });
        continue;
      }
      game.passBoth();
    }

    expect(Arakni.zone("graveyard")).toContain(arakniOrbWeaver.canonicalId);
    expect(() => Arakni.activate(grapheneChelicera)).toThrow(
      "The activation payment cannot be paid",
    );
  });

  it("a2: discarding an Assassin card activates successfully", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniOrbWeaver],
        hand: [biteRed],
        deck: 4,
        actionPoints: 1,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Weaver = game.as(arakniMarionette);
    const handBefore = Weaver.handCount();

    // Activate Orb Weaver's a2 ability — cost (discard Assassin) auto-resolves.
    Weaver.activate(arakniOrbWeaver);

    // The Assassin card should have been discarded from hand.
    expect(Weaver.handCount()).toBe(handBefore - 1);
  });

  it("a2: the second activation in the same turn is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniOrbWeaver],
        hand: [biteRed, biteRed],
        deck: 4,
        actionPoints: 1,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Weaver = game.as(arakniMarionette);

    // First activation succeeds.
    Weaver.activate(arakniOrbWeaver);

    // Second activation should be rejected — once per turn limit.
    expect(() => Weaver.activate(arakniOrbWeaver)).toThrow();
  });

  it("card loads into arena without errors", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniOrbWeaver],
        deck: 8,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(game.as(arakniMarionette).zone("arena")).toContain(arakniOrbWeaver.canonicalId);
  });
});
