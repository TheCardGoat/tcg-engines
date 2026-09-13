import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/felling-of-the-crown.generated.ts";

export const fellingOfTheCrown = definePitchFamily(fabPitchFamilies["felling-of-the-crown"], {
  abilities: () => ({
    ifThereAre4MoreEarthBanishedZoneGets: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        filter: {
          typeBox: {
            supertypes: ["Earth"],
          },
        },
        comparison: {
          op: "gte",
          value: 4,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    whenAttacksMayBanish2EarthActionFromGraveyard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    typeBox: {
                      supertypes: ["Earth"],
                    },
                  },
                  count: 2,
                },
              },
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                  count: 1,
                },
              },
            ],
          },
          then: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "each",
              zones: ["hand"],
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
      label: {
        name: "decompose",
      },
    },
  }),
});
export const { red: fellingOfTheCrownRed } = fellingOfTheCrown.cards;
