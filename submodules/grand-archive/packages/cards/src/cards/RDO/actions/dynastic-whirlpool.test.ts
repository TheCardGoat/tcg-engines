import { describe, expect, it } from "vitest";
import { dynasticWhirlpool } from "./dynastic-whirlpool.ts";
import { proveMillResolution } from "../../../testing/mill-resolution.ts";

/** @covers 8ydxeQcp50-a2 */
describe("dynastic-whirlpool — mill", () => {
  proveMillResolution(dynasticWhirlpool, 15, "opponents");
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { greaterBoonOfHorses } from "../../PP1/boons/greater-boon-of-horses.ts";
import { lesserBoonOfApollo } from "../../PP1/boons/lesser-boon-of-apollo.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 8ydxeQcp50-a2 */
it("mills both opponents independently and leaves its controller's deck unchanged", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(dynasticWhirlpool, false, "activation-discount"),
  );
  const player = (id: string, count: number): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    startingChampionDefinitionId: champion.canonicalId,
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    mainDeck: [
      {
        definitionId:
          id === "player-one" ? dynasticWhirlpool.canonicalId : woodlandSquirrels.canonicalId,
        count,
      },
    ],
    pantheon: {
      lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
      greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
      barrierDefinitionId: pantheonBarrier.canonicalId,
    },
  });
  const game = GrandArchiveTestEngine.start(
    [
      champion,
      dynasticWhirlpool,
      woodlandSquirrels,
      lesserBoonOfApollo,
      greaterBoonOfHorses,
      pantheonBarrier,
    ],
    {
      mode: "pantheon",
      firstPlayerId: "player-one",
      randomSeed: 17,
      players: [player("player-one", 25), player("player-two", 10), player("player-three", 25)],
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p = game.player("player-one"),
    opponents = [game.player("player-two"), game.player("player-three")];
  for (let round = 0; round < 4; round++) advanceToMain(game, p.id, game.state.turn.number);
  const ownDeck = p.zone("main-deck"),
    decks = opponents.map((o) => o.zone("main-deck"));
  const [source, ...payment] = p.cards(dynasticWhirlpool, { zone: "hand" });
  p.activate(source!, {
    reservePayment: payment.slice(0, 3).map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  expect(p.zone("main-deck")).toEqual(ownDeck);
  expect(game.state.winnerIds).toEqual([]);
  for (const [index, opponent] of opponents.entries()) {
    expect(opponent.zone("main-deck")).toEqual(decks[index]!.slice(15));
    expect(opponent.zone("graveyard")).toEqual(decks[index]!.slice(0, 15));
  }
});
