import type { LocationCard } from "@tcg/lorcana-types";
import { ratigansPartySeedyBackRoomEnchantedI18n } from "./216-ratigans-party-seedy-back-room-enchanted.i18n";

export const ratigansPartySeedyBackRoomEnchanted: LocationCard = {
  id: "lZk",
  canonicalId: "ci_dzD",
  slug: "lorcana-ci_dzD",
  printings: [
    {
      id: "set5-216-enchanted",
      artId: "ci_dzD-enchanted",
      setCode: "set5",
      collectorNumber: "216",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-136"],
  cardType: "location",
  name: "Ratigan's Party",
  version: "Seedy Back Room",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 216,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  willpower: 7,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_4690391667a14f42a7df8ef76771703d",
    tcgPlayer: "562000",
  },
  text: [
    {
      title: "MISFITS' REVELRY",
      description: "While you have a damaged character here, this location gets +2 {L}.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
            {
              type: "damaged",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1nd-1",
      name: "MISFITS' REVELRY",
      text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: ratigansPartySeedyBackRoomEnchantedI18n,
};
