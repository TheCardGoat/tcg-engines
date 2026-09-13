import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/embrace-ursur.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const embraceUrsur = definePitchFamily(fabPitchFamilies["embrace-ursur"], {
  abilities: () => ({
    embrace: {
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: { typeBox: { supertypes: ["Runeblade"] } },
                },
                then: { type: "create-token", token: "runechant", controller: "controller" },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: { typeBox: { supertypes: ["Shadow"] } },
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
    },
  }),
});
export const {
  red: embraceUrsurRed,
  yellow: embraceUrsurYellow,
  blue: embraceUrsurBlue,
} = embraceUrsur.cards;
