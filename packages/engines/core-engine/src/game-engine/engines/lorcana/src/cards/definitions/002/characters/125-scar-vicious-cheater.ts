import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarViciousCheater: LorcanitoCharacterCardDefinition = {
  id: "i4t",
  name: "Scar",
  title: "Vicious Cheater",
  characteristics: ["storyborn", "villain"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**DADDY ISN'T HERE TO SAVE YOU** During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    rushAbility,
    wheneverBanishesAnotherCharacterInChallenge({
      name: "Daddy Isn't Here to Save You",
      text: "During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
      effects: [
        ...readyAndCantQuest({
          type: "card",
          value: "all",
          filters: [{ filter: "source", value: "self" }],
        }),
      ],
    }),
  ],
  colors: ["ruby"],
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  illustrator: "Nicholas Kole",
  number: 125,
  set: "ROF",
  rarity: "legendary",
};
