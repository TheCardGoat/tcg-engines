import { whenYouPlayThisForEachYouPayLess } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chernabogEvildoer: LorcanaCharacterCardDefinition = {
  id: "zif",
  name: "Chernabog",
  title: "Evildoer",
  characteristics: ["storyborn", "villain"],
  text: "**THE POWER OF EVIL** When you play this character, pay 1 {I} less for every character card in your discard.\n\n\n**SUMMON THE SPIRITS** When you play this character, shuffle all character cards from your discard into your deck.",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "The Power of Evil",
      text: "When you play this character, pay 1 {I} less for every character card in your discard.",
      amount: {
        dynamic: true,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "discard" },
        ],
      },
    }),
    {
      type: "resolution",
      name: "Summon the Spirits",
      text: "When you play this character, shuffle all character cards from your discard into your deck.",
      effects: [
        {
          type: "shuffle",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "discard" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "The darkness calls all its subjects.",
  colors: ["amber"],
  strength: 9,
  willpower: 9,
  cost: 10,
  lore: 3,
  illustrator: "Evana Kisa / Jochem van Gool",
  number: 3,
  set: "ITI",
  rarity: "super_rare",
};
