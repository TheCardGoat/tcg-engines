import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelCreativeCaptorI18n } from "./143-rapunzel-creative-captor.i18n";

export const rapunzelCreativeCaptor: CharacterCard = {
  id: "Gl7",
  canonicalId: "ci_Gl7",
  reprints: ["set10-143"],
  cardType: "character",
  name: "Rapunzel",
  version: "Creative Captor",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 143,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_000a947aaa794fb098baed9d88b6fab1",
    tcgPlayer: 659455,
  },
  text: [
    {
      title: "ENSNARL",
      description: "When you play this character, chosen opposing character gets -3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1gl-1",
      name: "ENSNARL",
      text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rapunzelCreativeCaptorI18n,
};
