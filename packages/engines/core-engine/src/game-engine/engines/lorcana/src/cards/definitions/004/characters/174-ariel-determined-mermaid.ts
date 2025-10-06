import {
  discardACard,
  drawACard,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielDeterminedMermaid: LorcanaCharacterCardDefinition = {
  id: "ov6",
  reprints: ["b8l"],
  name: "Ariel",
  title: "Determined Mermaid",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**I WANT MORE** Whenever you play a song, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    wheneverYouPlayASong({
      optional: true,
      resolveEffectsIndividually: true,
      effects: [discardACard, drawACard],
      name: "**I WANT MORE**",
      text: "Whenever you play a song, you may draw a card, then choose and discard a card.",
    }),
  ],
  flavour: "Everything she's ever wanted is almost in reach.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Dylan Bonner",
  number: 174,
  set: "URR",
  rarity: "common",
};
