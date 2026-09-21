import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
import { devotedMartyr } from "./devoted-martyr.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers p16w5j93mk-a2 */
describe("Devoted Martyr — class-gated graveyard recovery on own level-up", () => {
  for (const matching of [false, true])
    for (const zone of ["graveyard", "hand", "field", "banishment"] as const)
      for (const accept of [false, true]) scenario(matching, zone, accept, 3);
  for (const damage of [0, 1]) scenario(true, "graveyard", true, damage);

  for (const removed of ["before", "after"] as const) scenario(true, "graveyard", true, 3, removed);

  function scenario(
    matching: boolean,
    zone: "graveyard" | "hand" | "field" | "banishment",
    accept: boolean,
    damage: number,
    removed?: "before" | "after",
  ) {
    it(`class=${matching}, source=${zone}, accept=${accept}, damage=${damage}, removed=${removed}`, () => {
      const champion = createClassBonusTestChampion(devotedMartyr, matching, "activation-discount");
      const face = requireSingleFace(champion),
        nextId = `${champion.canonicalId}-successor`;
      const next = {
        ...champion,
        canonicalId: nextId,
        slug: nextId,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...face,
            id: grandArchiveDefaultFaceId(nextId),
            catalogId: nextId,
            stats: { level: 1, life: 15 },
            cost: { kind: "memory" as const, amount: 1 },
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            [zone]: [devotedMartyr],
            memory: [woodlandSquirrels],
            "material-deck": [next],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: Array.from({ length: damage + 1 }, () => enfeebledDagger),
            graveyard: [devotedMartyr],
            hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hero = p.card(champion),
        foe = q.card(champion),
        source = p.card(devotedMartyr);
      for (let i = 0; i <= damage; i++) {
        q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [i === damage ? foe.objectId : hero.objectId] },
        });
        passEffectsStack(game);
      }
      for (let step = 0; step < 64; step++) {
        const wait = game.waitState();
        if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.waitState().kind).toBe("materialization-choice");
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      p.materialize(next);
      expect(game.state.objects[source.objectId]!.zone).toBe(zone);
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      if (removed) {
        if (removed === "after") {
          for (
            let step = 0;
            game.state.objects[hero.objectId]!.activeDefinitionId !== next.canonicalId && step < 16;
            step++
          ) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "p16w5j93mk-a2",
            ),
          ).toBe(true);
        }
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        q.activate(tombSweep, {
          targets: { "target-card": [source.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      }
      passEffectsStack(game);
      if (removed) {
        if (game.state.decision?.kind === "resolve-optional-effect") {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
        return;
      }
      const triggers = matching && zone === "graveyard";
      if (triggers) {
        expect(game.state.decision).toMatchObject({
          kind: "resolve-optional-effect",
          playerId: p.id,
        });
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.objects[source.objectId]!.zone).toBe(
        triggers && accept ? "banishment" : zone,
      );
      expect(game.state.objects[hero.objectId]!.damage).toBe(
        triggers && accept ? Math.max(0, damage - 2) : damage,
      );
      expect(game.state.objects[foe.objectId]!.damage).toBe(1);
      expect(q.cards(devotedMartyr, { zone: "graveyard" })).toHaveLength(1);
    });
  }
});
