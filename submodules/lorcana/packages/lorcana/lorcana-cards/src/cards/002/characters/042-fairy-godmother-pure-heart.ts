import type { CharacterCard } from "@tcg/lorcana-types";
import { fairyGodmotherPureHeartI18n } from "./042-fairy-godmother-pure-heart.i18n";

export const fairyGodmotherPureHeart: CharacterCard = {
  id: "4li",
  canonicalId: "ci_4li",
  reprints: ["set2-042"],
  cardType: "character",
  name: "Fairy Godmother",
  version: "Pure Heart",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 42,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c35b1525a65d4eb28169ad5d88a0bc27",
    tcgPlayer: 527735,
  },
  text: [
    {
      title: "JUST LEAVE IT TO ME",
      description:
        "Whenever you play a character named Cinderella, you may exert chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "exert",
        },
        type: "optional",
      },
      id: "109-1",
      name: "JUST LEAVE IT TO ME",
      text: "JUST LEAVE IT TO ME Whenever you play a character named Cinderella, you may exert chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          name: "Cinderella",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fairyGodmotherPureHeartI18n,
};
