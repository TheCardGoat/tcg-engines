/** AHA027 Flurry — the triggering weapon activation is use one of a total two. */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "../../index.ts";
import { isFabMatchSnapshotV21, serializeFabMatchSnapshot } from "../../snapshot/match-context.ts";
import { projectFabViewerResources } from "../../view.ts";
import { flurry } from "../../../../cards/src/cards/tokens/flurry.ts";
import { zenithBlade } from "../../../../cards/src/cards/weapons/zenith-blade.ts";
import { halaBladesaintOfTheVow } from "../../../../cards/src/cards/heroes/hala-bladesaint-of-the-vow.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";

describe("Flurry token (AHA027)", () => {
  it("accepting sets the exact weapon ability total to two without untap, AP, or OPT reset", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        arena: [flurry],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.activate(zenithBlade);
    game.advanceToDecision(Hala, "boolean");
    expect(Hala.zone("arena")).not.toContain(flurry.canonicalId);
    expect(
      Object.values(game.getState().objects).some(
        (object) => object.canonicalId === flurry.canonicalId,
      ),
    ).toBe(false);
    const resolvingViewer = { role: "player" as const, actorId: Hala.id };
    expect(
      game
        .getView(resolvingViewer)
        .rulesStack.some((layer) => layer.sourceCanonicalId === flurry.canonicalId),
    ).toBe(true);
    expect(
      projectFabViewerResources(game.getState(), resolvingViewer).cardDefinitions,
    ).toHaveProperty(flurry.canonicalId);
    Hala.chooseBoolean(true);
    game.helpers.resolveRestOfCombat();

    expect(Hala.zone("arena")).not.toContain(flurry.canonicalId);
    expect(
      Object.values(game.getState().objects).some(
        (object) => object.canonicalId === flurry.canonicalId,
      ),
    ).toBe(false);
    expectFabPlayer(Hala).toHaveAP(1);
    expect(game.getState().activationLimitModifiers).toMatchObject([
      {
        generatedSequence: 1,
        operation: "set-total",
        count: 2,
        attackAbilityIds: ["D8JcCHRDPNWCRtgCMgbtp:oncePerTurnActionResourceAttack"],
      },
    ]);
    expect(isFabMatchSnapshotV21(serializeFabMatchSnapshot(game.getState()))).toBe(true);

    Hala.must.activate(zenithBlade);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Hala).toHaveAP(0);
    Hala.expectActivationRejected(zenithBlade, "activation_limit");

    Hala.must.endTurn();
    game.as(dash).must.endTurn();
    expect(game.getState().activationLimitModifiers).toEqual([]);
  });

  it("declining consumes the token but grants no second activation", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        arena: [flurry],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    Hala.must.activate(zenithBlade);
    game.advanceToDecision(Hala, "boolean");
    Hala.chooseBoolean(false);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().activationLimitModifiers).toEqual([]);
    expectFabPlayer(Hala).toHaveAP(1);
    Hala.expectActivationRejected(zenithBlade, "activation_limit");
  });
});
