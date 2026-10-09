import { describe } from "vitest";
import { geminiStarbearer } from "./gemini-starbearer.ts";
import { astralShard } from "../../DTR/tokens/astral-shard.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers NyPQW7hkAq-a1 */
describe("geminiStarbearer", () => {
  proveSummonOnEnter({
    card: geminiStarbearer,
    token: astralShard,
    cost: 2,
    count: 1,
    abilityId: "NyPQW7hkAq-a1",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers NyPQW7hkAq-a2 */
describe("Gemini Starbearer — Astral Shard damage", () => {
  for (const count of [0, 1, 2])
    for (const targetAlly of [false, true])
      it(`deals damage from own field shards: count=${count}, ally=${targetAlly}`, () => {
        const champion = createClassBonusTestChampion(
          geminiStarbearer,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [geminiStarbearer, ...Array.from({ length: count }, () => astralShard)],
              graveyard: [astralShard],
              banishment: [astralShard],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise, astralShard, astralShard] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(geminiStarbearer),
          target = q.card(targetAlly ? giantTortoise : champion);
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "NyPQW7hkAq-a2", {
            targets: { "target-1": [q.cards(astralShard, { zone: "field" })[0]!.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "NyPQW7hkAq-a2", { targets: { "target-1": [target.objectId] } });
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(count);
        expect(() =>
          p.activateAbility(source, "NyPQW7hkAq-a2", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
      });
});
