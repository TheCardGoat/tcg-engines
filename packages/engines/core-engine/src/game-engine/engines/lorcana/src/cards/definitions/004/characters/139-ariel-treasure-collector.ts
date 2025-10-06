import { whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielTreasureCollector: LorcanitoCharacterCardDefinition = {
  id: "stn",
  name: "Ariel",
  title: "Treasure Collector",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n\n** THE GIRLS WHO HAS EVERYTHING** While you have more items in play than each opponent, this character gets +2 {L}.",
  type: "character",
  abilities: [
    whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets({
      name: "THE GIRLS WHO HAS EVERYTHING",
      text: "While you have more items in play than each opponent, this character gets +2 {L}.",
      attribute: "lore",
      amount: 2,
    }),
    wardAbility,
  ],
  colors: ["sapphire"],
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  illustrator: "Miss Tania Soler",
  number: 139,
  set: "URR",
  rarity: "super_rare",
};
