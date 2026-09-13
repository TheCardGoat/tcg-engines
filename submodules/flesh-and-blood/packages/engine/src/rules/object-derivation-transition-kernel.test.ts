import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, regurgitatingSlogRed } from "./fixtures.ts";
import { miragingMetamorphRed } from "../../../cards/src/cards/actions/miraging-metamorph.ts";
import { hazeBendingBlue } from "../../../cards/src/cards/actions/haze-bending.ts";
import { snapshotObject } from "./snapshots.ts";
import { commitProposedEventBatch } from "../kernel/transaction-kernel.ts";
import { reduceFabGameEvent } from "../kernel/event-reducer.ts";
import type { ProposedEvent } from "./events.ts";

describe("object derivation and transition kernel", () => {
  it("creates an intrinsic token from the selected aura's frozen stage-1 properties", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [miragingMetamorphRed],
        arena: [hazeBendingBlue],
        deck: 6,
        resourcePoints: 1,
      },
      { hero: dash, hand: [regurgitatingSlogRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const source = Bravo.cardIn("arena", hazeBendingBlue);
    const sourceIncarnation = game.getState().objects[source.instanceId]!.incarnation;

    Bravo.play(miragingMetamorphRed, { target: Dash.id });
    game.passBoth();
    game.passBoth();
    Dash.blockWith(regurgitatingSlogRed);
    game.passBoth();
    // The only aura is determined (CR 1.8.6c).
    game.helpers.resolveUntilIdle();

    const copy = Object.values(game.getState().objects).find(
      (object) =>
        object.objectKind === "created-token" &&
        object.baseSource.kind === "frozen-copy" &&
        object.baseSource.source.instanceId === source.instanceId,
    );
    expect(copy).toBeDefined();
    expect(copy?.baseSource.kind).toBe("frozen-copy");
    if (copy?.baseSource.kind !== "frozen-copy") return;
    expect(copy.baseSource.copyable.names).toEqual(["Haze Bending"]);
    expect(copy.baseSource.source).toMatchObject({
      instanceId: source.instanceId,
      incarnation: sourceIncarnation,
      canonicalId: hazeBendingBlue.canonicalId,
    });
    expect(Bravo.zone("arena")).toContain(hazeBendingBlue.canonicalId);
    expect(Bravo.zone("arena").filter((id) => id === hazeBendingBlue.canonicalId)).toHaveLength(2);

    const copiedToken = snapshotObject(game.getState(), copy.instanceId, Bravo.id, "arena");
    const destroy: ProposedEvent<"destroy"> = {
      name: "destroy",
      processId: "process-999",
      cause: { kind: "rule", rule: "object-kind-lifecycle", controllerId: Bravo.id },
      bindings: {},
      controllerId: Bravo.id,
      source: copiedToken,
      affected: [copiedToken],
      data: {
        object: copiedToken,
        destinationRef: null,
        from: "arena",
        to: "graveyard",
        reason: "destroy",
      },
    };
    const ceased = commitProposedEventBatch(game.getState(), [destroy], reduceFabGameEvent);
    expect(ceased.batch?.events.map((event) => event.name)).toEqual([
      "destroy",
      "leave-arena",
      "enter-or-leave-arena",
    ]);
    expect(ceased.state.objects[copy.instanceId]).toBeUndefined();
    expect(ceased.state.containers.zonesByPlayerId[Bravo.id]!.graveyard).not.toContain(
      copy.instanceId,
    );
  });
});
