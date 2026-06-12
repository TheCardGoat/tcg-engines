import type { CharacterCard } from "@tcg/lorcana-types";
import { doloresMadrigalEasyListenerI18n } from "./041-dolores-madrigal-easy-listener.i18n";

export const doloresMadrigalEasyListener: CharacterCard = {
  id: "Gf5",
  canonicalId: "ci_xFh",
  reprints: ["set4-041", "set9-051"],
  cardType: "character",
  name: "Dolores Madrigal",
  version: "Easy Listener",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 41,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d9a1ea3bfe5d4911918825597c51e0a6",
    tcgPlayer: 649995,
  },
  text: [
    {
      title: "MAGICAL INFORMANT",
      description:
        "When you play this character, if an opponent has an exerted character in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "n9k-1",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "opponent",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "MAGICAL INFORMANT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "MAGICAL INFORMANT When you play this character, if an opponent has an exerted character in play, you may draw a card.",
    },
  ],
  i18n: doloresMadrigalEasyListenerI18n,
};
