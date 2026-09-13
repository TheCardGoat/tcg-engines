import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flying-high.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const flyingHigh = definePitchFamily(fabPitchFamilies["flying-high"], {
  parameters: pitchMap({
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  }),
  abilities: ({ color }) => ({
    empowerNextAttack: {
      type: "sequence",
      steps: [
        {
          type: "grant-property",
          property: { kind: "keyword", keyword: goAgain },
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: {}, events: ["attack"] },
        },
        {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: { kind: "player", player: "ability-controller" },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: { kind: "any" },
                bindAs: "it",
              },
            },
          },
          policy: { kind: "windowed", duration: "this-turn", matching: "first" },
          resolution: {
            kind: "effect",
            effect: {
              type: "conditional",
              condition: { type: "binding-matches", binding: "it", filter: { color: [color] } },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: { selector: "this-attack" },
                duration: "this-turn",
              },
            },
          },
        },
      ],
    },
  }),
});

export const {
  red: flyingHighRed,
  yellow: flyingHighYellow,
  blue: flyingHighBlue,
} = flyingHigh.cards;
