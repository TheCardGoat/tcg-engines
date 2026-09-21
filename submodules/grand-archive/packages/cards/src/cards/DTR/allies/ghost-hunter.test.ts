import { ghostHunter } from "./ghost-hunter.ts";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { evercurrentRaider } from "./evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { describe, it, expect } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers lgl8pux7v9-a1 */
describe("ghost-hunter — Ranged combat", () => {
  proveRangedAlly({ card: ghostHunter, power: 1, ranged: 2, classBonus: false });
});

/** @covers lgl8pux7v9-a2 */
describe("Ghost Hunter — attacking ephemeral allies", () => {
  for (const mode of ["ephemeral", "normal", "champion", "retaliation"] as const)
    it(`applies its bonus only while attacking an ephemeral ally (${mode})`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(ghostHunter, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [ghostHunter], "main-deck": [woodlandSquirrels] } },
        playerTwo: {
          champion,
          zones: {
            field: [evercurrentRaider],
            graveyard: [evercurrentRaider],
            hand: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hunter = p.card(ghostHunter),
        ephemeral = q.card(evercurrentRaider, { zone: "graveyard" });
      q.activate(ephemeral, {
        activationMethod: "ephemerate",
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[hunter.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(power()).toBe(1);
      if (mode === "retaliation") {
        q.declareAttack(ephemeral, hunter);
        expect(power()).toBe(1);
        for (let i = 0; game.state.combat && i < 64; i++) {
          if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", [hunter.objectId]);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.objects[ephemeral.objectId]!.damage).toBe(1);
        expect(game.state.objects[ephemeral.objectId]!.zone).toBe("field");
      } else {
        advanceToMain(game, p.id);
        const target =
          mode === "champion"
            ? q.card(champion)
            : mode === "ephemeral"
              ? ephemeral
              : q
                  .cards(evercurrentRaider, { zone: "field" })
                  .find((c) => c.objectId !== ephemeral.objectId)!;
        p.declareAttack(hunter, target);
        expect(power()).toBe(mode === "ephemeral" ? 4 : 1);
        game.resolveCombatWithoutRetaliation();
        if (mode === "ephemeral")
          expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        else expect(game.state.objects[target.objectId]!.damage).toBe(1);
      }
      expect(game.state.combat).toBeNull();
      expect(power()).toBe(1);
    });
});
