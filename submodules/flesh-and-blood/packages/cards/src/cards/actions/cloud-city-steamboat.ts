import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cloud-city-steamboat.generated.ts";

export const cloudCitySteamboat = definePitchFamily(fabPitchFamilies["cloud-city-steamboat"], {
  abilities: () => ({
    onHitTapAddCounter: {
      kind: "static",
      staticKind: "triggered",
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
          type: "optional",
          effect: {
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Cog"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Cog"],
                },
              },
              count: 1,
            },
          },
        },
      },
    },
    tapModifyNumericPowerActivation: {
      kind: "activated",
      limit: {
        count: 2,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap",
        filter: {
          typeBox: {
            subtypes: ["Cog"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: cloudCitySteamboatRed,
  yellow: cloudCitySteamboatYellow,
  blue: cloudCitySteamboatBlue,
} = cloudCitySteamboat.cards;
