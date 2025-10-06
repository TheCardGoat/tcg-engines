import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vanellopeVonSchweetzCandyMechanic: LorcanitoCharacterCardDefinition =
  {
    id: "pvk",
    name: "Vanellope Von Schweetz",
    title: "Candy Mechanic",
    characteristics: ["hero", "dreamborn", "princess", "racer"],
    text: "**YOU’VE GOT TO PAY TO PLAY** Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
    type: "character",
    abilities: [
      wheneverQuests({
        name: "YOU’VE GOT TO PAY TO PLAY",
        text: "Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 1,
            modifier: "subtract",
            duration: "next_turn",
            until: true,
            target: chosenOpposingCharacter,
          },
        ],
      }),
    ],
    flavour:
      "I’ll take whatever you’ve got... as long as it’s got sugar in it.",
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    strength: 2,
    willpower: 2,
    lore: 1,
    illustrator: "Hedvig Häggman-Sund",
    number: 9,
    set: "SSK",
    rarity: "common",
  };
