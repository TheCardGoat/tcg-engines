import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveCharacteristics } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { nullifyingLantern } from "./nullifying-lantern.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { recklessResearcher } from "../allies/reckless-researcher.ts";
import { fireball } from "../actions/fireball.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { spurnToAsh } from "../actions/spurn-to-ash.ts";
/** @covers urKxcUjz9a-a1 */
describe("Nullifying Lantern replaces both graveyards' elements while present", () => {
  for (const own of [false, true])
    it(`lantern controlled by activator=${own}`, () => {
      const champion = createClassBonusTestChampion(
          recklessResearcher,
          true,
          "activation-discount",
        ),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                recklessResearcher,
                recklessResearcher,
                spurnToAsh,
                fireball,
                ...Array.from({ length: 9 }, () => woodlandSquirrels),
              ],
              field: own ? [nullifyingLantern] : [],
              graveyard: [fireball, blitzMage, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: own ? [] : [nullifyingLantern], graveyard: [fireball] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        lantern = (own ? p : q).card(nullifyingLantern),
        ownFire = p.card(fireball, { zone: "graveyard" }),
        otherFire = q.card(fireball, { zone: "graveyard" }),
        heldFire = p.card(fireball, { zone: "hand" }),
        elements = (id: typeof lantern.objectId) =>
          deriveGrandArchiveCharacteristics(game.state.objects[id]!, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          }).elements,
        pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      expect(elements(ownFire.objectId)).toEqual(["NORM"]);
      expect(elements(otherFire.objectId)).toEqual(["NORM"]);
      expect(elements(heldFire.objectId)).toEqual(["FIRE"]);
      p.activate(p.cards(recklessResearcher, { zone: "hand" })[0]!, { reservePayment: pay(3) });
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
      expect(game.state.objects[ownFire.objectId]!.zone).toBe("graveyard");
      p.activate(spurnToAsh, {
        reservePayment: pay(3),
        targets: { "target-1": [lantern.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[lantern.objectId]!.zone).toBe("banishment");
      expect(elements(ownFire.objectId)).toEqual(["FIRE"]);
      expect(elements(otherFire.objectId)).toEqual(["FIRE"]);
      p.activate(p.card(recklessResearcher, { zone: "hand" }), { reservePayment: pay(3) });
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      answerDecision(game, "resolve-effect-choice", [ownFire.objectId]);
      answerDecision(game, "resolve-effect-choice", [q.card(champion).objectId]);
      passEffectsStack(game);
      expect(game.state.objects[ownFire.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
      expect(game.state.objects[otherFire.objectId]!.zone).toBe("graveyard");
    });
});
