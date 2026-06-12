import type { CharacterCard } from "@tcg/lorcana-types";
import { angelSirenSingerI18n } from "./025-angel-siren-singer.i18n";
import { underdog } from "../../../helpers/abilities/underdog";
import { singer } from "../../../helpers/abilities/singer";

export const angelSirenSinger: CharacterCard = {
  id: "FwE",
  canonicalId: "ci_HaX",
  reprints: ["set11-025"],
  cardType: "character",
  name: "Angel",
  version: "Siren Singer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 25,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ce082b2459af4c0a94a900a468bd9096",
    tcgPlayer: 658220,
  },
  text: [
    {
      title: "UNDERDOG",
      description:
        "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
    },
    {
      title: "Singer 3",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [underdog, singer(3)],
  i18n: angelSirenSingerI18n,
};
