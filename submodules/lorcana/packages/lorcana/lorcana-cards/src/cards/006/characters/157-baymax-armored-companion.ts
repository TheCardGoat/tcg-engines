import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxArmoredCompanionI18n } from "./157-baymax-armored-companion.i18n";

export const baymaxArmoredCompanion: CharacterCard = {
  id: "w4v",
  canonicalId: "ci_w4v",
  reprints: ["set6-157"],
  cardType: "character",
  name: "Baymax",
  version: "Armored Companion",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 157,
  rarity: "legendary",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_982364cf0c5f42ee9ba82a335bf674b5",
    tcgPlayer: 578165,
  },
  text: [
    {
      title: "THE TREATMENT IS WORKING",
      description:
        "When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: { type: "up-to", value: 2 },
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "remove-damage",
            },
            {
              type: "gain-lore",
              amount: {
                type: "for-each",
                counter: {
                  type: "damage-removed",
                },
              },
            },
          ],
        },
        type: "optional",
      },
      id: "12n-1",
      name: "THE TREATMENT IS WORKING",
      text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: { type: "up-to", value: 2 },
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "remove-damage",
            },
            {
              type: "gain-lore",
              amount: {
                type: "for-each",
                counter: {
                  type: "damage-removed",
                },
              },
            },
          ],
        },
        type: "optional",
      },
      id: "12n-2",
      name: "THE TREATMENT IS WORKING",
      text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: baymaxArmoredCompanionI18n,
};
