import { describe } from "vitest";
import { keySlimePudding } from "./key-slime-pudding.ts";
import { proveTemporaryEntryReplacement } from "../../../testing/temporary-entry-replacement.ts";
/** @covers 4wuq20gvcg-a1 */
describe("Key Slime Pudding's temporary entry buffs", () =>
  proveTemporaryEntryReplacement(keySlimePudding, "4wuq20gvcg-a1", true));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { settleEntryReplacements } from "../../../testing/temporary-entry-replacement.ts";
import { slimecallCyclone } from "../../RDO/phantasias/slimecall-cyclone.ts";
import { babySlime } from "../../RDO/tokens/baby-slime.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

for (const own of [false, true])
  for (const copies of [1, 2])
    it(`applies to matching token summons after the banishment ability resolves: own=${own}, copies=${copies}`, () => {
      const champion = createClassBonusTestChampion(keySlimePudding, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: own ? "playerTwo" : "playerOne",
        definitions: [babySlime],
        playerOne: {
          champion,
          zones: {
            field: [
              ...Array.from({ length: copies }, () => keySlimePudding),
              babySlime,
              ...(own ? [slimecallCyclone] : []),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [babySlime, ...(own ? [] : [slimecallCyclone])],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        recipient = own ? p : q;
      const existing = [p.card(babySlime), q.card(babySlime)];
      advanceToRecollection(game, recipient.id);
      expect(game.state.stack).toHaveLength(1);
      if (!own) q.pass();
      for (const source of p.cards(keySlimePudding, { zone: "field" }))
        p.activateAbility(source, "4wuq20gvcg-a1");
      expect(recipient.cards(babySlime, { zone: "field" })).toHaveLength(1);
      settleEntryReplacements(game);
      const first = recipient
        .cards(babySlime, { zone: "field" })
        .find((c) => !existing.some((e) => e.objectId === c.objectId))!;
      expect(first).toBeDefined();
      expect(game.state.objects[first.objectId]!.counters.buff ?? 0).toBe(own ? copies : 0);
      for (const original of existing)
        expect(game.state.objects[original.objectId]!.counters.buff ?? 0).toBe(0);
      advanceToRecollection(game, recipient.id);
      settleEntryReplacements(game);
      const next = recipient
        .cards(babySlime, { zone: "field" })
        .filter(
          (c) => c.objectId !== first.objectId && !existing.some((e) => e.objectId === c.objectId),
        );
      expect(next).toHaveLength(1);
      expect(game.state.objects[next[0]!.objectId]!.counters.buff ?? 0).toBe(0);
      expect(game.state.objects[first.objectId]!.counters.buff ?? 0).toBe(own ? copies : 0);
    });
