import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/northern-winds.generated.ts";

export const northernWinds = definePitchFamily(fabPitchFamilies["northern-winds"], {
  keywords: [
    {
      name: "specialization",
      hero: "Oldhim",
    },
  ],
  abilities: () => ({
    freezeUp1EquipmentItemAllyStartNextTurn: {
      kind: "resolution",
      effect: {
        type: "freeze",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "each",
          zones: ["permanent"],
          filter: {
            or: [
              {
                typeBox: {
                  types: ["Equipment"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Item"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
            ],
          },
          count: { type: "up-to", amount: 1 },
        },
        duration: "until-start-of-own-next-turn",
      },
      label: {
        name: "freeze",
      },
    },
    defendsTogetherHandCreateSpellbaneAegisTokenAnyNumber: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "spellbane-aegis",
          controller: "any",
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});

export const { blue: northernWindsBlue } = northernWinds.cards;
