import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/goon-battery.generated.ts";

export const goonBattery = definePitchFamily(fabPitchFamilies["goon-battery"], {
  abilities: () => ({
    ifControl3MoreAurasGets3WhenHits: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          typeBox: {
            subtypes: ["Aura"],
          },
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroThem",
                text: "",
                trigger: {
                  kind: "event",
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
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "tap",
                    target: {
                      selector: "attack-target",
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const { blue: goonBatteryBlue } = goonBattery.cards;
