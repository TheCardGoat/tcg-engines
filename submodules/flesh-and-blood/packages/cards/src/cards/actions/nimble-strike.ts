import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nimble-strike.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const nimbleStrike = definePitchFamily(fabPitchFamilies["nimble-strike"], {
  abilities: () => ({
    playBanishNimblismSequenceModifyNumericPowerThisTurnGrantPropertyThisTurn: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 1,
          filter: {
            name: "Nimblism",
          },
        },
        optional: true,
        then: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
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
          ],
        },
      },
    },
  }),
});

export const {
  red: nimbleStrikeRed,
  yellow: nimbleStrikeYellow,
  blue: nimbleStrikeBlue,
} = nimbleStrike.cards;
