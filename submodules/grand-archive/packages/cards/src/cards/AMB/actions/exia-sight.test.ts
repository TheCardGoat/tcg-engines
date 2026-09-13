import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { exiaSight } from "./exia-sight.ts";

function durableChampion() {
  const base = createClassBonusTestChampion(exiaSight, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 40 } },
    },
  };
}

/** @covers 1fy8l4pxs9-a1 */
describe("Exia Sight — Draw a card", () => {
  proveDrawCardResolution({ card: exiaSight });
});

/** @covers 1fy8l4pxs9-a2 */
describe("Exia Sight — Damage 20+ next activation discount", () => {
  for (const damaged of [false, true]) {
    it(
      `${damaged ? "discounts" : "does not discount"} the next card at ${damaged ? 21 : 0} damage`,
      { timeout: 15_000 },
      () => {
        const champion = durableChampion();
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [exiaSight, reposition, woodlandSquirrels],
              field: [galesMare],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: damaged
                ? Array.from({ length: 7 }, () => ferventBeastmaster)
                : [ferventBeastmaster],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion, { zone: "field" });
        if (damaged) {
          for (const attacker of opponent.cards(ferventBeastmaster, { zone: "field" })) {
            opponent.declareAttack(attacker, ownChampion);
            game.resolveCombatWithoutRetaliation();
          }
        }
        opponent.pass();
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(damaged ? 21 : 0);
        player.activate(exiaSight);
        passEffectsStack(game);
        opponent.pass();
        const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        }));
        const ally = player.card(galesMare, { zone: "field" });
        if (!damaged) {
          const before = game.state;
          expect(() =>
            player.activate(reposition, { targets: { "target-1": [ally.objectId] } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        player.activate(reposition, {
          ...(damaged ? {} : { reservePayment: payment.slice(0, 1) }),
          targets: { "target-1": [ally.objectId] },
        });
        expect(player.zone("memory")).toHaveLength(damaged ? 0 : 1);
      },
    );
  }
});
