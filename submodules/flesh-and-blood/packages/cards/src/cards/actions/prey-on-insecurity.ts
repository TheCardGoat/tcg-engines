import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prey-on-insecurity.generated.ts";
import { stealth } from "../shared/keywords.ts";

export const preyOnInsecurity = definePitchFamily(fabPitchFamilies["prey-on-insecurity"], {
  keywords: [stealth],
  abilities: () => ({
    reaction: {
      kind: "activated",
      functionalZones: ["combat-chain"],
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "effect", type: "move-to-deck", from: "hand", position: "bottom", count: 1 },
          { class: "effect", type: "destroy-self" },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["combat-chain"],
          filter: { hasKeyword: "stealth", hasStatus: "attacking" },
          count: 1,
        },
        duration: "this-chain-link",
      },
    },
  }),
});

export const { red: preyOnInsecurityRed } = preyOnInsecurity.cards;
