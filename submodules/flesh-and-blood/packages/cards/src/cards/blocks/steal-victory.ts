import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/steal-victory.generated.ts";

export const stealVictory = definePitchFamily(fabPitchFamilies["steal-victory"], {
  abilities: () => ({
    stealAuraTokenOnDefend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-control",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["permanent"],
            filter: {
              typeBox: {
                metatypes: ["Token"],
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
          controller: "controller",
          duration: "this-turn",
        },
      },
      label: {
        name: "steal",
      },
    },
  }),
});

export const { blue: stealVictoryBlue } = stealVictory.cards;
