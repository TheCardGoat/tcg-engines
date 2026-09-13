import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tip-the-barkeep.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tipTheBarkeep = definePitchFamily(fabPitchFamilies["tip-the-barkeep"], {
  keywords: [goAgain],
  abilities: () => ({
    createGoldkissRumToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "goldkiss-rum",
        controller: "controller",
      },
    },
    giveGoldTokenControlAnotherHeroDoPutOnBottomOwnerS: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "give",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Gold",
              typeBox: {
                metatypes: ["Token"],
              },
            },
            count: 1,
          },
          controller: "opponent",
        },
        then: {
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});

export const { blue: tipTheBarkeepBlue } = tipTheBarkeep.cards;
