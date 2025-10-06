import {
  opponentDiscardsACard,
  opponentRevealHand,
  putThisCardIntoYourInkwellExerted,
} from "@lorcanito/lorcana-engine/effects/effects";
import {
  whenThisIsBanished,
  whenYouPlayThis,
} from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ludwigVonDrakeAllaroundExpert: LorcanaCharacterCardDefinition = {
  id: "juw",
  name: "Ludwig Von Drake",
  title: "All-Around Expert",
  characteristics: ["storyborn", "ally"],
  text: "SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.\nLASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "SUPERIOR MIND",
      text: "When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.",
      resolveEffectsIndividually: true,
      effects: [
        opponentRevealHand,
        opponentDiscardsACard([
          { filter: "type", value: ["location", "item", "action"] },
        ]),
      ],
    }),
    whenThisIsBanished({
      name: "LASTING LEGACY",
      text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
      optional: true,
      effects: [putThisCardIntoYourInkwellExerted],
    }),
  ],
  inkwell: false,
  colors: ["amber", "sapphire"],
  cost: 2,
  strength: 1,
  willpower: 1,
  illustrator: "Pietro B. Zemelo",
  number: 7,
  set: "008",
  rarity: "rare",
  lore: 1,
};
