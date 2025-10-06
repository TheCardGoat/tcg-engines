import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverOneOfYourCharsQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const aurelianGyrosensor: LorcanaItemCardDefinition = {
  id: "zc9",
  reprints: ["dbv"],
  missingTestCase: true,
  name: "Aurelian Gyrosensor",
  characteristics: ["item"],
  text: "**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  type: "item",
  abilities: [
    wheneverOneOfYourCharsQuests({
      name: "Seeking Knowledge",
      text: "Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      optional: true,
      effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
    }),
  ],
  flavour:
    "It can point toward lost lore, but if you're not careful, it'll lead you off a cliff. \n−Venturo, an Illumineer",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Mario Oscar Gabriele",
  number: 163,
  set: "ITI",
  rarity: "rare",
};
