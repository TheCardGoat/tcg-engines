import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/light-the-way.generated.ts";

export const lightTheWay = definePitchFamily(fabPitchFamilies["light-the-way"], {
  abilities: () => ({
    charge: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "charge",
        },
        optional: true,
      },
      label: {
        name: "charge",
      },
    },
    refundOnYellowCharge: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
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
          type: "binding-matches",
          binding: "chargedCard",
          filter: { color: ["yellow"] },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      label: {
        name: "charge",
      },
    },
  }),
});

export const {
  red: lightTheWayRed,
  yellow: lightTheWayYellow,
  blue: lightTheWayBlue,
} = lightTheWay.cards;
