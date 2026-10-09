import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { describe, expect, it } from "vitest";
import { rhesusEradication } from "./rhesus-eradication.ts";
import { elysianOrphan } from "../allies/elysian-orphan.ts";
import { venousCore } from "../items/venous-core.ts";
import { proveSubtypeCountDamage } from "../../../testing/subtype-count-damage.ts";
/** @covers KgjL9uCqm6-a1 */
describe("Rhesus Eradication — LV plus twice controlled Elysian objects", () => {
  proveSubtypeCountDamage(
    rhesusEradication,
    2,
    elysianOrphan,
    [
      { label: "none", cards: [] },
      { label: "ally", cards: [elysianOrphan] },
      { label: "item", cards: [venousCore] },
      { label: "mixed", cards: [elysianOrphan, elysianOrphan, venousCore] },
    ],
    "level-plus-two-elysians",
  );
});

/** @covers KgjL9uCqm6-a1 */
describe("Rhesus Eradication — resolution count", () => {
  for (const core of [false, true])
    it(`recounts after a responding spell kills an Elysian; core=${core}`, () => {
      const champion = enableAllTestElements(
        grantTestChampionLevel(
          createClassBonusTestChampion(rhesusEradication, true, "activation-discount"),
          3,
        ),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              rhesusEradication,
              fireball,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            field: [elysianOrphan, ...(core ? [venousCore] : [])],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const orphan = p.card(elysianOrphan),
        target = q.card(champion);
      const pay = () =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(rhesusEradication, {
        reservePayment: pay(),
        targets: { "target-1": [target.objectId] },
      });
      p.activate(fireball, { reservePayment: pay(), targets: { "target-1": [orphan.objectId] } });
      passEffectsStack(game);
      expect(game.state.objects[orphan.objectId]?.zone).toBe("graveyard");
      expect(game.state.objects[target.objectId]?.damage).toBe(core ? 5 : 3);
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.decision).toBeNull();
    });
});
