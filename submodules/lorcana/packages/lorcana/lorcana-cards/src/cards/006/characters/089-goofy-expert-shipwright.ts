import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyExpertShipwrightI18n } from "./089-goofy-expert-shipwright.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const goofyExpertShipwright: CharacterCard = {
  id: "T9c",
  canonicalId: "ci_usY",
  slug: "lorcana-ci_usY",
  printings: [
    {
      id: "set6-089",
      artId: "set6-089",
      setCode: "set6",
      collectorNumber: "89",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set6-089"],
  cardType: "character",
  name: "Goofy",
  version: "Expert Shipwright",
  inkType: ["emerald"],
  set: "006",
  cardNumber: 89,
  rarity: "rare",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_45321c3501974bd39455f3cc7346f535",
    tcgPlayer: "650209",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "CLEVER DESIGN",
      description:
        "Whenever this character quests, chosen character gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
  abilities: [
    ward,
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "gjx-2",
      name: "CLEVER DESIGN",
      text: "CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofyExpertShipwrightI18n,
};
