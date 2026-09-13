import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/take-the-tempo.generated.ts";

export const takeTheTempo = definePitchFamily(fabPitchFamilies["take-the-tempo"], {
  abilities: () => ({
    whenHitsVeHitNumber3MoreTimesCombatChainBanishTopDeck: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "compare-amount",
          amount: { type: "count", what: "combat-chain-hits" },
          comparison: { op: "gte", value: 3 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: attackActionFilter(),
              },
              then: {
                type: "optional",
                effect: {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "until-end-of-own-next-turn",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: takeTheTempoRed } = takeTheTempo.cards;
