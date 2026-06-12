import type { CharacterCard } from "@tcg/lorcana-types";
import { morganaMacawberSelfcenteredSpellcasterI18n } from "./040-morgana-macawber-self-centered-spellcaster.i18n";

export const morganaMacawberSelfcenteredSpellcaster: CharacterCard = {
  id: "r3V",
  canonicalId: "ci_r3V",
  reprints: ["set11-040"],
  cardType: "character",
  name: "Morgana Macawber",
  version: "Self-Centered Spellcaster",
  inkType: ["amethyst"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 40,
  rarity: "common",
  cost: 3,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_08e7171f69da4091b9e8691356768b86",
    tcgPlayer: 673736,
  },
  classifications: ["Storyborn", "Super", "Villain", "Sorcerer"],
  i18n: morganaMacawberSelfcenteredSpellcasterI18n,
};
