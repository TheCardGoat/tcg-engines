import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-oblation.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfOblation = definePitchFamily(fabPitchFamilies["amulet-of-oblation"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletOblationUntilEndTurnTargetAttack: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "any",
        comparison: { op: "gte", value: 1 },
        per: "turn",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "ifWouldBePutIntoGraveyardInsteadPutBottom",
            text: "",
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "replacement",
              replacementKind: "standard",
              replaces: {
                name: "move-zone",
                to: "graveyard",
                subject: "self",
              },
              modification: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
              duration: "while-in-arena",
            },
          },
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                typeBox: {
                  types: ["Action"],
                },
              },
            ],
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});
export const { blue: amuletOfOblationBlue } = amuletOfOblation.cards;
