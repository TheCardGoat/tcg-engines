import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxPersonalHealthcareCompanionEnchantedI18n } from "./218-baymax-personal-healthcare-companion-enchanted.i18n";

export const baymaxPersonalHealthcareCompanionEnchanted: CharacterCard = {
  id: "JMr",
  canonicalId: "ci_StD",
  slug: "lorcana-ci_StD",
  printings: [
    {
      id: "set6-218-enchanted",
      artId: "ci_StD-enchanted",
      setCode: "set6",
      collectorNumber: "218",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-156"],
  cardType: "character",
  name: "Baymax",
  version: "Personal Healthcare Companion",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 218,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7a1524eb2f994287ab6de2e677431724",
    tcgPlayer: "591999",
  },
  text: [
    {
      title: "FULLY CHARGED",
      description:
        "If you have an Inventor character in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "YOU SAID",
      description: "'OW' 2 {I} — Remove up to 1 damage from another chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
  abilities: [
    {
      condition: {
        type: "has-character-with-classification",
        classification: "Inventor",
        controller: "you",
      },
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      id: "1p5-1",
      name: "FULLY CHARGED",
      sourceZones: ["hand"],
      text: "FULLY CHARGED If you have an Inventor character in play, you pay 1 {I} less to play this character.",
      type: "static",
    },
    {
      cost: {
        ink: 2,
      },
      effect: {
        amount: {
          type: "up-to",
          value: 1,
        },
        target: "ANOTHER_CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      id: "1p5-2",
      name: "YOU SAID 'OW'",
      text: "YOU SAID 'OW' 2 {I} — Remove up to 1 damage from another chosen character.",
      type: "activated",
    },
  ],
  i18n: baymaxPersonalHealthcareCompanionEnchantedI18n,
};
