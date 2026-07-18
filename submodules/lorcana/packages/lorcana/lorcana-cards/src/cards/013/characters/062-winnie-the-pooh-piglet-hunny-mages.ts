import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { winnieThePoohPigletHunnyMagesI18n } from "./062-winnie-the-pooh-piglet-hunny-mages.i18n";

export const winnieThePoohPigletHunnyMages: CharacterCard = {
  id: "NXy",
  canonicalId: "ci_NXy",
  slug: "lorcana-ci_NXy",
  printings: [
    {
      id: "set13-062",
      artId: "set13-062",
      setCode: "set13",
      collectorNumber: "62",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-062"],
  cardType: "character",
  name: "Winnie the Pooh & Piglet",
  version: "Hunny Mages",
  inkType: ["amethyst", "sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 62,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e2c9423df7b4642914deccabf922ff5",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "MAGICAL MIX",
      description:
        "This character gets +1 {L} for each different ink type of characters you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Team", "Hero", "Sorcerer", "Hunny"],
  abilities: [
    shift("Winnie the Pooh or Piglet", 3),
    {
      type: "static",
      name: "MAGICAL MIX",
      text: "MAGICAL MIX This character gets +1 {L} for each different ink type of characters you have in play.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "count",
          what: "distinct-character-ink-types",
          controller: "you",
        },
        target: "SELF",
      },
    },
  ],
  i18n: winnieThePoohPigletHunnyMagesI18n,
};
