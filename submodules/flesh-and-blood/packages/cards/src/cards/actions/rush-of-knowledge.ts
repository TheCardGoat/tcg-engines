import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rush-of-knowledge.generated.ts";
import { phantasm } from "../shared/keywords.ts";

export const rushOfKnowledge = definePitchFamily(fabPitchFamilies["rush-of-knowledge"], {
  supertypeSets: [["Illusionist"], ["Wizard"]],
  keywords: [phantasm],
  abilities: () => ({
    ponder: {
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
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: { name: "Ponder" },
              count: 1,
            },
          },
          then: {
            type: "sequence",
            steps: [
              { type: "draw", count: 1, player: "controller" },
              { type: "gain-action-points", amount: 1, target: "controller" },
            ],
          },
        },
      },
    },
  }),
});
export const { blue: rushOfKnowledgeBlue } = rushOfKnowledge.cards;
