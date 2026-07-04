import type { ItemCard } from "@tcg/lorcana-types";
import { dunbrochFamilyTapestryEnchantedI18n } from "./228-dunbroch-family-tapestry-enchanted.i18n";

export const dunbrochFamilyTapestryEnchanted: ItemCard = {
  id: "b3r",
  canonicalId: "ci_cRy",
  slug: "lorcana-ci_cRy",
  printings: [
    {
      id: "set12-228-enchanted",
      artId: "ci_cRy-enchanted",
      setCode: "set12",
      collectorNumber: "228",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-067"],
  cardType: "item",
  name: "DunBroch Family Tapestry",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 228,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a8ae68af26f84535869ce0dac1f4a3de",
    tcgPlayer: "692219",
  },
  text: [
    {
      title: "TORN APART",
      description: "This item enters play exerted.",
    },
    {
      title: "MEND THE BOND",
      description:
        "{E}, Banish this item — Each player shuffles all character cards from their discard into their deck.",
    },
  ],
  abilities: [
    {
      id: "cRy-1",
      name: "TORN APART",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      text: "TORN APART This item enters play exerted.",
    },
    {
      id: "cRy-2",
      name: "MEND THE BOND",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "shuffle-into-deck",
        intoDeck: "owner",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
      text: "MEND THE BOND {E}, Banish this item — Each player shuffles all character cards from their discard into their deck.",
    },
  ],
  i18n: dunbrochFamilyTapestryEnchantedI18n,
};
