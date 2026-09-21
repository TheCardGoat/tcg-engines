import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { imperialAssassin } from "../../AMB/allies/imperial-assassin.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { jueyingShadowmare } from "./jueying-shadowmare.ts";
import { tweedledeeContrarianPoet } from "./tweedledee-contrarian-poet.ts";

/** @covers c3plbuv3fr-a1 */
describe("Jueying, Shadowmare — Pride 3", () => {
  provePrideAlly({ card: jueyingShadowmare, pride: 3, power: 3 });
});

/** @covers c3plbuv3fr-a2 */
describe("Jueying, Shadowmare — Human rider bonus", () => {
  it("loses Pride and gains both Stealth and True Sight with a water unique Human ally", () => {
    const champion = lineageTestChampion("Jueying", 0);
    const opposingChampion = createClassBonusTestChampion(
      imperialAssassin,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [jueyingShadowmare, tweedledeeContrarianPoet] },
      },
      playerTwo: {
        champion: opposingChampion,
        zones: { field: [imperialAssassin, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.declareAttack(jueyingShadowmare, imperialAssassin);
    expect(game.state.combat?.targetIds).toEqual([opponent.card(imperialAssassin).objectId]);
    game.resolveCombatWithoutRetaliation();
    const before = game.state;
    expect(() => opponent.declareAttack(woodlandSquirrels, jueyingShadowmare)).toThrow();
    expect(game.state).toEqual(before);
  });
});
