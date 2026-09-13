import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipCruiser } from "../allies/airship-cruiser.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { potionInfusionFrostbite } from "./potion-infusion-frostbite.ts";

/** @covers mxz1vdxi74-a1 */
describe("Potion Infusion: Frostbite — granted sacrifice trigger", () => {
  it("rests the chosen unit and adds four to only its next Water-source damage", () => {
    const champion = createClassBonusTestChampion(
      potionInfusionFrostbite,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [potionInfusionFrostbite, woodlandSquirrels],
          field: [potionOfHealing, airshipCruiser, airshipCruiser],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const potion = player.card(potionOfHealing, { zone: "field" });
    const target = opponent.card(champion, { zone: "field" });
    player.activate(potionInfusionFrostbite, {
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
      targets: { "target-potion": [potion.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.states.has("rested")).toBe(true);

    player.activateAbility(potion, "qtb31x97n2-a2");
    expect(game.state.decision?.kind).toBe("announce-triggered-ability");
    answerDecision(game, "announce-triggered-ability", {
      targets: { "frostbitten-unit": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);

    const attackers = player.cards(airshipCruiser, { zone: "field" });
    player.declareAttack(attackers[0]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(5);
    player.declareAttack(attackers[1]!, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(6);
  });
});
