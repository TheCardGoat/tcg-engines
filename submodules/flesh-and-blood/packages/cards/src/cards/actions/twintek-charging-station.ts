import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/twintek-charging-station.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const twintekChargingStation = definePitchFamily(
  fabPitchFamilies["twintek-charging-station"],
  {
    keywords: [goAgain],
    abilities: () => ({
      nextAttackBoostTurnGetsNumber3Power: {
        kind: "resolution",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 3,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
              hasStatus: "boosted",
            },
          },
        },
      },
      shuffleHyperDriverFromGraveyardIntoDeckDoGainResource: {
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
                    name: "Hyper Driver",
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
          then: {
            type: "gain-resources",
            amount: 1,
          },
        },
      },
    }),
  },
);

export const { red: twintekChargingStationRed } = twintekChargingStation.cards;
