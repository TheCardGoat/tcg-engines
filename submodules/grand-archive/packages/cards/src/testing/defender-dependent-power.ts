import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stockedOutpost } from "../cards/RDO/domains/stocked-outpost.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
export function proveDefenderDependentPower(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mode: "domain" | "champion" | "even-life" | "odd-life",
  bonus: number,
  lineageName?: string,
) {
  for (const targetKind of ["even-champion", "odd-champion", "even-ally", "odd-ally", "domain"]) {
    it(`applies power only while attacking ${targetKind}`, () => {
      const own = lineageName
        ? lineageTestChampion(lineageName, 0)
        : createClassBonusTestChampion(card, false, "activation-discount");
      const foe =
        targetKind === "odd-champion"
          ? createClassBonusTestChampion(card, false, "activation-discount")
          : lineageTestChampion("Other", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: own,
          zones: { field: [card], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion: foe,
          zones: {
            field: [giantTortoise, woodlandSquirrels, stockedOutpost],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      const target = q.card(
        targetKind === "domain"
          ? stockedOutpost
          : targetKind === "even-ally"
            ? giantTortoise
            : targetKind === "odd-ally"
              ? woodlandSquirrels
              : foe,
        { zone: "field" },
      );
      const base = grandArchiveTestFace(card).stats.power!;
      const enabled =
        mode === "domain"
          ? targetKind === "domain"
          : mode === "champion"
            ? targetKind.endsWith("champion")
            : targetKind.startsWith(mode === "even-life" ? "even" : "odd");
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(power()).toBe(base);
      const history = game.state.eventHistory.length;
      p.declareAttack(source, target);
      expect(power()).toBe(base + (enabled ? bonus : 0));
      game.resolveCombatWithoutRetaliation();
      const hits = game.state.eventHistory.slice(history).filter((e) => e.type === "damage-marked");
      expect(hits).toHaveLength(1);
      expect(hits[0]!.amount).toBe(base + (enabled ? bonus : 0));
      if (targetKind === "domain") {
        expect(hits[0]!.asDurabilityLoss).toBe(true);
        expect(hits[0]!.durabilityRemoved).toBe(Math.min(4, base + (enabled ? bonus : 0)));
      }
      expect(power()).toBe(base);
      expect(game.state.combat).toBeNull();
    });
  }
}
