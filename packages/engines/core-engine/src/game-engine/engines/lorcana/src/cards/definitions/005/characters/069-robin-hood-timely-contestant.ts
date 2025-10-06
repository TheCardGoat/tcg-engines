import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { whenYouPlayThisForEachYouPayLess } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodTimelyContestant: LorcanaCharacterCardDefinition = {
  id: "abw",
  name: "Robin Hood",
  title: "Timely Contestant",
  characteristics: ["hero", "storyborn"],
  text: "**TAG ME IN!** For each 1 damage on opposing characters, you pay 1 {I} less to play this character. **Ward** _(Opponents can’t choose this character except to challenge.)_",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "Tag me in!",
      text: "For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
      amount: {
        dynamic: true,
        targetFilterReducer: "damage",
        filters: [
          { filter: "owner", value: "opponent" },
          { filter: "type", value: "character" },
          {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
          },
        ],
      },
    }),
    wardAbility,
  ],
  colors: ["emerald"],
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  illustrator: "James Rey Sanchez",
  number: 69,
  set: "SSK",
  rarity: "rare",
};
