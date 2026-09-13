import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { liturgyOfCorruption } from "../../RDO/actions/liturgy-of-corruption.ts";
import { veilarasPromise } from "./veilaras-promise.ts";

/** @covers rcwr60wa5b-a1 */
describe("Veilara's Promise — refinement on Spell activation", () => {
  it("counts Spell activations and may banish itself at three counters to draw", () => {
    const champion = createClassBonusTestChampion(veilarasPromise, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [veilarasPromise, woodlandSquirrels],
          hand: [
            liturgyOfCorruption,
            liturgyOfCorruption,
            liturgyOfCorruption,
            ...Array.from({ length: 6 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const promise = player.card(veilarasPromise, { zone: "field" });
    const top = player.zone("main-deck")[0]!;
    for (let index = 0; index < 3; index += 1) {
      const payments = player.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 2);
      player.activate(player.cards(liturgyOfCorruption, { zone: "hand" })[0]!, {
        targets: { "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId] },
        reservePayment: payments.map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      if (index < 2) {
        expect(game.state.objects[promise.objectId]!.counters["named:refinement"]).toBe(index + 1);
        expect(game.state.objects[promise.objectId]!.zone).toBe("field");
      }
    }
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.objects[promise.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[top.objectId]?.zone).toBe("hand");
  });
});
