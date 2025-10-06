import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaAlchemist: LorcanaCharacterCardDefinition = {
  id: "drx",
  name: "Yzma",
  title: "Alchemist",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  text: "**YOU'RE EXCUSED** Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  type: "character",
  abilities: [
    wheneverQuests({
      effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
    }),
  ],
  flavour: '"When I want your opinion, I will give it to you!"',
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Hadjie Joos",
  number: 60,
  set: "TFC",
  rarity: "common",
};
