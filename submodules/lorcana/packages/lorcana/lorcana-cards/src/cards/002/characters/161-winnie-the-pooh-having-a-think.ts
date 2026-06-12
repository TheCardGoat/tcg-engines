import type { CharacterCard } from "@tcg/lorcana-types";
import { winnieThePoohHavingAThinkI18n } from "./161-winnie-the-pooh-having-a-think.i18n";

export const winnieThePoohHavingAThink: CharacterCard = {
  id: "ZKc",
  canonicalId: "ci_nqc",
  reprints: ["set2-161", "set9-159"],
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Having a Think",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 161,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bf5d82370e8e4900a9e7b05d502470df",
    tcgPlayer: 650094,
  },
  text: [
    {
      title: "HUNNY POT",
      description:
        "Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: false,
          facedown: true,
          source: "hand",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "18k-1",
      name: "HUNNY POT",
      text: "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: winnieThePoohHavingAThinkI18n,
};
