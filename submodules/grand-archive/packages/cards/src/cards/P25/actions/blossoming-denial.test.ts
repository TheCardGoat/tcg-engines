import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { blossomingDenial } from "./blossoming-denial.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { flowerbud } from "../../HVN/tokens/flowerbud.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 1nnpbddblx-a2 */
describe("Blossoming Denial — optional target and payment", () => {
  for (const mode of ["no-target", "pay", "decline"] as const)
    it(`summons Flowerbuds even when ${mode}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(blossomingDenial, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        definitions: [flowerbud],
        playerOne: {
          champion,
          zones: {
            hand: [blossomingDenial, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: {
          champion,
          zones: { hand: Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      q.activate(source);
      const target = game.state.stack.find(
        (item) => item.kind === "card-activation" && item.cardId === source.objectId,
      )!;
      q.pass();
      p.activate(blossomingDenial, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        targets: { "target-stack-item": mode === "no-target" ? [] : [target.id] },
      });
      passEffectsStack(game);
      if (mode !== "no-target") {
        expect(game.state.decision?.kind).toBe("resolve-effect-payment");
        expect(game.state.decision?.playerId).toBe(q.id);
        expect(q.cards(flowerbud, { zone: "field" })).toHaveLength(0);
        answerDecision(
          game,
          "resolve-effect-payment",
          mode === "pay"
            ? {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .map((ref) => ({ kind: "card", cardId: ref.objectId })),
              }
            : false,
        );
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[source.objectId]!.zone).toBe(
        mode === "decline" ? "graveyard" : "field",
      );
      expect(q.zone("memory")).toHaveLength(mode === "pay" ? 3 : 0);
      expect(p.cards(flowerbud, { zone: "field" })).toHaveLength(0);
      const tokens = q.cards(flowerbud, { zone: "field" });
      expect(tokens).toHaveLength(2);
      for (const token of tokens)
        expect(game.state.objects[token.objectId]).toMatchObject({
          controllerId: q.id,
          ownerId: q.id,
          isToken: true,
        });
      expect(p.cards(blossomingDenial, { zone: "graveyard" })).toHaveLength(1);
    });
});
