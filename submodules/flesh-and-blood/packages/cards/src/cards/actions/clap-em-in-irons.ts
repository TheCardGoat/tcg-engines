import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/clap-em-in-irons.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const clapEmInIrons = definePitchFamily(fabPitchFamilies["clap-em-in-irons"], {
  keywords: [goAgain],
  abilities: () => ({
    whenEntersArenaTargetPirateHeroAllyCanT: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "tap",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["hero", "permanent"],
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Pirate"],
                      },
                    },
                    {
                      or: [
                        {
                          typeBox: {
                            types: ["Hero"],
                          },
                        },
                        {
                          typeBox: {
                            subtypes: ["Ally"],
                          },
                        },
                      ],
                    },
                  ],
                },
                count: 1,
              },
              outputBinding: "tapped-pirate",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "untap",
              subject: {
                selector: "binding",
                binding: "tapped-pirate",
              },
              duration: "while-in-arena",
            },
          ],
        },
      },
    },
    atStartTurnDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});
export const { blue: clapEmInIronsBlue } = clapEmInIrons.cards;
