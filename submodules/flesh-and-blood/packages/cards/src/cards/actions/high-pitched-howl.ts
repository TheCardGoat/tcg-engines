import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/high-pitched-howl.generated.ts";

export const highPitchedHowl = definePitchFamily(fabPitchFamilies["high-pitched-howl"], {
  abilities: () => ({
    triggeredAttackPitchZoneHasCreateTokenVigor: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "pitch-zone-has",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "vigor",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: highPitchedHowlRed,
  yellow: highPitchedHowlYellow,
  blue: highPitchedHowlBlue,
} = highPitchedHowl.cards;
