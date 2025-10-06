import { banishChallengingCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { whenChallengedAndBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoTemperamentalEmperor: LorcanaCharacterCardDefinition = {
  id: "j7u",
  reprints: ["l2r"],
  name: "Kuzco",
  title: "Temperamental Emperor",
  characteristics: ["storyborn", "king"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**NO TOUCHY!** When this character is challenged and banished, you may banish the challenging character.",
  type: "character",
  abilities: [
    whenChallengedAndBanished({
      name: "No Touchy!",
      text: "When this character is challenged and banished, you may banish the challenging character.",
      optional: true,
      effects: [banishChallengingCharacter],
    }),
    wardAbility,
  ],
  flavour:
    "I asked for emerald and that is clearly jade! What is wrong with you people?",
  colors: ["emerald"],
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  illustrator: "Grace Tran",
  number: 84,
  set: "TFC",
  rarity: "rare",
};
