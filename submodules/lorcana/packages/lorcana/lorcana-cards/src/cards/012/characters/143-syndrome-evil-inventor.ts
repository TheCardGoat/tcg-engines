import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities/alert";
import { syndromeEvilInventorI18n } from "./143-syndrome-evil-inventor.i18n";

export const syndromeEvilInventor: CharacterCard = {
  id: "ib4",
  canonicalId: "ci_ib4",
  reprints: ["set12-143"],
  cardType: "character",
  name: "Syndrome",
  version: "Evil Inventor",
  inkType: ["sapphire"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 143,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6a4abcb645cf41f282d3e6466283ea8d",
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Villain", "Inventor"],
  abilities: [alert],
  i18n: syndromeEvilInventorI18n,
};
