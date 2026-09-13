import { describe, expect, it } from "vitest";
import { bravo } from "../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../cards/src/cards/heroes/dash.ts";
import { fyendalSSpringTunic } from "../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { FabTestEngine } from "./testing/test-engine.ts";
import { FabMatchRuntime } from "./runtime.ts";
import { compileFabMatchProgram } from "./match-program.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "./snapshot/match-context.ts";

describe("runtime match program ownership", () => {
  it("does not reuse stale definitions when a borrowed registry changes", () => {
    const definitions = { [bravo.canonicalId]: bravo };
    const identities = [
      { canonicalId: bravo.canonicalId, names: ["Bravo"] },
      { canonicalId: dash.canonicalId, names: ["Dash"] },
    ];
    const first = compileFabMatchProgram(definitions, identities);

    definitions[dash.canonicalId] = dash;
    const second = compileFabMatchProgram(definitions, identities);

    expect(first.cardDefinitions[dash.canonicalId]).toBeUndefined();
    expect(second.cardDefinitions[dash.canonicalId]?.base).toEqual(dash.base);
    expect(second.fingerprint).not.toBe(first.fingerprint);
    expect(compileFabMatchProgram(first.cardDefinitions, first.publicCardIdentities)).toBe(first);
  });

  it("reuses the frozen program across restore and pass while detaching mutable match state", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [fyendalSSpringTunic], hand: [], deck: [] },
      { hero: dash, hand: [], deck: [] },
    );
    const source = game.getRuntime().cloneState();
    const context = createFabMatchContext(source.cardDefinitions, source.publicCardIdentities);
    const persisted = serializeFabMatchSnapshot(source);
    const restored = restoreFabMatchSnapshot(persisted, context);
    const runtime = new FabMatchRuntime(restored);
    const actorId = runtime.getPriorityPlayerId()!;
    const lifeBefore = runtime.getState().players[actorId]!.life;

    restored.players[actorId]!.life = 1;
    expect(runtime.getState().players[actorId]!.life).toBe(lifeBefore);
    expect(runtime.getState().cardDefinitions).toBe(context.program.cardDefinitions);
    expect(runtime.getState().publicCardIdentities).toBe(context.program.publicCardIdentities);
    expect(
      Object.isFrozen(
        runtime.getState().cardDefinitions[fyendalSSpringTunic.canonicalId]!.base.abilities,
      ),
    ).toBe(true);

    const result = runtime.applyCommand(actorId, { move: "pass" });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(runtime.getPriorityPlayerId()).not.toBe(actorId);
    expect(result.stateID).toBe(persisted.stateID + 1);
    expect(result.snapshot.programFingerprint).toBe(context.program.fingerprint);
    expect(
      compileFabMatchProgram(result.state.cardDefinitions, result.state.publicCardIdentities),
    ).toBe(context.program);
    expect(persisted.priority?.holderPlayerId).toBe(actorId);
    expect(persisted.players[actorId]!.life).toBe(lifeBefore);
    expect(restoreFabMatchSnapshot(result.snapshot, context).priority).toEqual(
      result.state.priority,
    );

    const rejected = runtime.applyCommand(actorId, { move: "pass" });
    expect(rejected.success).toBe(false);
    expect(runtime.snapshot()).toEqual(result.snapshot);
  });
});
