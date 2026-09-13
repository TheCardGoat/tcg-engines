import { describe, expect, it } from "vite-plus/test";
import { authorityOfAtayaBlue } from "../../cards/src/cards/resources/authority-of-ataya.ts";
import { potionOfDJVuBlue } from "../../cards/src/cards/actions/potion-of-d-j-vu.ts";
import { nimbleStrikeRed } from "../../cards/src/cards/actions/nimble-strike.ts";
import { denyRedemptionRed } from "../../cards/src/cards/actions/deny-redemption.ts";
import { mutatedMassBlue } from "../../cards/src/cards/actions/mutated-mass.ts";
import { skybodyKeikoi } from "../../cards/src/cards/equipment/skybody-keikoi.ts";
import { bravo } from "../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../cards/src/cards/heroes/dash.ts";
import { enigma } from "../../cards/src/cards/heroes/enigma.ts";
import { FabTestEngine } from "./testing/test-engine.ts";
import { projectFabViewerResources } from "./view.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "./index.ts";

// Projection contract: public effect provenance survives private-zone movement;
// it must not disclose the current identity/location of a hidden physical card.
describe("viewer effect disclosure", () => {
  it("does not advertise a hidden Mutated Mass through its property-static effects", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [mutatedMassBlue], pitch: [nimbleStrikeRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const owner = { role: "player", actorId: game.as(bravo).id } as const;
    expect(game.getView(owner).effects).toContainEqual(
      expect.objectContaining({ source: expect.objectContaining({ name: "Mutated Mass" }) }),
    );
    for (const viewer of [
      { role: "player", actorId: game.as(dash).id },
      { role: "spectator" },
    ] as const) {
      expect(game.getView(viewer).effects).toEqual([]);
      expect(projectFabViewerResources(game.getState(), viewer).cardDefinitions).not.toHaveProperty(
        mutatedMassBlue.canonicalId,
      );
    }
  });

  function pitchAuthority() {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, authorityOfAtayaBlue],
        arena: [potionOfDJVuBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    game.as(bravo).must.pitch(authorityOfAtayaBlue).playAttack(nimbleStrikeRed);
    game.toReaction();
    return game;
  }

  it("names a pitched Authority of Ataya for both players and spectators", () => {
    const game = pitchAuthority();
    for (const viewer of [
      { role: "player", actorId: game.as(bravo).id },
      { role: "player", actorId: game.as(dash).id },
      { role: "spectator" },
    ] as const) {
      const view = game.getView(viewer);
      expect(view.effects).toContainEqual(
        expect.objectContaining({
          source: expect.objectContaining({
            canonicalId: authorityOfAtayaBlue.canonicalId,
            name: expect.stringMatching(/^Authority of Ataya$/i),
          }),
          impacts: expect.arrayContaining([
            expect.objectContaining({ kind: "numeric", property: "cost", amount: 1 }),
          ]),
        }),
      );
    }
  });

  it("recognizes a currently public source even when its stored snapshot was private", () => {
    const snapshot = pitchAuthority().getState();
    // Reproduce an already-persisted pre-fix snapshot through the public restore
    // boundary. Current public knowledge must override stale private provenance.
    const game = FabTestEngine.fromState({
      ...snapshot,
      continuousEffectInstances: snapshot.continuousEffectInstances.map((effect) => ({
        ...effect,
        source: { ...effect.source, visibility: "private" },
      })),
    });
    const effect = game
      .getView({ role: "spectator" })
      .effects.find(
        (candidate) => candidate.source.canonicalId === authorityOfAtayaBlue.canonicalId,
      );
    expect(effect?.source.name).toMatch(/^Authority of Ataya$/i);
    expect(effect?.source.instanceId).toBeTruthy();
  });

  it("keeps the known effect after Potion of Deja Vu hides its source, without a physical-card link", () => {
    let game = pitchAuthority();
    game.closeCombat();
    game.as(bravo).activate(potionOfDJVuBlue);
    game.untilIdle();

    const snapshot = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(snapshot),
        createFabMatchContext(snapshot.cardDefinitions, snapshot.publicCardIdentities),
      ),
    );

    for (const viewer of [
      { role: "player", actorId: game.as(bravo).id },
      { role: "player", actorId: game.as(dash).id },
      { role: "spectator" },
    ] as const) {
      const view = game.getView(viewer);
      expect(view.players[game.as(bravo).id]?.zones.pitch).toEqual([]);
      const effect = view.effects.find(
        (candidate) => candidate.source.canonicalId === authorityOfAtayaBlue.canonicalId,
      );
      expect(effect?.source).toEqual({
        instanceId: null,
        canonicalId: authorityOfAtayaBlue.canonicalId,
        name: expect.stringMatching(/^Authority of Ataya$/i),
      });
      const resources = projectFabViewerResources(game.getState(), viewer);
      expect(Object.values(resources.cardInstances)).not.toContain(
        authorityOfAtayaBlue.canonicalId,
      );
      expect(resources.cardDefinitions[authorityOfAtayaBlue.canonicalId]?.canonicalId).toBe(
        authorityOfAtayaBlue.canonicalId,
      );
    }
  });

  it("reveals a hand activation's lasting rule effect only after it is activated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [denyRedemptionRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const viewer = { role: "player", actorId: game.as(dash).id } as const;
    expect(game.getView(viewer).effects).toEqual([]);
    game.as(bravo).activate(denyRedemptionRed);
    game.untilIdle();
    expect(game.getView(viewer).effects).toContainEqual(
      expect.objectContaining({
        source: expect.objectContaining({ name: "Deny Redemption" }),
        impacts: expect.arrayContaining([
          expect.objectContaining({ kind: "rule", action: "gain-life", mode: "restrict" }),
        ]),
      }),
    );
  });

  it("discloses prevention from a cloaked source only after its public activation", () => {
    const game = FabTestEngine.start(
      { hero: enigma, chest: [skybodyKeikoi], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const viewer = { role: "player", actorId: game.as(dash).id } as const;
    expect(game.getView(viewer).effects).not.toContainEqual(
      expect.objectContaining({ origin: { kind: "replacement", subtype: "prevention" } }),
    );
    game.as(enigma).activate(skybodyKeikoi);
    game.untilIdle();
    expect(game.getView(viewer).effects).toContainEqual(
      expect.objectContaining({
        source: expect.objectContaining({ name: "Skybody Keikoi" }),
        origin: { kind: "replacement", subtype: "prevention" },
      }),
    );
  });
});
