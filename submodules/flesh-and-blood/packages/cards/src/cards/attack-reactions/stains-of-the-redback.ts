import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/stains-of-the-redback.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stainsOfTheRedback = definePitchFamily(fabPitchFamilies["stains-of-the-redback"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    markedCost: {
      kind: "static",
      staticKind: "play",
      condition: { type: "is-marked", target: { selector: "defending-hero" } },
      playEffect: {
        role: "cost-reduction",
        cost: { class: "asset", type: "resources", amount: 1 },
      },
    },
    stealthBoost: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { subtypes: ["Attack"] }, hasKeyword: "stealth" },
            count: 1,
          },
          duration: "this-turn",
        },
        {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { subtypes: ["Attack"] }, hasKeyword: "stealth" },
            count: 1,
          },
          duration: "this-turn",
        },
      ],
      outputBinding: "it",
    },
  }),
});
export const {
  red: stainsOfTheRedbackRed,
  yellow: stainsOfTheRedbackYellow,
  blue: stainsOfTheRedbackBlue,
} = stainsOfTheRedback.cards;
