import { describe, expect, it } from "vitest";
import { companionFatestone } from "./companion-fatestone.ts";

import { proveRetortCard } from "../../../testing/retort-card.ts";
/** @covers vb9xebivoe-a2 */
describe("companionFatestone Retort", () => proveRetortCard(companionFatestone, 2, "companion"));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { fluvialFatestone } from "../../HVN/items/fluvial-fatestone.ts";

/** @covers izf4wdsbz9-a1 */
describe("Companion Fatestone — own source or Fatebound ally", () => {
  for (const mode of ["self-only", "self-with-ally", "fatebound"] as const)
    it(`chooses at resolution: ${mode}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Guo Jia", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [companionFatestone, fluvialFatestone, giantTortoise],
            hand: [companionFatestone, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion, zones: { field: [giantTortoise] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(companionFatestone, { zone: "hand" });
      const other = p.card(companionFatestone, { zone: "field" });
      const fluvial = p.card(fluvialFatestone);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (mode !== "self-only") {
        p.activateAbility(fluvial, "3h93tgm72l-a3", { reservePayment: pay(4) });
        passEffectsStack(game);
        expect(game.state.objects[fluvial.objectId]!.face).toBe("transformed");
      }
      p.activate(source, { reservePayment: pay(3) });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      for (const invalid of [
        other,
        p.card(giantTortoise),
        q.card(giantTortoise),
        p.card(champion),
        ...(mode === "self-only" ? [fluvial] : []),
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
        expect(game.state).toEqual(before);
      }
      const chosen = mode === "fatebound" ? fluvial : source;
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[fluvial.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const beforePower = power();
      answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
      passEffectsStack(game);
      for (const ref of [source, other, fluvial, p.card(giantTortoise), q.card(giantTortoise)])
        expect(game.state.objects[ref.objectId]!.counters.buff ?? 0).toBe(
          ref.objectId === chosen.objectId ? 1 : 0,
        );
      if (mode === "fatebound") expect(power()).toBe(beforePower! + 1);
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
    });
});
