import { woodlandSquirrels } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

const makeChampion = (
  onField: boolean,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> => ({
  canonicalId: "sacrifice-zone-champion",
  slug: "sacrifice-zone-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sacrifice-zone-champion:face:default",
      catalogId: "sacrifice-zone-champion",
      name: "Sacrifice Fixture",
      cost: { kind: "memory", amount: 0 },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
      rulesText: "",
      abilities: [
        {
          id: "sacrificeZone-a1",
          kind: "activated",
          activation: "ability",
          text: "Sacrifice the chosen object only from the field.",
          cost: { kind: "pay-reserve", amount: 0 },
          targets: [
            {
              id: "card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: onField
                ? {
                    kind: "object",
                    zones: ["field"],
                    relationship: "controlled-by",
                    player: "controller",
                  }
                : {
                    kind: "card",
                    zones: ["hand", "memory", "graveyard", "banishment"],
                    relationship: "zone-of",
                    player: "controller",
                  },
            },
          ],
          effect: {
            kind: "sacrifice",
            subject: { kind: "bound", binding: "card" },
          },
        },
      ],
    },
  },
});

describe("Sacrifice applies only to objects on the field", () => {
  for (const zone of ["field", "hand", "memory", "graveyard", "banishment"] as const)
    it(`resolves against a card in ${zone}`, () => {
      const champion = makeChampion(zone === "field");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { [zone]: [woodlandSquirrels] } },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        card = p.card(woodlandSquirrels);
      const incarnation = game.state.objects[card.objectId]!.incarnation;
      p.activateAbility(champion, "sacrificeZone-a1", { targets: { card: [card.objectId] } });
      expect(game.state.objects[card.objectId]!.zone).toBe(zone);
      for (let step = 0; game.state.stack.length && step < 16; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.objects[card.objectId]!.zone).toBe(zone === "field" ? "graveyard" : zone);
      if (zone === "field") {
        expect(game.state.objects[card.objectId]!.incarnation).toBeGreaterThan(incarnation);
      } else expect(game.state.objects[card.objectId]!.incarnation).toBe(incarnation);
    });
});
