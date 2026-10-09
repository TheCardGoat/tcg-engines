import type { CharacterCard } from "@tcg/lorcana-types";
import { angelSirenSingerD23I18n } from "./d23-010-angel-siren-singer.i18n";

import { underdog } from "../../../helpers/abilities/underdog";
import { singer } from "../../../helpers/abilities/singer";

export const angelSirenSingerD23: CharacterCard = {
  id: "nNw",
  canonicalId: "ci_HaX",
  slug: "lorcana-ci_HaX",
  printings: [
    {
      id: "set11-d23-010",
      artId: "set11-d23-010",
      setCode: "set11",
      collectorNumber: "10",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set11-d23-010", "set11-025"],
  cardType: "character",
  name: "Angel",
  version: "Siren Singer",
  inkType: ["amber"],
  franchise: "D23",
  set: "011",
  cardNumber: 10,
  rarity: "special",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ce082b2459af4c0a94a900a468bd9096",
    tcgPlayer: "658220",
  },
  text: [
    {
      title: "Underdog",
      description:
        "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
    },
    {
      title: "Singer 3",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [underdog, singer(3)],
  i18n: angelSirenSingerD23I18n,
};
