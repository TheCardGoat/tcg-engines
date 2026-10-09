import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { illuminateSecrets } from "./illuminate-secrets.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 0ymvddv1au-a1 */
describe("Illuminate Secrets", () => {
  for (const opponentInfluence of [0, 4, 7])
    for (const response of [false, true])
      for (const owner of ["player-one", "player-two"])
        for (const kind of ["ally", "champion"])
          it(`uses resolution influence ${opponentInfluence}, response=${response}, ${owner}'s ${kind}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(illuminateSecrets, false, "activation-discount"),
            );
            const copies = (n: number) => Array.from({ length: n }, () => woodlandSquirrels);
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [illuminateSecrets, favorableWinds, ...copies(3)],
                  field: [giantTortoise],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: copies(Math.floor(opponentInfluence / 2)),
                  memory: copies(Math.ceil(opponentInfluence / 2)),
                  field: [giantTortoise],
                  graveyard: copies(3),
                },
              },
            });
            const p = game.player("player-one");
            const target = game.player(owner).card(kind === "ally" ? giantTortoise : champion);
            const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
            p.activate(illuminateSecrets, {
              reservePayment: payment.slice(0, 2),
              targets: { "target-1": [target.objectId] },
            });
            if (response) {
              const wait = game.waitState();
              if (wait.kind === "opportunity" && wait.playerId !== p.id)
                game.player(wait.playerId).pass();
              p.activate(favorableWinds, { reservePayment: payment.slice(2) });
            }
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(
              owner === "player-one" ? 0 : Math.max(0, opponentInfluence - (response ? 3 : 4)),
            );
            expect(p.cards(illuminateSecrets, { zone: "graveyard" })).toHaveLength(1);
          });
});
