import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/visit-the-boneyard.generated.ts";

export const visitTheBoneyard = definePitchFamily(fabPitchFamilies["visit-the-boneyard"], {
  abilities: () => ({
    put6MoreFromGraveyardTopDeck: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["graveyard"],
          filter: {
            power: { op: "gte", value: 6 },
          },
          count: 1,
        },
        to: {
          zone: "deck",
          position: "top",
        },
      },
    },
    createVigorToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "vigor",
        controller: "controller",
      },
    },
  }),
});

export const { blue: visitTheBoneyardBlue } = visitTheBoneyard.cards;
