import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/loyalty-beyond-the-grave.generated.ts";

export const loyaltyBeyondTheGrave = definePitchFamily(
  fabPitchFamilies["loyalty-beyond-the-grave"],
  {
    abilities: () => ({
      drawByBanishingCopies: {
        kind: "static",
        staticKind: "triggered",
        functionalZones: ["graveyard"],
        trigger: {
          kind: "event-and-state",
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
          state: {
            type: "has-status",
            status: "in-your-graveyard",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  name: "Loyalty Beyond The Grave",
                },
                count: 2,
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        },
      },
    }),
  },
);

export const { red: loyaltyBeyondTheGraveRed } = loyaltyBeyondTheGrave.cards;
