import { describe, expect, it } from "vitest";

import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { startWithShiftingCurrentsNorth } from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { kongmingFelEidolon } from "../champions/kongming-fel-eidolon.ts";
import { bairuiResplendentBarrier } from "./bairui-resplendent-barrier.ts";
import { tailwindsBlessing } from "./tailwinds-blessing.ts";

/** @covers oh5n2sjk0u-a1 */
describe("Tailwind's Blessing — North to West", () => {
  it("gives controlled allies +1 POWER when currents turn West", () => {
    const game = startWithShiftingCurrentsNorth({
      lineage: [
        lineageTestChampion("Kongming", 1),
        lineageTestChampion("Kongming", 2),
        kongmingFelEidolon,
      ],
      playerOneZones: {
        field: [tailwindsBlessing, woodlandSquirrels],
        hand: [bairuiResplendentBarrier, woodlandSquirrels, woodlandSquirrels],
      },
    });
    const player = game.player("player-one");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const target = game.player("player-two").zone("field")[0]!;
    player.activate(bairuiResplendentBarrier, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-direction-choice")
      answerDecision(game, "resolve-direction-choice", "west");
    passEffectsStack(game);
    player.declareAttack(ally, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
