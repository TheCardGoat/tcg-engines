import {
  namedCard,
  topCardOfYourDeck,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinCleverClairvoyant: LorcanitoCharacterCardDefinition = {
  id: "nyh",
  name: "Merlin",
  title: "Clever Clairvoyant",
  characteristics: ["storyborn", "mentor", "sorcerer"],
  text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Prestidigitonium",
      text: "name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
      nameACard: true,
      effects: [
        {
          type: "reveal-top-card",
          target: namedCard,
          onTargetMatchEffects: [
            {
              type: "move",
              to: "inkwell",
              exerted: true,
              target: topCardOfYourDeck,
            },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst", "sapphire"],
  cost: 1,
  strength: 0,
  willpower: 1,
  illustrator: "Cam Kendell",
  number: 67,
  set: "007",
  rarity: "rare",
  lore: 1,
};
