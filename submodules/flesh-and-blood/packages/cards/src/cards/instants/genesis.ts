import { spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/genesis.generated.ts";

export const genesis = definePitchFamily(fabPitchFamilies["genesis"], {
  keywords: [spectra],
  abilities: () => ({
    atStartTurnMayPutFromHandIntoSoul: {
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
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                to: {
                  zone: "soul",
                },
                outputBinding: "it",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    supertypes: ["Illusionist"],
                  },
                },
              },
              then: {
                type: "create-token",
                token: "spectral-shield",
                controller: "controller",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    supertypes: ["Light"],
                  },
                },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: genesisYellow } = genesis.cards;
