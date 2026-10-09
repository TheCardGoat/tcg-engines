import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { sinistreStab } from "./sinistre-stab.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers e1xj8mqr2o-a2 */
describe("Sinistre Stab — inherited life penalty", () => {
  it("reduces only the host champion's life when the attack joins its lineage", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(sinistreStab, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [sinistreStab, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [sinistreStab],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const hero = p.card(champion),
      foe = q.card(champion),
      attack = p.card(sinistreStab, { zone: "hand" });
    const life = (id: typeof hero.objectId) =>
      deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      });
    expect(life(hero.objectId)).toBe(15);
    p.activate(attack, {
      attackAttackerId: hero.objectId,
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    declareResolvedAttack(game, hero.objectId, foe.objectId, "Resolve Sinistre Stab");
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[attack.objectId]!.zone).toBe("inner-lineage");
    expect(game.state.objects[attack.objectId]!.hostId).toBe(hero.objectId);
    expect(life(hero.objectId)).toBe(12);
    expect(life(foe.objectId)).toBe(15);
    expect(game.state.objects[foe.objectId]!.damage).toBe(4);
  });
});
