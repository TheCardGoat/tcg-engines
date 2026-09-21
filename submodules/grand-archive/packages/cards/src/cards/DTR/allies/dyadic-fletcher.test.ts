import { dyadicFletcher } from "./dyadic-fletcher.ts";
import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers hohkep3vi9-a1 */
describe("dyadic-fletcher — Ranged combat", () => {
  proveRangedAlly({ card: dyadicFletcher, power: 2, ranged: 2, classBonus: false });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { resonantAether } from "../actions/resonant-aether.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers hohkep3vi9-a2 */
describe("Dyadic Fletcher — second controlled Aethercharge activation", () => {
  for (const matching of [false, true])
    it(`counts only controlled charges, triggers on the second and resets next turn, class=${matching}`, () => {
      const champion = createClassBonusTestChampion(
        dyadicFletcher,
        matching,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [dyadicFletcher],
            hand: [
              backdash,
              ...Array.from({ length: 5 }, () => resonantAether),
              ...Array.from({ length: 5 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [dyadicFletcher],
            hand: [resonantAether, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(dyadicFletcher),
        opposing = q.card(dyadicFletcher);
      const pay = () => [
        {
          kind: "card" as const,
          cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ];
      p.activate(backdash, {
        targets: { "target-1": [p.card(champion).objectId] },
        reservePayment: pay(),
      });
      p.pass();
      q.activate(resonantAether, {
        reservePayment: [{ kind: "card", cardId: q.card(woodlandSquirrels).objectId }],
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
      expect(game.state.objects[opposing.objectId]!.states.has("distant")).toBe(false);
      const charges = p.cards(resonantAether);
      for (let cast = 0; cast < 3; cast++) {
        p.activate(charges[cast]!, { reservePayment: pay() });
        expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(
          matching && cast === 2,
        );
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === "hohkep3vi9-a2",
          ),
        ).toHaveLength(matching && cast === 1 ? 1 : 0);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(
          matching && cast >= 1,
        );
        expect(game.state.objects[opposing.objectId]!.states.has("distant")).toBe(false);
      }
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(matching ? 4 : 2);
      advanceToMain(game, q.id);
      expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
      advanceToMain(game, p.id);
      for (let cast = 3; cast < 5; cast++) {
        p.activate(charges[cast]!, { reservePayment: pay() });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(
          matching && cast === 4,
        );
      }
    });
});
