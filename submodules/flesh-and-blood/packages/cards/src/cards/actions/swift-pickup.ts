import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/swift-pickup.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const swiftPickup = definePitchFamily(fabPitchFamilies["swift-pickup"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksPutShurikenItemFromGraveyardOnBottomDeckDoGets: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Shuriken"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                ],
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          then: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const { red: swiftPickupRed } = swiftPickup.cards;
