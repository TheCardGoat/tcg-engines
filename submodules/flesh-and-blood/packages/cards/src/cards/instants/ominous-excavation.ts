import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ominous-excavation.generated.ts";

export const ominousExcavation = definePitchFamily(fabPitchFamilies["ominous-excavation"], {
  abilities: () => ({
    mayShuffleInstantFromGraveyardIntoDeck: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    types: ["Instant"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "deck",
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
    ifAuraControlWasDestroyedTurnCreatePonderToken: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "destroy-aura", player: "controller" },
      effect: {
        type: "create-token",
        token: "ponder",
        controller: "controller",
      },
    },
  }),
});

export const { blue: ominousExcavationBlue } = ominousExcavation.cards;
