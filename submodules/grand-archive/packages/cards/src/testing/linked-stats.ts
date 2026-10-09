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
import { breakApart } from "../cards/P26/actions/break-apart.ts";

/** Static Effects 1 and Link 1: only the linked host receives the printed stat changes. */
export function proveLinkedStats({
  card,
  host,
  power = 0,
  life = 0,
  classBonus = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  host: "ally" | "weapon";
  power?: number;
  life?: number;
  classBonus?: boolean;
}): void {
  for (const opposingHost of [false, true]) {
    it(`changes only its linked ${host}, opposing=${opposingHost}, and stops after source removal`, () => {
      const face = grandArchiveTestFace(card);
      const cost = face.cost;
      if (cost.kind === "none" || typeof cost.amount !== "number")
        throw new Error("Expected a fixed play cost");
      const material = cost.kind === "memory";
      const hostCard = host === "ally" ? giantTortoise : trainingSword;
      const phantasia = face.typeLine.types.includes("PHANTASIA");
      const removal = phantasia ? soothingDisillusion : breakApart;
      const removalCost = phantasia ? 2 : face.typeLine.supertypes.includes("REGALIA") ? 5 : 3;
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, classBonus, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: material ? "materialize" : "main",
        playerOne: {
          champion,
          zones: {
            field: [hostCard],
            hand: [
              ...(material ? [] : [card]),
              removal,
              ...Array.from(
                { length: removalCost + (material ? 0 : cost.amount) },
                () => woodlandSquirrels,
              ),
            ],
            "material-deck": material ? [card] : [],
            memory: material ? Array.from({ length: cost.amount }, () => woodlandSquirrels) : [],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [hostCard], "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const linkedHost = (opposingHost ? q : p).card(hostCard),
        other = (opposingHost ? p : q).card(hostCard);
      const property = (id: typeof linkedHost.objectId, stat: "power" | "life") =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, stat, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const payments = (amount: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, amount)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      expect(property(linkedHost.objectId, "power")).toBe(1);
      const targets = { "intrinsic-link-target": [linkedHost.objectId] };
      if (material) p.materialize(card, { targets });
      else p.activate(card, { targets, reservePayment: payments(cost.amount) });
      passEffectsStack(game);
      if (material) advanceToMain(game, p.id);
      expect(property(linkedHost.objectId, "power")).toBe(1 + power);
      expect(property(other.objectId, "power")).toBe(1);
      if (host === "ally") {
        expect(property(linkedHost.objectId, "life")).toBe(6 + life);
        expect(property(other.objectId, "life")).toBe(6);
      }
      if (!opposingHost) {
        p.declareAttack(
          host === "ally" ? linkedHost : p.card(champion),
          q.card(champion),
          host === "weapon" ? { weaponIds: [linkedHost.objectId] } : {},
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1 + power);
      }
      const source = p.card(card, { zone: "field" });
      p.activate(removal, {
        reservePayment: payments(removalCost),
        targets: { "target-1": [source.objectId] },
        ...(phantasia ? { modeIds: ["mode-1"] } : {}),
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
      expect(property(linkedHost.objectId, "power")).toBe(1);
      if (host === "ally") expect(property(linkedHost.objectId, "life")).toBe(6);
    });
  }
}
