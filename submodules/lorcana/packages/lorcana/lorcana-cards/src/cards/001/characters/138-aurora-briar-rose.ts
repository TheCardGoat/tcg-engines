import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraBriarRoseI18n } from "./138-aurora-briar-rose.i18n";

export const auroraBriarRose: CharacterCard = {
  id: "HSP",
  canonicalId: "ci_HSP",
  reprints: ["set1-138"],
  cardType: "character",
  name: "Aurora",
  version: "Briar Rose",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 138,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ce469941c08b425484af9a8c69eb8ce1",
    tcgPlayer: 508809,
  },
  text: [
    {
      title: "DISARMING BEAUTY",
      description: "When you play this character, chosen character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "v54-1",
      name: "DISARMING BEAUTY",
      text: "DISARMING BEAUTY When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: auroraBriarRoseI18n,
};
