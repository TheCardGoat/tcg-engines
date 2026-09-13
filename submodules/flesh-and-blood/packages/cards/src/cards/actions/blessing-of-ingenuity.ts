import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-ingenuity.generated.ts";

export const blessingOfIngenuity = definePitchFamily(fabPitchFamilies["blessing-of-ingenuity"], {
  abilities: (_parameter, { pitch }) => ({
    onStartPhaseDestroyMoveCard: {
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
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard", "banished"],
                filter: {
                  name: "Hyper Driver",
                },
                count: { type: "up-to", amount: 4 - Number(pitch) },
              },
              to: {
                zone: "permanent",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfIngenuityRed,
  yellow: blessingOfIngenuityYellow,
  blue: blessingOfIngenuityBlue,
} = blessingOfIngenuity.cards;
