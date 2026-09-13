import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-duplicity.generated.ts";

export const tomeOfDuplicity = definePitchFamily(fabPitchFamilies["tome-of-duplicity"], {
  abilities: () => ({
    lookAtTopNumber2DeckBanishOneSNonAttackActionPlay: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 2,
            },
          },
          {
            // "then banish one" from the looked cohort (`revealed-this-way`).
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              filter: { inObjectBinding: "revealed-this-way" },
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
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
                asType: "instant",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: tomeOfDuplicityBlue } = tomeOfDuplicity.cards;
