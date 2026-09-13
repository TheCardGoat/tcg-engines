import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stir-the-aetherwinds.generated.ts";

export const stirTheAetherwinds = definePitchFamily(fabPitchFamilies["stir-the-aetherwinds"], {
  parameters: pitchMap({ red: { bonus: 3 }, yellow: { bonus: 2 }, blue: { bonus: 1 } }),
  abilities: ({ bonus }) => ({
    resolutionOptional: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "play-card",
              fromZones: ["hand"],
              source: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Wizard"],
                      },
                    },
                    {
                      typeBox: {
                        excludeSubtypes: ["Attack"],
                      },
                    },
                  ],
                },
              },
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Action"],
                  },
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Wizard"],
                      },
                    },
                    {
                      typeBox: {
                        excludeSubtypes: ["Attack"],
                      },
                    },
                  ],
                },
              },
              duration: "this-turn",
              asType: "instant",
            },
            {
              type: "replacement",
              replacementKind: "standard",
              replaces: {
                name: "damage",
                damageType: "arcane",
              },
              modification: {
                type: "modify-numeric",
                property: "count",
                op: "add",
                amount: bonus,
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: stirTheAetherwindsRed,
  yellow: stirTheAetherwindsYellow,
  blue: stirTheAetherwindsBlue,
} = stirTheAetherwinds.cards;
