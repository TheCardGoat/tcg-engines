import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { manaLimiter } from "./mana-limiter.ts";
import { jewelOfEnlightenment } from "./jewel-of-enlightenment.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
/** @covers IC3OU6vCnF-a1 @covers IC3OU6vCnF-a2 */
describe("Mana Limiter's payment prohibition and six-counter release", () => {
  it("blocks champion enlighten payments until banished at six counters", () => {
    const champion = createClassBonusTestChampion(manaLimiter, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [manaLimiter, ...Array.from({ length: 6 }, () => jewelOfEnlightenment)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      id = p.card(champion).objectId;
    for (let n = 0; n < 6; n++) {
      const before = game.state;
      expect(() => p.activateAbility(manaLimiter, "IC3OU6vCnF-a2")).toThrow();
      expect(game.state).toEqual(before);
      if (n >= 3) {
        expect(() => p.activateAbility(p.card(champion), "game:enlighten-counter-a1")).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activateAbility(p.cards(jewelOfEnlightenment, { zone: "field" })[0]!, "AKA19OwaCh-a1");
      passEffectsStack(game);
    }
    const before = game.state;
    expect(() => p.activateAbility(p.card(champion), "game:enlighten-counter-a1")).toThrow();
    expect(game.state).toEqual(before);
    p.activateAbility(manaLimiter, "IC3OU6vCnF-a2");
    expect(p.cards(manaLimiter, { zone: "banishment" })).toHaveLength(1);
    expect(p.zone("hand")).toHaveLength(0);
    expect(game.state.objects[id]!.counters.enlighten).toBe(6);
    passEffectsStack(game);
    expect(p.zone("hand")).toHaveLength(1);
    expect(q.zone("hand")).toHaveLength(0);
    p.activateAbility(p.card(champion), "game:enlighten-counter-a1");
    expect(game.state.objects[id]!.counters.enlighten).toBe(3);
    passEffectsStack(game);
    expect(p.zone("hand")).toHaveLength(2);
  });
  it("does not prohibit the opponent from paying enlighten counters", () => {
    const champion = createClassBonusTestChampion(manaLimiter, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [jewelOfEnlightenment, jewelOfEnlightenment, jewelOfEnlightenment],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [manaLimiter] } },
    });
    const p = game.player("player-one");
    for (let n = 0; n < 3; n++) {
      p.activateAbility(p.cards(jewelOfEnlightenment, { zone: "field" })[0]!, "AKA19OwaCh-a1");
      passEffectsStack(game);
    }
    p.activateAbility(p.card(champion), "game:enlighten-counter-a1");
    passEffectsStack(game);
    expect(p.zone("hand")).toHaveLength(1);
  });
});
