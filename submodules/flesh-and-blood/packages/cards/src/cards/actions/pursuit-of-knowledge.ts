import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pursuit-of-knowledge.generated.ts";

export const pursuitOfKnowledge = definePitchFamily(fabPitchFamilies["pursuit-of-knowledge"], {
  abilities: () => ({
    hitsGets1IntellectEndTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "modify-numeric",
          property: "intellect",
          op: "add",
          amount: 1,
          target: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { blue: pursuitOfKnowledgeBlue } = pursuitOfKnowledge.cards;
