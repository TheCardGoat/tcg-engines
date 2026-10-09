import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { strikingIlluminance } from "./striking-illuminance.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { illuminateSecrets } from "../../FTC/actions/illuminate-secrets.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers 2lukkhisu5-a1
 * @covers 2lukkhisu5-a2
 * @covers 2lukkhisu5-a3
 */
describe("Striking Illuminance", () => {
  for (const prepared of [false, true])
    for (const luxem of [0, 1, 2])
      it(`gains power only from own revealed Luxem memory, prepared=${prepared}, Luxem=${luxem}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(strikingIlluminance, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                strikingIlluminance,
                acceptedContract,
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
              memory: Array.from({ length: luxem }, () => illuminateSecrets),
              graveyard: [illuminateSecrets],
            },
          },
          playerTwo: {
            champion,
            zones: { memory: [illuminateSecrets, illuminateSecrets, illuminateSecrets] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          target = q.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(strikingIlluminance, {
            reservePayment: pay(2),
            attackAttackerId: hero.objectId,
            prepareAbilityIndexes: [0],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        p.activate(strikingIlluminance, {
          reservePayment: pay(2),
          attackAttackerId: hero.objectId,
          ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
        });
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 1 : 3);
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Resolve Striking Illuminance");
        for (let step = 0; step < 64 && (game.state.combat || game.state.stack.length); step++) {
          const decision = game.state.decision;
          if (decision?.kind === "order-triggered-abilities")
            answerDecision(game, decision.kind, decision.pendingTriggerIds);
          else if (decision?.kind === "choose-retaliators") answerDecision(game, decision.kind, []);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected wait ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(game.state.objects[target.objectId]!.damage).toBe(4 + (prepared ? luxem : 0));
        expect(p.zone("memory")).toHaveLength(7 + luxem);
      });
});
