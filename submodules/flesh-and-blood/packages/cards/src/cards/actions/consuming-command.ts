import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/consuming-command.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const consumingCommand = definePitchFamily(fabPitchFamilies["consuming-command"], {
  keywords: [goAgain, bloodDebt],
  abilities: () => ({
    grantBlasmophetAttack: {
      kind: "resolution",
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

export const { blue: consumingCommandBlue } = consumingCommand.cards;
