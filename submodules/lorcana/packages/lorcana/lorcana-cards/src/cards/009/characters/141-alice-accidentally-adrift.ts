import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceAccidentallyAdriftI18n } from "./141-alice-accidentally-adrift.i18n";

export const aliceAccidentallyAdrift: CharacterCard = {
  id: "1Rj",
  canonicalId: "ci_hhW",
  reprints: ["set9-141"],
  cardType: "character",
  name: "Alice",
  version: "Accidentally Adrift",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "009",
  cardNumber: 141,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_54148f51de174f4a93a475eec138365e",
    tcgPlayer: 647656,
  },
  text: [
    {
      title: "WASHED AWAY",
      description:
        "When you play this character, you may put chosen item into its player's inkwell facedown and exerted.",
    },
    {
      title: "MAKING WAVES",
      description:
        "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "hhW-1",
      name: "WASHED AWAY",
      text: "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-card-in-play",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          facedown: true,
          exerted: true,
        },
      },
    },
    {
      id: "hhW-2",
      name: "MAKING WAVES",
      text: "MAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: aliceAccidentallyAdriftI18n,
};
