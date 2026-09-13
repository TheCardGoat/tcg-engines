import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { shiftingCurrents } from "../../P24/masteries/shifting-currents.ts";
import { kongmingWaywardMaven } from "../champions/kongming-wayward-maven.ts";
import { galvanizingGale } from "./galvanizing-gale.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { incantationOfProsperity } from "./incantation-of-prosperity.ts";

function durableSpirit() {
  const base = lineageTestChampion("Kongming", 0);
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        elements: ["NORM", "WIND"] as const,
        stats: { ...base.layout.face.stats, life: 40 },
      },
    },
  };
}

/** @covers 9WeCxLlnbt-a1 */
describe("Incantation of Prosperity — Shifting Currents modes", () => {
  it("empowers the next Spell when Currents face North", () => {
    const starter = durableSpirit();
    if (kongmingWaywardMaven.layout.kind !== "single-faced")
      throw new Error("expected single face");
    const kongming = {
      ...kongmingWaywardMaven,
      layout: {
        kind: "single-faced" as const,
        face: {
          ...kongmingWaywardMaven.layout.face,
          elements: ["NORM", "WIND"] as const,
        },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [shiftingCurrents],
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [kongming],
          memory: [woodlandSquirrels],
          hand: [
            incantationOfProsperity,
            galvanizingGale,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
          field: [galesMare],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    player.materialize(kongming);
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    expect(game.state.players[player.id]?.states["shifting-currents"]).toBe("north");
    for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    }
    player.activate(incantationOfProsperity, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
    });
    passEffectsStack(game);
    const ally = player.card(galesMare, { zone: "field" });
    player.activate(galvanizingGale, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      targets: { "target-1": [ally.objectId] },
    });
    const stackItem = game.state.stack.at(-1);
    expect(stackItem?.kind).toBe("card-activation");
    expect(
      stackItem && "activationStates" in stackItem
        ? stackItem.activationStates.includes("empowered")
        : false,
    ).toBe(true);
  });

  it("recovers 2 when Shifting Currents is not North or South", () => {
    const starter = durableSpirit();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        zones: {
          hand: [incantationOfProsperity, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: lineageTestChampion("Opponent", 0),
        zones: { field: [ferventBeastmaster] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(starter, { zone: "field" });
    opponent.declareAttack(ferventBeastmaster, ownChampion);
    game.resolveCombatWithoutRetaliation();
    opponent.pass();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(3);
    player.activate(incantationOfProsperity, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(1);
  });
});
