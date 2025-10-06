import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleStrangeButBeautiful: LorcanaCharacterCardDefinition = {
  id: "uxx",
  name: "Belle",
  title: "Strange but Special",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
  type: "character",
  abilities: [
    // {
    //   type: "static",
    //   name: "Read a Book",
    //   text: "During your turn, you may put an additional card from your hand into your inkwell facedown.",
    //   // TODO: Sorry but I was too lazy to properly implement this
    //   // TableModel is querying how many Belles we have in place
    // },
    whileConditionThisCharacterGets({
      name: "My Favourite Part!",
      text: "While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
      conditions: [
        {
          type: "inkwell",
          amount: 10,
        },
      ],
      attribute: "lore",
      amount: 4,
    }),
  ],
  flavour:
    "Far-off places, daring sword fights, magic spells, a prince in disguise . . .",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 142,
  set: "TFC",
  rarity: "legendary",
};
