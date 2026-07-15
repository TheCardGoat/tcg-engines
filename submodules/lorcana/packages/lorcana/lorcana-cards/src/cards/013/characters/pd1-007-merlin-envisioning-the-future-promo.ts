import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinEnvisioningTheFuturePD1PromoI18n } from "./pd1-007-merlin-envisioning-the-future-promo.i18n";

export const merlinEnvisioningTheFuturePD1Promo: CharacterCard = {
  id: "7cP",
  canonicalId: "ci_7cP",
  slug: "lorcana-ci_7cP",
  printings: [
    {
      id: "set13-pd1-007-promo",
      artId: "ci_7cP-promo",
      setCode: "set13",
      collectorNumber: "7",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set13-146"],
  cardType: "character",
  name: "Merlin",
  version: "Envisioning the Future",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "013",
  cardNumber: 7,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Minor Trickery",
      description:
        "When you play this character, you may draw a card from the bottom of your deck.",
    },
    {
      title: "Age of Inconvenience",
      description:
        "When this character is banished, put this card from your discard on the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      id: "7cP-1",
      name: "MINOR TRICKERY",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
          source: "deck-bottom",
        },
      },
      text: "MINOR TRICKERY When you play this character, you may draw a card from the bottom of your deck.",
    },
    {
      id: "7cP-2",
      name: "AGE OF INCONVENIENCE",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "all",
          count: 1,
          reference: "trigger-subject",
          zones: ["discard"],
        },
      },
      text: "AGE OF INCONVENIENCE When this character is banished, put this card from your discard on the bottom of your deck.",
    },
  ],
  i18n: merlinEnvisioningTheFuturePD1PromoI18n,
};
