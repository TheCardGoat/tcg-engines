import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "./champion-lineage.ts";
import { requireSingleFace, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { fabledAzuriteFatestone } from "../cards/P25/items/fabled-azurite-fatestone.ts";
import { fabledSapphireFatestone } from "../cards/HVN/items/fabled-sapphire-fatestone.ts";
import { harbingerOfLightning } from "../cards/HVN/allies/harbinger-of-lightning.ts";
import { whirlwindThreads } from "../cards/HVN/actions/whirlwind-threads.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { arcaneBlast } from "../cards/PRD/actions/arcane-blast.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveShenjuElementPermission(card: Card) {
  const cost = grandArchiveTestFace(card).cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected fixed cost");
  const amount = cost.amount;
  for (const enabled of [false, true])
    for (const mode of ["none", "front", "own", "opponent", "water", "graveyard", "non-shenju"])
      it(`requires an own arcane Shenju ally: native element=${enabled}, support=${mode}`, () => {
        const base = lineageTestChampion("Element permission", 0);
        const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
          ...base,
          layout: {
            kind: "single-faced",
            face: {
              ...requireSingleFace(base),
              elements: enabled ? ["NORM", "WIND", "ARCANE"] : ["NORM", "WIND"],
            },
          },
        };
        const stone = mode === "water" ? fabledSapphireFatestone : fabledAzuriteFatestone;
        const ownField = [
          grayWolf,
          ...(["front", "own", "water"].includes(mode) ? [stone] : []),
          ...(mode === "non-shenju" ? [harbingerOfLightning] : []),
        ];
        const preparation = [
          ...Array.from({ length: 10 }, () => whirlwindThreads),
          ...Array.from({ length: 30 }, () => woodlandSquirrels),
        ];
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: mode === "opponent" ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: ownField,
              hand: [card, arcaneBlast, ...preparation],
              graveyard: mode === "graveyard" ? [stone] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: mode === "opponent" ? [stone] : [],
              hand: preparation,
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card, { zone: "hand" });
        const pay = (player: typeof p, n: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const options =
          card.slug === "harness-lightning"
            ? { modeIds: ["mode-1"] }
            : card.slug === "seiryuus-command"
              ? { targets: { "target-beast": [p.card(grayWolf).objectId] } }
              : {};
        if (["own", "water", "opponent"].includes(mode)) {
          const controller = mode === "opponent" ? q : p;
          if (!enabled && controller === p) {
            const before = game.state;
            expect(() =>
              p.activate(source, { ...options, reservePayment: pay(p, amount) }),
            ).toThrow(/element/i);
            expect(game.state).toEqual(before);
          }
          const required = mode === "water" ? 9 : 10;
          for (const thread of controller
            .cards(whirlwindThreads, { zone: "hand" })
            .slice(0, required)) {
            controller.activate(thread, { reservePayment: pay(controller, 1) });
            passEffectsStack(game);
          }
          const support = controller.card(stone, { zone: "field" });
          expect(
            game.state.objects[controller.card(champion).objectId]!.counters["named:quest"],
          ).toBe(required);
          controller.activateAbility(support, `${stone.canonicalId}-a4`);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
          expect(game.state.objects[support.objectId]!.face).toBe("transformed");
          if (mode === "opponent") advanceToMain(game, p.id);
        }
        const allowed = enabled || mode === "own";
        const before = game.state;
        if (!allowed) {
          expect(() => p.activate(source, { ...options, reservePayment: pay(p, amount) })).toThrow(
            /element/i,
          );
          expect(game.state).toEqual(before);
          return;
        }
        if (!enabled) {
          expect(() =>
            p.activate(arcaneBlast, {
              reservePayment: pay(p, 11),
              targets: { "target-1": [q.card(champion).objectId] },
            }),
          ).toThrow(/element/i);
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, { ...options, reservePayment: pay(p, amount - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const memory = p.zone("memory").length;
        p.activate(source, { ...options, reservePayment: pay(p, amount) });
        expect(p.zone("memory")).toHaveLength(memory + amount);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[source.objectId]!.zone).toBe(
          card.slug === "harbinger-of-lightning"
            ? "field"
            : card.slug === "harness-lightning"
              ? "banishment"
              : "graveyard",
        );
      });
}
