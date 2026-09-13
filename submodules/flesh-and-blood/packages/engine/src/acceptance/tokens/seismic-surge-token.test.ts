/** WTR075 Seismic Surge — Guardian token aura: self-destructs at action phase. */
import { describe, expect, it } from "vitest";
import { seismicSurge } from "../../../../cards/src/cards/tokens/seismic-surge.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { projectFabViewerState } from "../../view.ts";

describe("Seismic Surge token (WTR075)", () => {
  it("AAA: self-destructs at controller's action phase start", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [seismicSurge], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expect(Bravo.zone("arena")).toContain(seismicSurge.canonicalId);

    Bravo.endTurn();
    Dash.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(seismicSurge.canonicalId);
    expect(game.getView({ role: "player", actorId: Bravo.id }).effects).toContainEqual(
      expect.objectContaining({
        controllerId: Bravo.id,
        source: expect.objectContaining({ name: "Seismic Surge" }),
        origin: { kind: "continuous", source: "layer" },
        status: "armed",
        remainingUses: 1,
        scopes: expect.arrayContaining([{ kind: "future-object", playerId: Bravo.id }]),
        impacts: expect.arrayContaining([
          expect.objectContaining({
            kind: "numeric",
            property: "cost",
            operation: "subtract",
            amount: 1,
          }),
        ]),
      }),
    );

    const state = game.getState();
    const discount = state.continuousEffectInstances[0]!;
    const privateSourceState = {
      ...state,
      continuousEffectInstances: [
        {
          ...discount,
          source: { ...discount.source, visibility: "private" as const },
        },
      ],
    };
    expect(
      projectFabViewerState(privateSourceState, { role: "player", actorId: Dash.id }).effects,
    ).toEqual([]);
    expect(
      projectFabViewerState(privateSourceState, { role: "player", actorId: Bravo.id }).effects[0]
        ?.source.name,
    ).toBe("Seismic Surge");
  });
});
