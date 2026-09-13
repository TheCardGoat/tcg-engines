import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/rootbound-carapace.generated.ts";

export const rootboundCarapace = definePitchFamily(fabPitchFamilies["rootbound-carapace"], {
  abilities: () => ({
    decomposeForDefense: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    supertypes: ["Earth"],
                  },
                },
                count: 2,
              },
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                },
                count: 1,
              },
            },
          ],
        },
        then: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      label: {
        name: "decompose",
      },
    },
  }),
});
export const {
  red: rootboundCarapaceRed,
  yellow: rootboundCarapaceYellow,
  blue: rootboundCarapaceBlue,
} = rootboundCarapace.cards;
