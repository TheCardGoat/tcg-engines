import type { ItemCard } from "@tcg/lorcana-types";
import { bindingContractI18n } from "./065-binding-contract.i18n";

export const bindingContract: ItemCard = {
  id: "DNe",
  canonicalId: "ci_DNe",
  reprints: ["set2-065"],
  cardType: "item",
  name: "Binding Contract",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "002",
  cardNumber: 65,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_baa89f6923b94ff6a59e1957814a2645",
    tcgPlayer: 527740,
  },
  text: [
    {
      title: "FOR ALL ETERNITY",
      description: "{E}, {E} one of your characters — Exert chosen character.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        exertCharacters: 1,
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "exert",
      },
      id: "1ri-1",
      name: "FOR ALL ETERNITY",
      text: "FOR ALL ETERNITY {E}, {E} one of your characters — Exert chosen character.",
      type: "activated",
    },
  ],
  i18n: bindingContractI18n,
};
