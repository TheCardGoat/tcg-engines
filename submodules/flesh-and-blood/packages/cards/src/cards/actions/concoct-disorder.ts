import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/concoct-disorder.generated.ts";

export const concoctDisorder = definePitchFamily(fabPitchFamilies["concoct-disorder"], {
  abilities: () => ({
    onAttackMoveCardGrantProperty: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "each",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "arsenal",
                visibility: "face-down",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "put-into-arsenal-this-way-count",
                comparison: { op: "gte", value: 2 },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "self",
                },
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
  red: concoctDisorderRed,
  yellow: concoctDisorderYellow,
  blue: concoctDisorderBlue,
} = concoctDisorder.cards;
