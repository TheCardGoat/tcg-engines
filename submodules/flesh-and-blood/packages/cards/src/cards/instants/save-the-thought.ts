import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/save-the-thought.generated.ts";

export const saveTheThought = definePitchFamily(fabPitchFamilies["save-the-thought"], {
  parameters: pitchMap({
    red: { count: 3 },
    yellow: { count: 2 },
    blue: { count: 1 },
  }),
  abilities: ({ count }) => ({
    recycleActions: {
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
              typeBox: {
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
            count: { type: "up-to", amount: count },
          },
          to: { zone: "deck" },
        },
        { type: "shuffle", zone: "deck" },
      ],
    },
    createPonder: {
      type: "create-token",
      token: "ponder",
      controller: "controller",
    },
  }),
});

export const {
  red: saveTheThoughtRed,
  yellow: saveTheThoughtYellow,
  blue: saveTheThoughtBlue,
} = saveTheThought.cards;
