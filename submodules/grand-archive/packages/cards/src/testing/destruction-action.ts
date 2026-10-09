import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { hoarfrostSpine } from "../cards/AMB/weapons/hoarfrost-spine.ts";
import { fluteOfTaming } from "../cards/DOA/items/flute-of-taming.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { chasingShadows } from "../cards/RDO/phantasias/chasing-shadows.ts";
import { oasisTradingPost } from "../cards/ALC/domains/oasis-trading-post.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveDestructionAction({
  card,
  kind,
  mode = "single",
  regaliaTax = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  kind: "equipment" | "phantasia" | "domain" | "ally";
  mode?: "single" | "up-to-three" | "all";
  regaliaTax?: boolean;
}): void {
  const printed = grandArchiveTestFace(card);
  if (printed.cost.kind !== "reserve" || typeof printed.cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const baseCost = printed.cost.amount;
  const eligible =
    kind === "equipment"
      ? [trainingSword, hoarfrostSpine, fluteOfTaming, potionOfHealing]
      : kind === "phantasia"
        ? [chasingShadows]
        : kind === "domain"
          ? [oasisTradingPost]
          : [giantTortoise];
  for (const targetCard of eligible)
    for (const own of [false, true])
      for (const count of mode === "up-to-three" ? [0, 1, 2, 3] : mode === "all" ? [0, 4] : [1])
        it(`destroys only ${kind}: ${targetCard.slug}, own first=${own}, count=${count}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, false, "activation-discount"),
          );
          const candidates = [
            trainingSword,
            hoarfrostSpine,
            fluteOfTaming,
            potionOfHealing,
            chasingShadows,
            chasingShadows,
            oasisTradingPost,
            oasisTradingPost,
            giantTortoise,
            giantTortoise,
          ];
          const field =
            mode === "all" && count === 0
              ? candidates.filter((c) => !eligible.includes(c))
              : candidates;
          const regalia = grandArchiveTestFace(targetCard).typeLine.supertypes.includes("REGALIA");
          const cost = baseCost + (regaliaTax && regalia ? 2 : 0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field,
                hand: [card, targetCard, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                graveyard: [targetCard],
              },
            },
            playerTwo: { champion, zones: { field } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            first = own ? p : q,
            second = own ? q : p;
          const targets = [
            ...first.cards(targetCard, { zone: "field" }),
            ...second.cards(targetCard, { zone: "field" }),
          ];
          const selected = mode === "all" ? targets : targets.slice(0, count);
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const options = {
            reservePayment,
            ...(mode === "all"
              ? {}
              : { targets: { "target-1": selected.map((ref) => ref.objectId) } }),
          };
          if (mode !== "all") {
            const invalid = [
              p.card(champion),
              p.card(targetCard, { zone: "hand" }),
              p.card(targetCard, { zone: "graveyard" }),
              ...candidates
                .filter((c) => !eligible.includes(c))
                .map((c) => p.cards(c, { zone: "field" })[0]!),
            ];
            for (const ref of invalid) {
              const before = game.state;
              expect(() =>
                p.activate(card, { ...options, targets: { "target-1": [ref.objectId] } }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            if (mode === "up-to-three")
              for (const ids of [
                targets.map((ref) => ref.objectId),
                [targets[0]!.objectId, targets[0]!.objectId],
              ]) {
                const before = game.state;
                expect(() =>
                  p.activate(card, { ...options, targets: { "target-1": ids } }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
          }
          const before = game.state;
          expect(() =>
            p.activate(card, { ...options, reservePayment: reservePayment.slice(1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          const objects = [...p.zone("field"), ...q.zone("field")];
          p.activate(card, options);
          for (const ref of objects) expect(game.state.objects[ref.objectId]!.zone).toBe("field");
          passEffectsStack(game);
          const destroyed = new Set(selected.map((ref) => ref.objectId));
          for (const ref of objects) {
            const isRegalia = [trainingSword, fluteOfTaming].some((c) =>
              [...p.cards(c), ...q.cards(c)].some(
                (candidate) => candidate.objectId === ref.objectId,
              ),
            );
            expect(game.state.objects[ref.objectId]!.zone).toBe(
              destroyed.has(ref.objectId) ? (isRegalia ? "banishment" : "graveyard") : "field",
            );
          }
          expect(p.zone("memory")).toHaveLength(cost);
        });
}
