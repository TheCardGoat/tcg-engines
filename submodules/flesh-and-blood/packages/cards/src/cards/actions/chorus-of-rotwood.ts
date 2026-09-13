import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chorus-of-rotwood.generated.ts";

export const chorusOfRotwood = definePitchFamily(fabPitchFamilies["chorus-of-rotwood"], {
  abilities: () => ({
    mayBanish2EarthActionFromGraveyardIfDo: {
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
          type: "create-token",
          token: "embodiment-of-earth",
          controller: "controller",
        },
      },
      label: {
        name: "decompose",
      },
    },
    create3RunechantTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
        count: 3,
      },
    },
  }),
});
export const { red: chorusOfRotwoodRed } = chorusOfRotwood.cards;
