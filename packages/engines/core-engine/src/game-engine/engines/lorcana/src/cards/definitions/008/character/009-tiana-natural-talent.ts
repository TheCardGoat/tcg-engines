import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import { eachOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tianaNaturalTalent: LorcanaCharacterCardDefinition = {
  id: "ke9",
  name: "Tiana",
  title: "Natural Talent",
  characteristics: ["storyborn", "hero", "princess"],
  text: "Singer 6 (This character counts as cost 6 to sing songs.)\nCAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    singerAbility(6),
    wheneverYouPlayASong({
      name: "CAPTIVATING MELODY",
      text: "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: eachOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Milica Cetkovic",
  number: 9,
  set: "008",
  rarity: "rare",
  lore: 1,
};
