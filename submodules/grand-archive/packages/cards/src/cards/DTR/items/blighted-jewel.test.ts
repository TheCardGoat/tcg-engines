import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { blightedJewel } from "./blighted-jewel.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers hbpu4fo8oo-a1 @covers hbpu4fo8oo-a2 */
describe("Blighted Jewel — ephemeral memory draw and entry-turn ally power", () => {
  it("draws on entry and buffs only controlled ephemeral allies that entered this turn", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(blightedJewel, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [blightedJewel, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          field: [evercurrentRaider],
          graveyard: [evercurrentRaider],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          graveyard: [evercurrentRaider],
          hand: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 3 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const regular = p.card(evercurrentRaider, { zone: "field" }),
      ephemeral = p.card(evercurrentRaider, { zone: "graveyard" });
    p.activate(ephemeral, {
      activationMethod: "ephemerate",
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    const top = p.zone("main-deck")[0]!,
      jewel = p.card(blightedJewel);
    p.activate(jewel, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    p.pass();
    q.pass();
    expect(game.state.objects[jewel.objectId]!.zone).toBe("field");
    expect(game.state.objects[jewel.objectId]!.states.has("ephemeral")).toBe(false);
    expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
    passEffectsStack(game);
    expect(game.state.objects[jewel.objectId]!.states.has("ephemeral")).toBe(true);
    expect(game.state.objects[top.objectId]!.zone).toBe("memory");
    p.declareAttack(ephemeral, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
    p.declareAttack(regular, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
    advanceToMain(game, q.id);
    const opposing = q.card(evercurrentRaider);
    q.activate(opposing, {
      activationMethod: "ephemerate",
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    q.declareAttack(opposing, p.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    advanceToMain(game, p.id);
    p.declareAttack(ephemeral, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
  });
});
