import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sealedBladeDoa } from "../../DOA/weapons/sealed-blade-doa.ts";
import { deployGunshield } from "./deploy-gunshield.ts";
import { reposition } from "./reposition.ts";
import { calculatedForesight } from "./calculated-foresight.ts";

function championForForesight() {
  const champion = createClassBonusTestChampion(calculatedForesight, true, "activation-discount");
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...champion.layout.face, elements: ["WATER", "NORM"] as const },
    },
  };
}

function advanceToOwnMain(game: GrandArchiveTestEngine): void {
  advanceToRecollection(game, "player-two");
  advanceToRecollection(game, "player-one");
  for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}

/** @covers sl7dedg616-a1 */
describe("Calculated Foresight — mill, Floating Memory choice, and Ranged 3", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "banishes" : "keeps"} the newly milled Floating Memory card`, () => {
      const champion = championForForesight();
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [sealedBladeDoa],
            hand: [
              reposition,
              calculatedForesight,
              deployGunshield,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": [deployGunshield, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            graveyard: [deployGunshield],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ownChampion = player.card(champion, { zone: "field" });
      const weapon = player.card(sealedBladeDoa, { zone: "field" });
      const opponentChampion = opponent.card(champion, { zone: "field" });
      const payments = player.cards(woodlandSquirrels, { zone: "hand" });
      player.activate(reposition, {
        reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
        targets: { "target-1": [ownChampion.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[ownChampion.objectId]!.states.has("distant")).toBe(true);

      const deck = player.zone("main-deck");
      const graveyard = player.zone("graveyard");
      player.activate(calculatedForesight, {
        reservePayment: payments.slice(1).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      });
      passEffectsStack(game);
      expect(player.zone("graveyard")).toEqual([...graveyard, deck[0], deck[1]]);
      expect(game.state.decision?.kind).toBe("resolve-optional-effect");
      answerDecision(game, "resolve-optional-effect", accept);
      if (accept) {
        const selected = player.card(deployGunshield, { zone: "graveyard" });
        for (const invalid of [
          player.card(woodlandSquirrels, { zone: "graveyard" }),
          player.card(deployGunshield, { zone: "hand" }),
          opponent.card(deployGunshield, { zone: "graveyard" }),
        ]) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", [selected.objectId]);
      }
      passEffectsStack(game);

      if (!accept) {
        const before = game.state;
        expect(() => player.declareAttack(ownChampion, opponentChampion)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      expect(player.cards(deployGunshield, { zone: "banishment" })).toHaveLength(1);
      player.declareAttack(ownChampion, opponentChampion, { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(5);

      advanceToOwnMain(game);
      player.declareAttack(ownChampion, opponentChampion, { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(7);
    });
  }
});
