import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/engaged-swiftblade.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const engagedSwiftblade = definePitchFamily(fabPitchFamilies["engaged-swiftblade"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Warrior"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "staticWhileHasStatusDefendedByAttackActionGrantProperty",
                text: "",
                kind: "static",
                staticKind: "while",
                condition: {
                  type: "has-status",
                  status: "defended-by-attack-action",
                },
                effect: {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: goAgain,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Warrior"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});
export const {
  red: engagedSwiftbladeRed,
  yellow: engagedSwiftbladeYellow,
  blue: engagedSwiftbladeBlue,
} = engagedSwiftblade.cards;
