import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineSoothingPrincessI18n } from "./149-jasmine-soothing-princess.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const jasmineSoothingPrincess: CharacterCard = {
  id: "pbv",
  canonicalId: "ci_pVX",
  slug: "lorcana-ci_pVX",
  printings: [
    {
      id: "set10-149",
      artId: "set10-149",
      setCode: "set10",
      collectorNumber: "149",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set10-149"],
  cardType: "character",
  name: "Jasmine",
  version: "Soothing Princess",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 149,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_19f087c81e534ceda53b510446d75965",
    tcgPlayer: "658216",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "UPLIFTING AURA",
      description:
        "Whenever this character quests, if there's a card under her, remove up to 3 damage from each of your characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
  abilities: [
    boost(2),
    {
      effect: {
        condition: {
          type: "has-card-under",
        },
        then: {
          amount: { type: "up-to", value: 3 },
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "conditional",
      },
      id: "1rh-2",
      name: "UPLIFTING AURA",
      text: "UPLIFTING AURA Whenever this character quests, if there’s a card under her, remove up to 3 damage from each of your characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineSoothingPrincessI18n,
};
