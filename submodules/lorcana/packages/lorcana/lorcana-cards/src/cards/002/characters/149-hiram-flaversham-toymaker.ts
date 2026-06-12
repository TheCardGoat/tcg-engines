import type { CharacterCard } from "@tcg/lorcana-types";
import { hiramFlavershamToymakerI18n } from "./149-hiram-flaversham-toymaker.i18n";

export const hiramFlavershamToymaker: CharacterCard = {
  id: "LsX",
  canonicalId: "ci_LsX",
  reprints: ["set2-149"],
  cardType: "character",
  name: "Hiram Flaversham",
  version: "Toymaker",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 149,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e0ddeb51820a4e46840686240e076a57",
    tcgPlayer: 527277,
  },
  text: [
    {
      title: "ARTIFICER",
      description:
        "When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
    },
  ],
  classifications: ["Storyborn", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
              type: "banish",
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: {
                amount: 2,
                target: "CONTROLLER",
                type: "draw",
              },
            },
          ],
        },
        type: "optional",
      },
      id: "slt-1",
      name: "ARTIFICER",
      text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
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
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
              type: "banish",
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: {
                amount: 2,
                target: "CONTROLLER",
                type: "draw",
              },
            },
          ],
        },
        type: "optional",
      },
      id: "slt-2",
      name: "ARTIFICER",
      text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: hiramFlavershamToymakerI18n,
};
