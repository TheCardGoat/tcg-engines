import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  drawACard,
  mayBanish,
} from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const monsieurDArqueDespicableProprietor: LorcanitoCharacterCardDefinition =
  {
    id: "m61",
    name: "Monsieur D'Arque",
    title: "Despicable Proprietor",
    characteristics: ["storyborn", "villain"],
    text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item to draw a card.",
    type: "character",
    abilities: [
      wheneverQuests({
        name: "I'VE COME TO COLLECT",
        text: "Whenever this character quests, you may banish chosen item to draw a card.",
        optional: true,
        dependentEffects: true,
        // resolveEffectsIndividually: true,
        effects: [mayBanish(chosenItemOfYours), drawACard],
      }),
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 1,
    strength: 1,
    willpower: 2,
    illustrator: "Kamil Murzyn",
    number: 157,
    set: "007",
    rarity: "common",
    lore: 1,
  };
