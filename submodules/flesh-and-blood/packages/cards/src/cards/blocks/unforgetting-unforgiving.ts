import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/unforgetting-unforgiving.generated.ts";

export const unforgettingUnforgiving = definePitchFamily(
  fabPitchFamilies["unforgetting-unforgiving"],
  {
    keywords: [
      {
        name: "specialization",
        hero: "Jarl",
      },
    ],
    abilities: () => ({
      findMangleOnDefend: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
          state: {
            type: "zone-count",
            zone: "permanent",
            player: "attacking-hero",
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
              hasCounter: "-1{d}",
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "search",
                  zones: ["deck"],
                  filter: {
                    name: "Mangle",
                  },
                  mayFail: true,
                  to: {
                    zone: "banished",
                  },
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
              {
                type: "optional",
                effect: {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "during-own-next-action-phase",
                },
              },
            ],
          },
        },
      },
    }),
  },
);

export const { red: unforgettingUnforgivingRed } = unforgettingUnforgiving.cards;
