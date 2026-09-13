import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/display-of-artistry.generated.ts";

export const displayOfArtistry = definePitchFamily(fabPitchFamilies["display-of-artistry"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    boostWeaponAndReduceDefenseIfSharpened: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { types: ["Weapon"] } },
            count: 1,
          },
          duration: "this-chain-link",
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "has-status",
            status: "sharpened",
            target: { selector: "binding", binding: "it" },
          },
          then: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "continuous",
                id: "reduceDefendingReactionDefense",
                text: "",
                effect: {
                  type: "modify-numeric",
                  property: "defense",
                  op: "subtract",
                  amount: 1,
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "any",
                    zones: ["combat-chain"],
                    filter: {
                      or: [
                        { typeBox: { types: ["Attack Reaction"] } },
                        { typeBox: { types: ["Defense Reaction"] } },
                      ],
                      defending: true,
                    },
                    count: { type: "all" },
                  },
                  duration: "this-chain-link",
                },
              },
            },
            target: { selector: "binding", binding: "it" },
            duration: "this-chain-link",
          },
        },
      ],
    },
  }),
});

export const {
  red: displayOfArtistryRed,
  yellow: displayOfArtistryYellow,
  blue: displayOfArtistryBlue,
} = displayOfArtistry.cards;
