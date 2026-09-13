import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/lessons-learned.generated.ts";

export const lessonsLearned = definePitchFamily(fabPitchFamilies["lessons-learned"], {
  abilities: () => ({
    returnAttackReactionsThenShuffle: {
      type: "sequence",
      steps: [
        {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: { typeBox: { types: ["Attack Reaction"] }, differentNames: true },
            count: { type: "up-to", amount: 3 },
          },
          to: { zone: "deck" },
        },
        { type: "shuffle", zone: "deck" },
      ],
    },
  }),
});

export const { blue: lessonsLearnedBlue } = lessonsLearned.cards;
