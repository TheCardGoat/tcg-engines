import type { CharacterCard } from "@tcg/lorcana-types";
import { kristoffReindeerKeeperI18n } from "./013-kristoff-reindeer-keeper.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const kristoffReindeerKeeper: CharacterCard = {
  id: "AZZ",
  canonicalId: "ci_AZZ",
  reprints: ["set5-013"],
  cardType: "character",
  name: "Kristoff",
  version: "Reindeer Keeper",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 13,
  rarity: "rare",
  cost: 9,
  strength: 3,
  willpower: 7,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_6cba76453f834205a7edf1e8222907c7",
    tcgPlayer: 555689,
  },
  text: [
    {
      title: "SONG OF THE HERD",
      description: "For each song card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      title: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "1qs-1",
      name: "SONG OF THE HERD",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["discard"],
          filters: [
            {
              type: "song",
            },
          ],
        },
        cardType: "character",
      },
      sourceZones: ["hand"],
      text: "SONG OF THE HERD For each song card in your discard, you pay 1 {I} less to play this character.",
      type: "static",
    },
    bodyguard,
  ],
  i18n: kristoffReindeerKeeperI18n,
};
