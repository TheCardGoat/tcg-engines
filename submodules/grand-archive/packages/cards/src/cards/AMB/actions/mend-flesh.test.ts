import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { proveRecoverChampion } from "../../../testing/recover-champion.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { mendFlesh } from "./mend-flesh.ts";

function durableChampion(life: number) {
  const champion = createClassBonusTestChampion(mendFlesh, false, "activation-discount");
  const face =
    champion.layout.kind === "single-faced" ? champion.layout.face : champion.layout.defaultFace;
  const canonicalId = `${champion.canonicalId}-life${life}`;
  return {
    ...champion,
    canonicalId,
    slug: canonicalId,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        stats: { level: 0, life },
      },
    },
  };
}

function fixture(hits: number) {
  const champion = durableChampion(40);
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [mendFlesh, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: Array.from({ length: 10 }, () => ferventBeastmaster),
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const target = player.card(champion, { zone: "field" });
  for (const attacker of opponent.cards(ferventBeastmaster, { zone: "field" }).slice(0, hits)) {
    opponent.declareAttack(attacker, target);
    game.resolveCombatWithoutRetaliation();
  }
  opponent.pass();
  advanceToMain(game, player.id);
  return { game, player, champion, target };
}

function payment(game: GrandArchiveTestEngine, count: number) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, count)
    .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
}

/** @covers ju2d98w3j0-a1 */
describe("Mend Flesh — Damage 25+ activation discount", () => {
  it("costs its printed two reserve below twenty-five damage", () => {
    const { game, player, target } = fixture(8);
    expect(game.state.objects[target.objectId]!.damage).toBe(24);
    const before = game.state;
    expect(() => player.activate(mendFlesh, { reservePayment: payment(game, 0) })).toThrow();
    expect(game.state).toEqual(before);
    player.activate(mendFlesh, { reservePayment: payment(game, 2) });
  }, 20_000);

  it("activates for free once the champion has twenty-five damage", () => {
    const { game, player, target } = fixture(9);
    expect(game.state.objects[target.objectId]!.damage).toBe(27);
    player.activate(mendFlesh, { reservePayment: [] });
    expect(player.zone("memory")).toHaveLength(0);
  }, 20_000);
});

/** @covers ju2d98w3j0-a2 */
describe("Mend Flesh — Recover 8", () => {
  proveRecoverChampion({ card: mendFlesh, amount: 8 });
});
