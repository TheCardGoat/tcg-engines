import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  FabTestEngine,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import { arakniMarionette } from "../../../../cards/src/cards/heroes/arakni-marionette.ts";
import { arakniTrapDoor } from "../../../../cards/src/cards/demi-heroes/arakni-trap-door.ts";
import { arakniBlackWidow } from "../../../../cards/src/cards/demi-heroes/arakni-black-widow.ts";
import { maskOfDeceit } from "../../../../cards/src/cards/equipment/mask-of-deceit.ts";
import { denOfTheSpiderRed } from "../../../../cards/src/cards/defense-reactions/den-of-the-spider.ts";
import { lairOfTheSpiderRed } from "../../../../cards/src/cards/defense-reactions/lair-of-the-spider.ts";
import { whittleFromBoneRed } from "../../../../cards/src/cards/actions/whittle-from-bone.ts";
import { hunterSKlaive } from "../../../../cards/src/cards/weapons/hunter-s-klaive.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { scourTheBattlescapeRed } from "../../../../cards/src/cards/actions/scour-the-battlescape.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";

describe("Arakni, Trap-Door (HNT008)", () => {
  it("becomes the inventory Agent, searches an exact Trap, hides it, persists, and expires", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [whittleFromBoneRed, whittleFromBoneRed, whittleFromBoneRed, whittleFromBoneRed],
        arsenal: [whittleFromBoneRed],
        inventory: [arakniTrapDoor],
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [denOfTheSpiderRed, whittleFromBoneRed, whittleFromBoneRed, whittleFromBoneRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);
    const heroId = game.getState().containers.zonesByPlayerId[Arakni.id]!.heroZone[0]!;

    Arakni.must.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[Dash.id]?.marked).toBe(true);
    Arakni.must.endTurn();
    game.passBoth();
    game.advanceToDecision(Arakni, "boolean");
    Arakni.chooseBoolean(true);
    game.advanceToDecision(Arakni, "entity-target");
    Arakni.chooseTargets(Arakni.cardIn("deck", denOfTheSpiderRed));
    game.helpers.resolveUntilIdle();

    expect(game.getState().containers.zonesByPlayerId[Arakni.id]!.heroZone[0]).toBe(heroId);
    expect(Arakni.zone("banished")).toContain(denOfTheSpiderRed.canonicalId);
    game.assertCardHiddenFrom(Dash, Arakni.cardIn("banished", denOfTheSpiderRed), Arakni);
    const permission = game
      .getState()
      .continuousEffectInstances.find((instance) =>
        instance.atoms.some((atom) => atom.kind === "rule" && atom.action === "play"),
      );
    expect(permission?.initialSubjects).toHaveLength(1);
    expect(game.committedEvents().filter((event) => event.name === "become")).toHaveLength(1);
    // The copied end-phase trigger was not functional when this end-phase
    // event was generated, so it cannot retroactively return to the brood.
    expect(
      game
        .getState()
        .continuousEffectInstances.some((instance) =>
          instance.atoms.some((atom) => atom.kind === "copy"),
        ),
    ).toBe(true);

    const snapshot = serializeFabMatchSnapshot(game.getState());
    expect(isFabMatchSnapshotV21(snapshot)).toBe(true);
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(game.getState().cardDefinitions, game.getState().publicCardIdentities),
    );
    expect(
      restored.continuousEffectInstances.some(
        (instance) => instance.effectId === permission?.effectId,
      ),
    ).toBe(true);

    const resumed = FabTestEngine.fromState(restored);
    resumed.as(dash).must.endTurn();
    expect(
      resumed
        .getState()
        .continuousEffectInstances.some((instance) => instance.effectId === permission?.effectId),
    ).toBe(false);
  });

  it("declining search still shuffles and creates no permission", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        inventory: [arakniTrapDoor],
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [denOfTheSpiderRed, whittleFromBoneRed],
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);
    Arakni.must.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();
    Arakni.must.endTurn();
    game.passBoth();
    game.advanceToDecision(Arakni, "boolean");
    Arakni.chooseBoolean(false);
    game.helpers.resolveUntilIdle();
    expect(Arakni.zone("banished")).toHaveLength(0);
    expect(
      game
        .getState()
        .continuousEffectInstances.filter((instance) =>
          instance.atoms.some((atom) => atom.kind === "rule" && atom.action === "play"),
        ),
    ).toHaveLength(0);
  });

  it("plays only the exact searched face-down Trap from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        inventory: [arakniTrapDoor],
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        banished: [{ card: lairOfTheSpiderRed, state: { faceDown: true } }],
        deck: [denOfTheSpiderRed, whittleFromBoneRed],
      },
      { hero: dash, hand: [scourTheBattlescapeRed], actionPoints: 1, deck: 0 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.must.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();
    Arakni.must.endTurn();
    game.passBoth();
    game.advanceToDecision(Arakni, "boolean");
    Arakni.chooseBoolean(true);
    game.advanceToDecision(Arakni, "entity-target");
    Arakni.chooseTargets(Arakni.cardIn("deck", denOfTheSpiderRed));
    game.helpers.resolveUntilIdle();

    Dash.must.playAttack(scourTheBattlescapeRed);
    game.advanceCombatTo("defend");
    Arakni.must.defend();
    game.advanceCombatTo("reaction");
    game.pass(Dash.id);
    const foreignTrap = Arakni.cardIn("banished", lairOfTheSpiderRed);
    expect(
      Arakni.expectFailure({
        move: "begin-play",
        payload: { instanceId: Arakni.ref(foreignTrap).instanceId },
      }).accepted,
    ).toBe(false);
    Arakni.play(denOfTheSpiderRed, { from: "banished" });
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "play" && event.source?.canonicalId === denOfTheSpiderRed.canonicalId,
        ),
    ).toBe(true);
  });

  it("Mask chooses an explicit frozen Agent while the attacking hero is marked", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [scourTheBattlescapeRed], marked: true, actionPoints: 1, deck: 4 },
      {
        hero: arakniMarionette,
        head: [maskOfDeceit],
        inventory: [arakniTrapDoor, arakniBlackWidow],
        deck: 4,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakniMarionette);
    const heroId = game.getState().containers.zonesByPlayerId[Arakni.id]!.heroZone[0]!;

    Dash.attackWith(scourTheBattlescapeRed);
    Arakni.defendWith(maskOfDeceit);
    game.advanceToDecision(Arakni, "entity-target");

    const decisionSnapshot = serializeFabMatchSnapshot(game.getState());
    expect(isFabMatchSnapshotV21(decisionSnapshot)).toBe(true);
    const selectedAgent = Arakni.cardIn("inventory", arakniBlackWidow);
    const selectedAgentId = Arakni.ref(selectedAgent).instanceId;
    Arakni.chooseTargets(selectedAgent);
    game.helpers.resolveUntilIdle();

    const copy = game
      .getState()
      .continuousEffectInstances.find((instance) =>
        instance.atoms.some((atom) => atom.kind === "copy"),
      );
    const atom = copy?.atoms.find((candidate) => candidate.kind === "copy");
    expect(atom?.frozenSource?.names).toContain("Arakni Black Widow");
    expect(game.getState().containers.zonesByPlayerId[Arakni.id]!.heroZone[0]).toBe(heroId);
    // CR 8.5.25c: the copy payload is frozen at generation. Moving the
    // inventory source later cannot alter or cease the hero's copied face.
    game.moveObject(selectedAgentId, Arakni.id, "graveyard");
    const heroRecord = game.getState().objects[heroId]!;
    expect(
      buildFabRulesView(game.getState()).object({
        instanceId: heroId,
        incarnation: heroRecord.incarnation,
      })?.current.names,
    ).toContain("Arakni Black Widow");
    // It did not subscribe retroactively to the defend event that generated
    // the copy. "Your end phase" is the controller's own end phase (Rules
    // Reprise #24), so Dash's end phase leaves the copy in place and the
    // copied Agent returns to the brood on Arakni's end phase.
    Dash.must.endTurn();
    game.helpers.resolveUntilIdle();
    expect(
      game
        .getState()
        .continuousEffectInstances.some((instance) => instance.effectId === copy?.effectId),
    ).toBe(true);
    Arakni.must.endTurn();
    game.helpers.resolveUntilIdle();
    expect(
      game
        .getState()
        .continuousEffectInstances.some((instance) => instance.effectId === copy?.effectId),
    ).toBe(false);
  });
});
