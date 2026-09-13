import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-cremation.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talismanOfCremation = definePitchFamily(fabPitchFamilies["talisman-of-cremation"], {
  keywords: [goAgain],
  abilities: () => ({
    whenPlayFromBanishedZoneDestroyTalismanCremationNameBanishAllWith: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                {
                  type: "name-card",
                  suggestions: ["opponent-graveyard"],
                },
              ],
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["graveyard"],
                filter: {
                  hasStatus: "chosen-name",
                },
                count: {
                  type: "all",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: talismanOfCremationBlue } = talismanOfCremation.cards;
