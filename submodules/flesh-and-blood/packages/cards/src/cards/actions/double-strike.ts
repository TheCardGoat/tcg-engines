import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/double-strike.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const doubleStrike = definePitchFamily(fabPitchFamilies["double-strike"], {
  keywords: [goAgain],
  abilities: () => ({
    whenDoubleStrikeSChainLinkResolvesBanishMay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "chain-link-resolve",
          actor: {
            kind: "any",
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
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "self",
              },
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-combat-chain",
              },
              then: {
                type: "remove-property",
                property: {
                  kind: "abilities",
                },
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: doubleStrikeRed } = doubleStrike.cards;
