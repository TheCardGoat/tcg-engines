import type { ItemCard } from "@tcg/lorcana-types";
import { vaultDoorI18n } from "./167-vault-door.i18n";

export const vaultDoor: ItemCard = {
  id: "tAF",
  canonicalId: "ci_tAF",
  reprints: ["set3-167"],
  cardType: "item",
  name: "Vault Door",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 167,
  rarity: "common",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_d4897bfa5fb047a894e6f69c3feebc1f",
    tcgPlayer: 537394,
  },
  text: [
    {
      title: "SEALED AWAY",
      description: "Your locations and characters at locations gain Resist +1.",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "YOUR_LOCATIONS",
        type: "gain-keyword",
        value: 1,
      },
      id: "1nn-1",
      name: "SEALED AWAY",
      text: "SEALED AWAY Your locations and characters at locations gain Resist +1.",
      type: "static",
    },
    {
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "at-location",
            },
          ],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1nn-2",
      name: "SEALED AWAY",
      text: "SEALED AWAY Your characters at locations gain Resist +1.",
      type: "static",
    },
  ],
  i18n: vaultDoorI18n,
};
