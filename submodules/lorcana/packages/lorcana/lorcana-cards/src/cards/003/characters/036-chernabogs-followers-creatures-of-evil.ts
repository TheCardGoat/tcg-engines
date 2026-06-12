import type { CharacterCard } from "@tcg/lorcana-types";
import { chernabogsFollowersCreaturesOfEvilI18n } from "./036-chernabogs-followers-creatures-of-evil.i18n";

export const chernabogsFollowersCreaturesOfEvil: CharacterCard = {
  id: "gNW",
  canonicalId: "ci_gNW",
  reprints: ["set3-036"],
  cardType: "character",
  name: "Chernabog's Followers",
  version: "Creatures of Evil",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 36,
  rarity: "uncommon",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bda38dbbd3974a5bb53bc91853faa172",
    tcgPlayer: 539067,
  },
  text: [
    {
      title: "RESTLESS SOULS",
      description: "Whenever this character quests, you may banish them to draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: "SELF",
              type: "banish",
            },
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
        },
        type: "optional",
      },
      id: "nd2-1",
      name: "RESTLESS SOULS",
      text: "RESTLESS SOULS Whenever this character quests, you may banish them to draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: chernabogsFollowersCreaturesOfEvilI18n,
};
