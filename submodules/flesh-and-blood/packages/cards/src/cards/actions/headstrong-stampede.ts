import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/headstrong-stampede.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const headstrongStampede = definePitchFamily(fabPitchFamilies["headstrong-stampede"], {
  abilities: () => ({
    whenAttacksRevealTopGrantGoAgainIfSixBasePower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  numeric: [
                    { property: "power", basis: "base", comparison: { op: "gte", value: 6 } },
                  ],
                },
              },
              then: {
                type: "grant-property",
                property: { kind: "keyword", keyword: goAgain },
                target: { selector: "self" },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: headstrongStampedeRed,
  yellow: headstrongStampedeYellow,
  blue: headstrongStampedeBlue,
} = headstrongStampede.cards;
