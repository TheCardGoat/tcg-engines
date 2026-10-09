import { describe } from "vitest";
import { deepSeaFractal } from "./deep-sea-fractal.ts";
import { proveEntryMill } from "../../../testing/entry-mill.ts";
/** @covers hjdu50pces-a2 */
describe("deep-sea-fractal — entry mill", () => proveEntryMill(deepSeaFractal, 1, "each"));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { lesserBoonOfApollo } from "../../PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../../PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";

/** @covers hjdu50pces-a2 */
it("mills one card for every player in a three-player game", () => {
  const champion = enableAllTestElements(lineageTestChampion("Deep Sea", 0));
  const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    startingChampionDefinitionId: champion.canonicalId,
    mainDeck: [{ definitionId: deepSeaFractal.canonicalId, count: 15 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    pantheon: {
      lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
      greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
      barrierDefinitionId: pantheonBarrier.canonicalId,
    },
  });
  const game = GrandArchiveTestEngine.start(
    [champion, deepSeaFractal, lesserBoonOfApollo, greaterBoonOfHorses, pantheonBarrier],
    {
      mode: "pantheon",
      randomSeed: 43,
      firstPlayerId: "player-one",
      players: [setup("player-one"), setup("player-two"), setup("player-three")],
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p = game.player("player-one");
  for (let n = 0; n < 3; n++) advanceToMain(game, p.id, game.state.turn.number);
  const players = [p, game.player("player-two"), game.player("player-three")];
  const decks = players.map((player) => player.zone("main-deck"));
  const [card, ...payment] = p.cards(deepSeaFractal, { zone: "hand" });
  p.activate(card!, {
    reservePayment: payment.slice(0, 2).map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  passEffectsStack(game);
  for (const [i, player] of players.entries()) {
    expect(player.zone("graveyard")).toEqual([decks[i]![0]!]);
    expect(player.zone("main-deck")).toEqual(decks[i]!.slice(1));
  }
});
