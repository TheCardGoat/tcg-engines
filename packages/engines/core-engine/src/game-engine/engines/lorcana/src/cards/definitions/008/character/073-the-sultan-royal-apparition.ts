import { exertChosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { vanishAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/vanishAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theSultanRoyalApparition: LorcanaCharacterCardDefinition = {
  id: "nrh",
  name: "The Sultan",
  title: "Royal Apparition",
  characteristics: ["dreamborn", "ally", "king", "illusion"],
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nCOMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
  type: "character",
  abilities: [
    vanishAbility,
    wheneverQuests({
      name: "COMMANDING PRESENCE",
      text: "Whenever one of your Illusion characters quests, exert chosen opposing character.",
      triggerTarget: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["illusion"] },
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
        ],
      },
      effects: [exertChosenOpposingCharacter],
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "steel"],
  cost: 5,
  strength: 5,
  willpower: 5,
  illustrator: "Max Ulichney",
  number: 73,
  set: "008",
  rarity: "rare",
  lore: 2,
};
