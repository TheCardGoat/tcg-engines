import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { rootsOfTomorrow } from "./roots-of-tomorrow.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers MkhP6iKyLX-a1
 * @covers MkhP6iKyLX-a2
 */
describe("Roots of Tomorrow", () => {
  it("preserves the top card before drawing the next card into memory", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(rootsOfTomorrow, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [rootsOfTomorrow, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      deck = p.zone("main-deck");
    p.activate(rootsOfTomorrow, {
      reservePayment: [
        { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    expect(p.zone("material-deck")).toContainEqual(deck[0]);
    expect(game.state.objects[deck[0]!.objectId]!.states.has("preserved")).toBe(true);
    expect(p.zone("memory")).toHaveLength(2);
    expect(p.zone("memory")).toContainEqual(deck[1]);
    expect(p.zone("hand")).toHaveLength(0);
    expect(p.zone("main-deck")).toEqual(deck.slice(2));
  });
});
