import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/chromatic-refinement.generated.ts";

export const chromaticRefinement = definePitchFamily(fabPitchFamilies["chromatic-refinement"], {
  parameters: pitchMap({
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  }),
  abilities: ({ color }) => ({
    refineNextCard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            { type: "destroy", target: { selector: "self" } },
            {
              type: "modify-numeric",
              property: "cost",
              op: "subtract",
              amount: 1,
              target: { selector: "self" },
              duration: "this-turn",
              appliesTo: { next: { color: [color] } },
            },
            {
              type: "replacement",
              replacementKind: "standard",
              replaces: { name: "damage" },
              modification: {
                type: "modify-numeric",
                property: "count",
                op: "add",
                amount: 1,
                target: { selector: "self" },
                duration: "permanent",
              },
              duration: "this-turn",
              appliesTo: { next: { color: [color] } },
              limit: { count: 1, per: "turn" },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: chromaticRefinementRed,
  yellow: chromaticRefinementYellow,
  blue: chromaticRefinementBlue,
} = chromaticRefinement.cards;
