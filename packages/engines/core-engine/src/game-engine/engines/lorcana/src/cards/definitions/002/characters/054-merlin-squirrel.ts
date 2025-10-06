import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenPlayAndWhenLeaves } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinSquirrel: LorcanaCharacterCardDefinition = {
  id: "lvm",

  name: "Merlin",
  title: "Squirrel",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**LOOK BEFORE YOU LEAP** When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  type: "character",
  abilities: whenPlayAndWhenLeaves({
    name: "Look Before You Leap",
    text: "When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
  }),
  flavour: "You can’t always trust to luck, boy.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 54,
  set: "ROF",
  rarity: "common",
};
