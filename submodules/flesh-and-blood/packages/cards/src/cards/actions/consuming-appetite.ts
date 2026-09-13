import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/consuming-appetite.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const consumingAppetite = definePitchFamily(fabPitchFamilies["consuming-appetite"], {
  keywords: [bloodDebt],
  abilities: () => ({
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          { class: "effect", type: "banish-self" },
        ],
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "grantedAttack",
            text: "",
            kind: "activated",
            abilityType: "attack",
            cost: { class: "effect", type: "tap-self" },
            layerKeywords: [goAgain],
            effect: {
              type: "attack-with",
              target: { selector: "self" },
            },
          },
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: { name: "Blasmophet, the Insatiable Hunger" },
          count: { type: "all" },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: consumingAppetiteYellow } = consumingAppetite.cards;
