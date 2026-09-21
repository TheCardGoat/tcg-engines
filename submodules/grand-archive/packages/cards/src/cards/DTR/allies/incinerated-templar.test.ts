import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { incineratedTemplar } from "./incinerated-templar.ts";
import { evercurrentRaider } from "./evercurrent-raider.ts";
import { flameboundDraug } from "./flamebound-draug.ts";
import { bandersnatchFrumiousFoe } from "../../PTM/allies/bandersnatch-frumious-foe.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 26ya6zaae8-a1 */
describe("Incinerated Templar — restricted revival and delayed sacrifice", () => {
  for (const matching of [false, true])
    for (const revived of [evercurrentRaider, flameboundDraug]) {
      it(`revives ${revived.slug} only with Class Bonus and sacrifices at its controller's next end phase (${matching})`, () => {
        const champion = createClassBonusTestChampion(
          incineratedTemplar,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [incineratedTemplar, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [revived, bandersnatchFrumiousFoe, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { graveyard: [revived], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const target = p.card(revived, { zone: "graveyard" });
        p.activate(incineratedTemplar, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        if (!matching) {
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          return;
        }
        const before = game.state;
        for (const invalid of [
          q.card(revived),
          p.card(bandersnatchFrumiousFoe),
          p.card(woodlandSquirrels, { zone: "graveyard" }),
          p.card(incineratedTemplar),
        ]) {
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-specter": [invalid.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-specter": [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        expect(game.state.objects[target.objectId]!.states.has("ephemeral")).toBe(true);
        expect(q.cards(revived, { zone: "graveyard" })).toHaveLength(1);
        for (let step = 0; step < 32 && !game.state.stack.length; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("end");
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        expect(p.cards(incineratedTemplar, { zone: "field" })).toHaveLength(1);
        advanceToMain(game, q.id);
        expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
      });
    }
});
