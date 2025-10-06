import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { returnCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const guntherInteriorDesigner: LorcanitoCharacterCardDefinition = {
  id: "n20",
  missingTestCase: true,
  name: "Gunther",
  title: "Interior Designer",
  characteristics: ["dreamborn", "ally"],
  text: "**SAD-EYED PUPPY** When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
  type: "character",
  abilities: [
    whenChallengedAndBanished({
      name: "Sad-Eyed Puppy",
      text: "When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.",
      responder: "opponent",
      effects: [returnCardToHand(chosenCharacterOfYours)],
    }),
  ],
  flavour: "I hate to cover this trap door. It really pulls the room together!",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Anderson Mahanski",
  number: 72,
  set: "URR",
  rarity: "common",
};
