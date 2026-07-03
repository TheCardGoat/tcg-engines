import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentExultantSpellcasterI18n } from "./039-maleficent-exultant-spellcaster.i18n";

export const maleficentExultantSpellcaster: CharacterCard = {
  id: "cU7",
  canonicalId: "ci_cU7",
  slug: "lorcana-ci_cU7",
  printings: [
    {
      id: "set13-039",
      artId: "set13-039",
      setCode: "set13",
      collectorNumber: "39",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-039"],
  cardType: "character",
  name: "Maleficent",
  version: "Exultant Spellcaster",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "013",
  cardNumber: 39,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_136f0a550e5f4588bbd9fd5285e4cb83",
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  i18n: maleficentExultantSpellcasterI18n,
};
