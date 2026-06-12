import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceSavvySailorI18n } from "./161-alice-savvy-sailor.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const aliceSavvySailor: CharacterCard = {
  id: "4E5",
  canonicalId: "ci_4E5",
  reprints: ["set6-161"],
  cardType: "character",
  name: "Alice",
  version: "Savvy Sailor",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 161,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_dc30f4ddffb84e7daf742ee323cfb552",
    tcgPlayer: 591979,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "AHOY!",
      description:
        "Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    ward,
    {
      effect: {
        steps: [
          {
            duration: "until-start-of-next-turn",
            modifier: 1,
            stat: "lore",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
            type: "modify-stat",
          },
          {
            duration: "until-start-of-next-turn",
            keyword: "Ward",
            target: { ref: "previous-target" },
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "1hn-2",
      name: "AHOY!",
      text: "AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: aliceSavvySailorI18n,
};
