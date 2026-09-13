/**
 * APR003 Halo of Lumina Light — Light Illusionist Head, Spellvoid 2, no defense.
 *
 * Printed:
 *   When this is destroyed, you may put a yellow aura from your banished zone
 *   into the arena.
 *   Spellvoid 2
 *
 * Model:
 *   static triggered on destroy → optional move-card yellow Aura banished → arena
 *   keywords: spellvoid(2); no defense
 *
 * Reasoning:
 * 1. "When this is destroyed" should be subject:self — without it the ability
 *    would fire when any object is destroyed under the controller's static
 *    listen path. Pin subject:self on the card if tests show false positives.
 * 2. Destroy path: Spellvoid 2 vs arcane (voltic bolt) — public production path
 *    that destroys the equipment and should open the optional banished→arena.
 * 3. Happy: yellow aura (v-for-valor-yellow) in banished → accept → arena.
 * 4. Decline optional / no yellow aura → banished stays put.
 * 5. Physical combat does not destroy spellvoid equipment (keyword edge).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, volticBoltRed } from "../../../fixtures.ts";
import { haloOfLuminaLight } from "../../../../../../cards/src/cards/equipment/halo-of-lumina-light.ts";
import { vForValorYellow } from "../../../../../../cards/src/cards/actions/v-for-valor.ts";

/** Play voltic bolt arcane; walk spellvoid + destroy optional. */
function dealArcaneAndResolve(
  game: ReturnType<typeof FabTestEngine.start>,
  acceptAura: boolean,
  auraCanonicalId?: string,
): void {
  const Bravo = game.as(bravo);
  Bravo.play(volticBoltRed, { target: game.as(dash).id });
  let auraOptionalSeen = false;
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length === 0) return;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
      // First boolean is typically spellvoid use; after destroy, aura optional.
      const value = !auraOptionalSeen ? true : acceptAura;
      if (auraOptionalSeen || decision.actorId === game.as(dash).id) {
        // After first accept, subsequent booleans for aura use acceptAura.
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value },
        },
      });
      if (auraOptionalSeen === false && value === true) {
        // May still be spellvoid; mark after equipment leaves head.
        if (!game.as(dash).zone("head").includes(haloOfLuminaLight.canonicalId)) {
          auraOptionalSeen = true;
        }
      }
      continue;
    }
    if (decision.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: decision.options.map((option) => option.id) },
        },
      });
      continue;
    }
    if (decision.kind === "entity-target") {
      if (!acceptAura && decision.min === 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
      const pick =
        (auraCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === auraCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    break;
  }
}

describe("halo-of-lumina-light (APR003)", () => {
  it("core mechanic: spellvoid destroy → optional yellow aura from banished enters arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        head: [haloOfLuminaLight],
        banished: [vForValorYellow],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("head")).toContain(haloOfLuminaLight.canonicalId);
    expect(Dash.zone("banished")).toContain(vForValorYellow.canonicalId);

    dealArcaneAndResolve(game, true, vForValorYellow.canonicalId);

    expect(Dash.zone("head")).not.toContain(haloOfLuminaLight.canonicalId);
    expect(Dash.zone("graveyard")).toContain(haloOfLuminaLight.canonicalId);
    // Yellow aura left banished and entered arena (permanent).
    expect(Dash.zone("banished")).not.toContain(vForValorYellow.canonicalId);
    expect(Dash.zone("arena")).toContain(vForValorYellow.canonicalId);
  });

  it("boundaries: physical attack does not destroy spellvoid equipment", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        head: [haloOfLuminaLight],
        banished: [vForValorYellow],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).zone("head")).toContain(haloOfLuminaLight.canonicalId);
    expect(game.as(dash).zone("banished")).toContain(vForValorYellow.canonicalId);
    expect(game.as(dash).zone("arena")).not.toContain(vForValorYellow.canonicalId);
  });

  it("boundaries: catalog destroy trigger observes the exact source object", () => {
    const ability = haloOfLuminaLight.base.abilities?.[0];
    expect(ability?.kind).toBe("static");
    if (ability?.kind !== "static" || ability.staticKind !== "triggered") return;
    expect(ability.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "destroy",
        observes: { kind: "source", selector: "moved-object" },
      },
    });
  });
});
