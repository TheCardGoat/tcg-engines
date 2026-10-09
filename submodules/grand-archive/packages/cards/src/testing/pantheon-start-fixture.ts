import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { lineageTestChampion } from "./champion-lineage.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { greaterBoonOfProxia } from "../cards/PRD/boons/greater-boon-of-proxia.ts";
import { lesserBoonOfApollo } from "../cards/PP1/boons/lesser-boon-of-apollo.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";

/** Keep real pregame actions enabled; small decks isolate First Boon and token setup. */
export function pantheonStartFixture(
  four: boolean,
  firstPlayerId: string,
  regalia?: { own: number; opponent: number },
) {
  const champion = lineageTestChampion("Pantheon setup", 0);
  const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    startingChampionDefinitionId: champion.canonicalId,
    mainDeck: [{ definitionId: woodlandSquirrels.canonicalId, count: 40 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(regalia &&
      (id === "player-one" ? regalia.own : id === "player-two" ? regalia.opponent : 0) > 0
        ? [
            {
              definitionId: trainingSword.canonicalId,
              count: id === "player-one" ? regalia.own : regalia.opponent,
            },
          ]
        : []),
    ],
    pantheon: {
      lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
      greaterBoonDefinitionId: greaterBoonOfProxia.canonicalId,
      barrierDefinitionId: pantheonBarrier.canonicalId,
    },
  });
  const three = [setup("player-one"), setup("player-two"), setup("player-three")] as const;
  const game = GrandArchiveTestEngine.start(
    [
      champion,
      woodlandSquirrels,
      greaterBoonOfProxia,
      lesserBoonOfApollo,
      pantheonBarrier,
      trainingSword,
    ],
    {
      mode: "pantheon",
      players: four ? [...three, setup("player-four")] : three,
      firstPlayerId,
      randomSeed: 23,
    },
    { validateDeckConstruction: false },
  );
  return { game, champion };
}
