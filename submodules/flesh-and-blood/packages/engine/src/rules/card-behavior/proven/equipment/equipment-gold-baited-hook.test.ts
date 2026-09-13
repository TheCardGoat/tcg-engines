/**
 * SEA125 Gold-Baited Hook — Pirate Arms d1 Battleworn.
 *
 * Action - {t}: The next Pirate attack this turn steals an opposing Gold on
 * hit, or creates one when none is available. At the controller's end phase,
 * the Hook destroys itself unless its controller has created or stolen Gold.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";
import { rustyHarpoonBlue } from "../../../../../../cards/src/cards/actions/rusty-harpoon.ts";
import { goldBaitedHook } from "../../../../../../cards/src/cards/equipment/gold-baited-hook.ts";
import { scurvStowaway } from "../../../../../../cards/src/cards/heroes/scurv-stowaway.ts";
import { hammerheadHarpoonCannon } from "../../../../../../cards/src/cards/weapons/hammerhead-harpoon-cannon.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const target = decision.candidates[0];
      if (!target) throw new Error("Gold Baited Hook should have a Gold target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [target.instanceId] },
        },
      });
      continue;
    }
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
    if (decision && game.answerForcedDecision()) continue;
    if (decision) throw new Error(`Unhandled ${decision.kind} decision`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const priorityPlayerId = game.getPriorityPlayerId();
    if (!priorityPlayerId) return;
    game.exec({ move: "pass", actorId: priorityPlayerId, payload: {} });
  }
  throw new Error("Gold Baited Hook resolution did not settle");
}

function activateAndHit(
  game: ReturnType<typeof FabTestEngine.start>,
  attacker: ReturnType<typeof game.as>,
): void {
  attacker.activate(goldBaitedHook);
  drain(game);
  // CR 8.2.6a: Rusty Harpoon is an Arrow — play from arsenal with a bow
  // (Hammerhead Harpoon Cannon) equipped. Scurv is a Pirate, not a Ranger, so
  // it has no arrow-play authority; the baseline arsenal+bow gates bind.
  attacker.attackWith(rustyHarpoonBlue, { from: "arsenal" });
  drain(game);
}

describe("gold-baited-hook (SEA125)", () => {
  it("AAA: its next Pirate attack steals an opposing real Gold token and preserves Hook", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        arms: [goldBaitedHook],
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, arena: [gold], deck: 6 },
      { autoPassPriority: false },
    );
    const Scurv = game.as(scurvStowaway);
    const Dash = game.as(dash);

    activateAndHit(game, Scurv);

    expect(Dash.zone("arena")).not.toContain(gold.canonicalId);
    expect(Scurv.zone("arena")).toContain(gold.canonicalId);
    Scurv.endTurn();
    drain(game);
    expect(Scurv.zone("arms")).toContain(goldBaitedHook.canonicalId);
  });

  it("AAA: its next Pirate attack creates Gold when no opposing Gold can be stolen", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        arms: [goldBaitedHook],
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Scurv = game.as(scurvStowaway);

    activateAndHit(game, Scurv);

    expect(Scurv.zone("arena")).toEqual(["token:gold"]);
    Scurv.endTurn();
    drain(game);
    expect(Scurv.zone("arms")).toContain(goldBaitedHook.canonicalId);
  });

  it("boundary: it destroys itself at its controller's end phase without Gold", () => {
    const game = FabTestEngine.start(
      { hero: scurvStowaway, arms: [goldBaitedHook], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.activate(goldBaitedHook);
    drain(game);
    Scurv.endTurn();
    drain(game);

    expect(Scurv.zone("arms")).not.toContain(goldBaitedHook.canonicalId);
    expect(Scurv.zone("graveyard")).toContain(goldBaitedHook.canonicalId);
  });

  it("boundary: a tapped Hook cannot be activated twice", () => {
    const game = FabTestEngine.start(
      { hero: scurvStowaway, arms: [goldBaitedHook], actionPoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.activate(goldBaitedHook);
    drain(game);

    expect(() => Scurv.activate(goldBaitedHook)).toThrow();
  });
});
