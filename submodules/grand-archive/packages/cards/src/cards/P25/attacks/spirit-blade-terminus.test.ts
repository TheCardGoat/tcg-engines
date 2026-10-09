import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { spiritBladeTerminus } from "./spirit-blade-terminus.ts";
import { fracturedMemories } from "../masteries/fractured-memories.ts";
import { merlinMemoriteVassal } from "../../PTM/champions/merlin-memorite-vassal.ts";
import { spallingCleanse } from "../../SP4/actions/spalling-cleanse.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { intangibleGeist } from "../../DOA/allies/intangible-geist.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers XsxmnGZxKz-a1
 * @covers XsxmnGZxKz-a2
 * @covers XsxmnGZxKz-a3
 */
describe("Spirit Blade: Terminus", () => {
  for (const prepared of [false, true])
    for (const sheen of [0, 2, 4, 6, 8])
      for (const hit of [false, true])
        it(`uses mastery sheen for power and doubles it on prepared hit, prepared=${prepared}, sheen=${sheen}, hit=${hit}`, () => {
          const starter = lineageTestChampion("Merlin", 0),
            merlin = enableAllTestElements(merlinMemoriteVassal);
          const opponent = createClassBonusTestChampion(
            intangibleGeist,
            true,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [fracturedMemories],
            phase: "materialize",
            playerOne: {
              champion: starter,
              zones: {
                "material-deck": [merlin],
                memory: [woodlandSquirrels],
                hand: [
                  spiritBladeTerminus,
                  acceptedContract,
                  ...Array.from({ length: sheen / 2 }, () => spallingCleanse),
                  ...Array.from({ length: 7 + sheen }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion: opponent, zones: { field: [intangibleGeist] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          p.materialize(merlin);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
          advanceToMain(game, p.id);
          expect(game.state.players[p.id]!.mastery?.name).toBe("Fractured Memories");
          const hero = p.card(starter, { zone: "field" }),
            target = q.card(hit ? opponent : intangibleGeist);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          for (const source of p.cards(spallingCleanse, { zone: "hand" })) {
            p.activate(source, { reservePayment: pay(2) });
            passEffectsStack(game);
          }
          expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(sheen);
          p.activate(acceptedContract, { reservePayment: pay(5) });
          passEffectsStack(game);
          const source = p.card(spiritBladeTerminus);
          p.activate(source, {
            reservePayment: pay(2),
            attackAttackerId: hero.objectId,
            ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
          });
          expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 2 : 3);
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, target.objectId, "Resolve Terminus");
          for (let step = 0; step < 64 && (game.state.combat || game.state.stack.length); step++) {
            const decision = game.state.decision;
            if (decision?.kind === "resolve-optional-effect")
              answerDecision(game, decision.kind, false);
            else if (decision?.kind === "order-triggered-abilities")
              answerDecision(game, decision.kind, decision.pendingTriggerIds);
            else if (decision?.kind === "choose-retaliators")
              answerDecision(game, decision.kind, []);
            else {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          expect(game.state.combat).toBeNull();
          expect(game.state.objects[target.objectId]!.damage).toBe(
            hit ? 2 + Math.floor(sheen / 4) : 0,
          );
          expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(
            prepared && hit ? 2 * sheen : sheen,
          );
          expect(game.state.objects[source.objectId]!.zone).toBe(
            prepared && hit ? "memory" : "graveyard",
          );
        });
});
