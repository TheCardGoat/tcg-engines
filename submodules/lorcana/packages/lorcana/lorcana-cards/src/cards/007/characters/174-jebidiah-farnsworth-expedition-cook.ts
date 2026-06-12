import type { CharacterCard } from "@tcg/lorcana-types";
import { jebidiahFarnsworthExpeditionCookI18n } from "./174-jebidiah-farnsworth-expedition-cook.i18n";
import { support } from "../../../helpers/abilities/support";

export const jebidiahFarnsworthExpeditionCook: CharacterCard = {
  id: "FOI",
  canonicalId: "ci_FOI",
  reprints: ["set7-174"],
  cardType: "character",
  name: "Jebidiah Farnsworth",
  version: "Expedition Cook",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 174,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2c68909051f6499f8a6cab0f663e7bba",
    tcgPlayer: 619506,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "I GOT YOUR FOUR BASIC FOOD GROUPS",
      description:
        "When you play this character, chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    support,
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1z1-2",
      name: "I GOT YOUR FOUR BASIC FOOD GROUPS",
      text: "I GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jebidiahFarnsworthExpeditionCookI18n,
};
