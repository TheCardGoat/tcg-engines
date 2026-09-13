import { describe, expect, it } from "vitest";

import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { goldkissRum } from "../../../cards/src/cards/tokens/goldkiss-rum.ts";
import { clapEmInIronsBlue } from "../../../cards/src/cards/actions/clap-em-in-irons.ts";
import { morayLeFayYellow } from "../../../cards/src/cards/actions/moray-le-fay.ts";
import { wailerHumperdinckYellow } from "../../../cards/src/cards/actions/wailer-humperdinck.ts";
import { gravyBones } from "../../../cards/src/cards/heroes/gravy-bones.ts";
import { turnHeadsBlue } from "../../../cards/src/cards/instants/turn-heads.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { kayo } from "../../../cards/src/cards/heroes/kayo.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import type { FabMatchState } from "../state.ts";
import type { ProposedEvent } from "./events.ts";
import { reduceFabGameEvent } from "../kernel/event-reducer.ts";
import { snapshotObject } from "./snapshots.ts";
import { commitProposedEventBatch } from "../kernel/transaction-kernel.ts";

function setTappedProposal(
  state: FabMatchState,
  instanceId: string,
  playerId: string,
  tapped: boolean,
): ProposedEvent<"set-tapped"> {
  const zone = state.containers.zonesByPlayerId[playerId]!.heroZone.includes(instanceId)
    ? "heroZone"
    : "arena";
  const object = snapshotObject(state, instanceId, playerId, zone);
  return {
    name: "set-tapped",
    processId: "process-1",
    cause: { kind: "rule", rule: "alternate-untap-producer", controllerId: playerId },
    controllerId: playerId,
    source: null,
    affected: [object],
    bindings: {},
    data: { object, tapped },
  };
}

function isTapped(state: FabMatchState, instanceId: string): boolean {
  return state.objects[instanceId]!.markers.some((marker) => marker.kind === "tapped");
}

describe("authoritative untap transition", () => {
  it("rejects an alternate set-tapped producer at the reducer while Goldkiss restricts untap", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [goldkissRum], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();

    const state = game.getState();
    const heroId = Bravo.ref(bravo).instanceId;
    expect(isTapped(state, heroId)).toBe(true);

    const result = commitProposedEventBatch(
      state,
      [setTappedProposal(state, heroId, Bravo.id, false)],
      reduceFabGameEvent,
    );

    expect(result.batch).toBeNull();
    expect(isTapped(result.state, heroId)).toBe(true);
  });

  it("rejects a stale object snapshot instead of untapping a replacement incarnation", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "stale-untap",
      player1Id: "p1",
      player2Id: "p2",
      heroes: { p1: bravo.canonicalId, p2: dash.canonicalId },
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
      cardDefinitions: {
        [bravo.canonicalId]: bravo,
        [dash.canonicalId]: dash,
      },
    });
    const heroId = state.containers.zonesByPlayerId.p1!.heroZone[0]!;
    state.objects[heroId] = { ...state.objects[heroId]!, markers: [{ kind: "tapped" }] };
    const stale = setTappedProposal(state, heroId, "p1", false);
    state.objects[heroId] = {
      ...state.objects[heroId]!,
      incarnation: stale.data.object.ref.incarnation + 1,
    };

    const result = commitProposedEventBatch(state, [stale], reduceFabGameEvent);

    expect(result.batch).toBeNull();
    expect(isTapped(result.state, heroId)).toBe(true);
  });

  it("Clap 'Em in Irons binds the declared Pirate exactly across snapshot restore", () => {
    let game = FabTestEngine.start(
      { hero: bravo, hand: [clapEmInIronsBlue], deck: 4 },
      { hero: gravyBones, arena: [morayLeFayYellow, wailerHumperdinckYellow], deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    let Bravo = game.as(bravo);
    let Gravy = game.as(gravyBones);
    const selected = Gravy.cardIn("arena", morayLeFayYellow);
    const other = Gravy.cardIn("arena", wailerHumperdinckYellow);

    Bravo.play(clapEmInIronsBlue);
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(selected);
    game.helpers.resolveUntilIdle();
    const snapshot = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(snapshot),
        createFabMatchContext(snapshot.cardDefinitions, snapshot.publicCardIdentities),
      ),
    );
    Bravo = game.as(bravo);
    Gravy = game.as(gravyBones);

    expect(isTapped(game.getState(), selected.instanceId)).toBe(true);
    expect(isTapped(game.getState(), other.instanceId)).toBe(false);
    const selectedUntap = commitProposedEventBatch(
      game.getState(),
      [setTappedProposal(game.getState(), selected.instanceId, Gravy.id, false)],
      reduceFabGameEvent,
    );
    expect(selectedUntap.batch).toBeNull();
    expect(isTapped(selectedUntap.state, selected.instanceId)).toBe(true);

    const tappedOther = commitProposedEventBatch(
      game.getState(),
      [setTappedProposal(game.getState(), other.instanceId, Gravy.id, true)],
      reduceFabGameEvent,
    );
    const untappedOther = commitProposedEventBatch(
      tappedOther.state,
      [setTappedProposal(tappedOther.state, other.instanceId, Gravy.id, false)],
      reduceFabGameEvent,
    );
    expect(isTapped(untappedOther.state, other.instanceId)).toBe(false);
    expect(Bravo.zone("arena")).toContain(clapEmInIronsBlue.canonicalId);

    const reincarnated = structuredClone(game.getState());
    reincarnated.objects[selected.instanceId] = {
      ...reincarnated.objects[selected.instanceId]!,
      incarnation: reincarnated.objects[selected.instanceId]!.incarnation + 1,
    };
    const reincarnatedUntap = commitProposedEventBatch(
      reincarnated,
      [setTappedProposal(reincarnated, selected.instanceId, Gravy.id, false)],
      reduceFabGameEvent,
    );
    expect(isTapped(reincarnatedUntap.state, selected.instanceId)).toBe(false);
  });

  it("Turn Heads binds and restricts only its declared Brute hero", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, arena: [turnHeadsBlue], deck: 4 },
      { hero: kayo, deck: 4 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Kayo = game.as(kayo);

    // Suspense 2: two controller end phases make Turn Heads leave the arena.
    Rhinar.endTurn();
    game.helpers.resolveUntilIdle();
    Kayo.endTurn();
    game.helpers.resolveUntilIdle();
    if (game.getState().decision?.continuation.kind === "turn-arsenal") {
      Kayo.target();
    }
    Rhinar.endTurn();
    const arsenalChoice = game.advanceToDecision(Kayo, "entity-target");
    expect(arsenalChoice.continuation.kind).toBe("turn-arsenal");
    Kayo.target();
    game.advanceToDecision(Rhinar, "entity-target");
    Rhinar.chooseTargets(Kayo.ref(kayo));
    game.helpers.resolveUntilIdle();

    const state = game.getState();
    const chosenId = Kayo.ref(kayo).instanceId;
    const otherId = Rhinar.ref(rhinar).instanceId;
    expect(isTapped(state, chosenId)).toBe(true);
    expect(isTapped(state, otherId)).toBe(false);

    const chosenUntap = commitProposedEventBatch(
      state,
      [setTappedProposal(state, chosenId, Kayo.id, false)],
      reduceFabGameEvent,
    );
    expect(chosenUntap.batch).toBeNull();
    expect(isTapped(chosenUntap.state, chosenId)).toBe(true);

    const tappedOther = commitProposedEventBatch(
      state,
      [setTappedProposal(state, otherId, Rhinar.id, true)],
      reduceFabGameEvent,
    );
    const untappedOther = commitProposedEventBatch(
      tappedOther.state,
      [setTappedProposal(tappedOther.state, otherId, Rhinar.id, false)],
      reduceFabGameEvent,
    );
    expect(isTapped(untappedOther.state, otherId)).toBe(false);
  });
});
