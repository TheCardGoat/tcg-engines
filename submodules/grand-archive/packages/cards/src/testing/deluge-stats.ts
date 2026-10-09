import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { dredgingStreams } from "../cards/SP4/actions/dredging-streams.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";

export function proveDelugeStats(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
  powerBonus: number,
  lifeBonus = 0,
) {
  const face = grandArchiveTestFace(card),
    attack = face.typeLine.types.includes("ATTACK");
  for (const mode of ["below", "at", "above", "enter", "leave"] as const) {
    it(`checks own WATER graveyard threshold and combat: ${mode}`, () => {
      const water =
        mode === "below" || mode === "enter"
          ? threshold - 1
          : mode === "above"
            ? threshold + 1
            : threshold;
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: attack ? [] : [card],
            hand: [
              ...(attack ? [card] : []),
              glacialGuidance,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            graveyard: [
              ...Array.from({ length: water }, () => glacialGuidance),
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            memory: [glacialGuidance],
            banishment: [glacialGuidance],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            hand: [dredgingStreams, woodlandSquirrels, woodlandSquirrels],
            graveyard: Array.from({ length: threshold + 1 }, () => glacialGuidance),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      const stats = (enabled: boolean) => {
        for (const [property, bonus] of [
          ["power", powerBonus],
          ["life", lifeBonus],
        ] as const) {
          if (face.stats[property] === undefined) continue;
          expect(
            deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            }),
          ).toBe(face.stats[property]! + (enabled ? bonus : 0));
        }
      };
      const payment = (amount: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, amount)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (attack) {
        p.activate(source, {
          attackAttackerId: p.card(champion).objectId,
          reservePayment: payment(2),
        });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          p.card(champion).objectId,
          q.card(champion).objectId,
          "Declare Deluge attack",
        );
      }
      stats(water >= threshold);
      if (mode === "enter") {
        const guidance = p.card(glacialGuidance, { zone: "hand" });
        p.activate(guidance, {
          reservePayment: payment(1),
          targets: { "target-1": [q.card(giantTortoise).objectId] },
        });
        stats(false);
        passEffectsStack(game);
        expect(p.zone("graveyard")).toContainEqual(guidance);
        stats(true);
      }
      if (mode === "leave") {
        const removed = p.cards(glacialGuidance, { zone: "graveyard" })[0]!;
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        q.activate(dredgingStreams, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-card": [removed.objectId] },
        });
        stats(true);
        passEffectsStack(game);
        expect(p.zone("banishment")).toContainEqual(removed);
        stats(false);
      }
      const enabled = mode === "enter" || mode === "at" || mode === "above";
      if (!attack) p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
        face.stats.power! + (enabled ? powerBonus : 0),
      );
      if (!attack) stats(enabled);
    });
  }
  if (lifeBonus > 0)
    it("defeats the damaged ally when Deluge life is lost", () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(sparkAlight, face.stats.life === 3, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            graveyard: Array.from({ length: threshold }, () => glacialGuidance),
            hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [dredgingStreams, woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      p.activate(sparkAlight, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.damage).toBe(face.stats.life);
      expect(p.zone("field")).toContainEqual(source);
      const removed = p.cards(glacialGuidance, { zone: "graveyard" })[0]!;
      p.pass();
      q.activate(dredgingStreams, {
        reservePayment: q
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-card": [removed.objectId] },
      });
      passEffectsStack(game);
      expect(p.zone("banishment")).toContainEqual(removed);
      expect(p.zone("graveyard")).toContainEqual(source);
      expect(p.zone("field")).not.toContainEqual(source);
    });
}
