import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { soothingDisillusion } from "../cards/AMB/actions/soothing-disillusion.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { breakApart } from "../cards/P26/actions/break-apart.ts";

/** Vigor 1 and Link: the linked unit wakes on its controller's end step while the source remains. */
export function proveLinkedVigor(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  { championHost = false, statBonus = 0 } = {},
) {
  const face = grandArchiveTestFace(card);
  const cost = face.cost;
  if (cost.kind === "none" || typeof cost.amount !== "number")
    throw new Error("Expected a fixed play cost");
  const playCost = cost.amount;
  const material = cost.kind === "memory";
  const phantasia = face.typeLine.types.includes("PHANTASIA");
  const removal = phantasia ? soothingDisillusion : breakApart;
  const removalCost = phantasia ? 2 : face.typeLine.supertypes.includes("REGALIA") ? 5 : 3;
  for (const matching of [false, true])
    for (const opposingHost of [false, true])
      for (const removed of [false, true]) {
        it(`wakes only the linked unit on its own end step, class=${matching}, opposing=${opposingHost}, removed=${removed}, champion=${championHost}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            phase: material ? "materialize" : "main",
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, giantTortoise, trainingSword],
                hand: [
                  ...(material ? [] : [card]),
                  removal,
                  glacialGuidance,
                  glacialGuidance,
                  ...Array.from(
                    { length: 2 + removalCost + (material ? 0 : playCost) },
                    () => woodlandSquirrels,
                  ),
                ],
                "material-deck": material ? [card] : [],
                memory: material ? Array.from({ length: playCost }, () => woodlandSquirrels) : [],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise, giantTortoise, trainingSword],
                hand: [removal, ...Array.from({ length: removalCost }, () => woodlandSquirrels)],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = opposingHost ? q : p,
            foe = opposingHost ? p : q;
          const host = championHost ? owner.card(champion) : owner.cards(giantTortoise)[0]!;
          const other = owner.cards(giantTortoise)[1]!;
          const pay = (player: typeof p, n: number) =>
            player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const targets = { "intrinsic-link-target": [host.objectId] };
          if (material) p.materialize(card, { targets });
          else p.activate(card, { targets, reservePayment: pay(p, playCost) });
          passEffectsStack(game);
          if (material) advanceToMain(game, p.id);
          if (opposingHost && !championHost) {
            for (const unit of [host, other]) {
              p.activate(p.cards(glacialGuidance, { zone: "hand" })[0]!, {
                reservePayment: pay(p, 1),
                targets: { "target-1": [unit.objectId] },
              });
              passEffectsStack(game);
            }
            for (let step = 0; step < 32 && game.state.turn.phase !== "end"; step++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity")
                throw new Error(`Unexpected ${wait.kind} before end phase`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.turn.phase).toBe("end");
            expect(game.state.turn.playerId).toBe(p.id);
            passEffectsStack(game);
            expect(game.state.objects[host.objectId]!.states.has("rested")).toBe(true);
            expect(game.state.objects[other.objectId]!.states.has("rested")).toBe(true);
          }
          if (opposingHost) advanceToMain(game, q.id);
          const numeric = (id: typeof host.objectId, property: "power" | "life") =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          if (!championHost) {
            expect(numeric(host.objectId, "power")).toBe(1 + statBonus);
            expect(numeric(host.objectId, "life")).toBe(6 + statBonus);
          }
          expect(numeric(other.objectId, "power")).toBe(1);
          expect(numeric(other.objectId, "life")).toBe(6);
          owner.declareAttack(
            host,
            foe.card(champion),
            championHost ? { weaponIds: [owner.card(trainingSword).objectId] } : {},
          );
          game.resolveCombatWithoutRetaliation();
          owner.declareAttack(other, foe.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.card(champion).objectId]!.damage).toBe(2 + statBonus);
          expect(game.state.objects[host.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.objects[other.objectId]!.states.has("rested")).toBe(true);
          if (removed) {
            const source = p.card(card, { zone: "field" });
            owner.activate(removal, {
              reservePayment: pay(owner, removalCost),
              targets: { "target-1": [source.objectId] },
              ...(phantasia ? { modeIds: ["mode-1"] } : {}),
            });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
            if (!championHost) {
              expect(numeric(host.objectId, "power")).toBe(1);
              expect(numeric(host.objectId, "life")).toBe(6);
            }
          }
          // Stop before the host controller's next wake-up phase, so only Vigor can wake it.
          advanceToMain(game, foe.id);
          expect(game.state.objects[host.objectId]!.states.has("rested")).toBe(removed);
          expect(game.state.objects[other.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.decision).toBeNull();
        });
      }
}
