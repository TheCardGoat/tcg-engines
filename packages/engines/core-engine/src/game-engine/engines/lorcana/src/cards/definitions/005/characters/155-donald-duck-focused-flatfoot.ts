import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckFocusedFlatfoot: LorcanitoCharacterCardDefinition = {
  id: "ulv",
  name: "Donald Duck",
  title: "Focused Flatfoot",
  characteristics: ["hero", "dreamborn", "detective"],
  text: "**BAFFLING MYSTERY** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "BAFFLING MYSTERY",
      text: "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      optional: true,
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    },
  ],
  flavour:
    '"There’s just gotta be one of those chromi-thingies around here somewhere!"',
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Luigi Aimé",
  number: 155,
  set: "SSK",
  rarity: "common",
};
