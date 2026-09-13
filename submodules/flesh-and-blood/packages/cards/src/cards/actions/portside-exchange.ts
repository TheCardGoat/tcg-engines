import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/portside-exchange.generated.ts";

/** Model notes (hand-authored): "If a yellow card is discarded this way"
 * binds the discard output ("it") and matches color yellow. The generated
 * has-status discarded-this-way-yellow-card is never stamped by any reducer. */
export const portsideExchange = definePitchFamily(fabPitchFamilies["portside-exchange"], {
  keywords: [goAgain],
  abilities: () => ({
    discardThenDrawYellowDiscardedWayCreateGoldToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: ["yellow"],
              },
            },
            then: {
              type: "create-token",
              token: "gold",
              controller: "controller",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: portsideExchangeBlue } = portsideExchange.cards;
