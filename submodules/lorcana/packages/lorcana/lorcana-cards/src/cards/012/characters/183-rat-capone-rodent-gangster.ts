import type { CharacterCard } from "@tcg/lorcana-types";
import { ratCaponeRodentGangsterI18n } from "./183-rat-capone-rodent-gangster.i18n";

export const ratCaponeRodentGangster: CharacterCard = {
  id: "zSo",
  canonicalId: "ci_zSo",
  slug: "lorcana-ci_zSo",
  printings: [
    {
      id: "set12-183",
      artId: "set12-183",
      setCode: "set12",
      collectorNumber: "183",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-183"],
  cardType: "character",
  name: "Rat Capone",
  version: "Rodent Gangster",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 183,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dc7439b895b342b99a0c373767318f64",
    tcgPlayer: "692196",
  },
  text: [
    {
      title: "SHADAAP!",
      description: "While this character has no damage, he gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "zSo-1",
      name: "SHADAAP!",
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "SHADAAP! While this character has no damage, he gets +3 {S}.",
    },
  ],
  i18n: ratCaponeRodentGangsterI18n,
};
