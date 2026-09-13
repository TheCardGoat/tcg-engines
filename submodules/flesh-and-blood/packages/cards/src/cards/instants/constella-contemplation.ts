import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/constella-contemplation.generated.ts";

export const constellaContemplation = definePitchFamily(
  fabPitchFamilies["constella-contemplation"],
  {
    abilities: () => ({
      createPonderToken: {
        kind: "resolution",
        effect: {
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
      ifInstantHasBeenPutIntoGraveyardTurnDeal: {
        kind: "resolution",
        condition: {
          type: "zone-count",
          zone: "graveyard",
          player: "controller",
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
          per: "turn",
        },
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "any-hero",
          },
        },
        label: {
          name: "starfall",
        },
      },
    }),
  },
);

export const { yellow: constellaContemplationYellow } = constellaContemplation.cards;
