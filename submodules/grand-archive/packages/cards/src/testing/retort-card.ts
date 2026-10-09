import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { fluvialFatestone } from "../cards/HVN/items/fluvial-fatestone.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";

export function proveRetortCard(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  bonus: number,
  transform?: "fluvial" | "companion",
) {
  for (const mode of ["attack", "retaliate", "decline"] as const)
    it(`adds Retort ${bonus} only during retaliation: ${mode}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Guo Jia", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card, ...(transform === "companion" ? [fluvialFatestone] : [])],
            hand: [sparkAlight, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        tortoise = q.card(giantTortoise);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (transform) {
        const fluvial = p.card(fluvialFatestone);
        p.activateAbility(fluvial, "3h93tgm72l-a3", { reservePayment: pay(4) });
        passEffectsStack(game);
        expect(game.state.objects[fluvial.objectId]!.face).toBe("transformed");
        if (transform === "companion") {
          p.activate(sparkAlight, {
            reservePayment: pay(2),
            targets: { "target-1": [fluvial.objectId] },
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
          expect(game.state.objects[fluvial.objectId]!.zone).toBe("graveyard");
        }
        expect(game.state.objects[source.objectId]!.face).toBe("transformed");
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
      }
      if (mode === "attack") {
        p.declareAttack(source, tortoise);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[tortoise.objectId]!.damage).toBe(1);
        expect(game.state.objects[source.objectId]!.damage).toBe(0);
      } else {
        advanceToMain(game, q.id);
        q.declareAttack(tortoise, source);
        let chose = false;
        for (let i = 0; game.state.combat && i < 64; i++) {
          if (game.state.decision?.kind === "choose-retaliators") {
            answerDecision(
              game,
              "choose-retaliators",
              mode === "retaliate" ? [source.objectId] : [],
            );
            chose = true;
          } else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(chose).toBe(true);
        expect(game.state.combat).toBeNull();
        expect(game.state.objects[source.objectId]!.damage).toBe(1);
        expect(game.state.objects[tortoise.objectId]!.damage).toBe(
          mode === "retaliate" ? 1 + bonus : 0,
        );
        advanceToMain(game, p.id);
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
      }
    });
}
