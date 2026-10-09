import type { CharacterCard } from "@tcg/lorcana-types";
import { thomasOmalleySavvyVagabondI18n } from "./152-thomas-omalley-savvy-vagabond.i18n";

export const thomasOmalleySavvyVagabond: CharacterCard = {
  id: "oBC",
  canonicalId: "ci_oBC",
  slug: "lorcana-ci_oBC",
  printings: [
    {
      id: "set14-152",
      artId: "set14-152",
      setCode: "set14",
      collectorNumber: "152",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-152"],
  cardType: "character",
  name: "Thomas O'Malley",
  version: "Savvy Vagabond",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 152,
  rarity: "super_rare",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_58f4cf1d04434ab7b352cad8452232d0",
  },
  text: [
    {
      title: "LUCKY BREAK",
      description:
        "Whenever this character quests, each player reveals the top card of their deck. Put the card with the highest cost revealed this way, or each card tied for highest cost, into its player's hand. Put the rest on the bottom of their players' decks.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "omalley-1",
      name: "LUCKY BREAK",
      type: "triggered",
      text: "LUCKY BREAK Whenever this character quests, each player reveals the top card of their deck. Put the card with the highest cost revealed this way, or each card tied for highest cost, into its player's hand. Put the rest on the bottom of their players' decks.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "reveal-tops-highest-cost-to-hand",
      },
    },
  ],
  i18n: thomasOmalleySavvyVagabondI18n,
};
