import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiHalfsharkI18n } from "./124-maui-half-shark.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const mauiHalfshark: CharacterCard = {
  id: "HTB",
  canonicalId: "ci_HTB",
  reprints: ["set6-124"],
  cardType: "character",
  name: "Maui",
  version: "Half-Shark",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  cardNumber: 124,
  rarity: "legendary",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5123478aad6349f1a3f4500b31bc7d5e",
    tcgPlayer: 588357,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "CHEEEEOHOOOO!",
      description:
        "Whenever this character challenges another character, you may return an action card from your discard to your hand.",
    },
    {
      title: "WAYFINDING",
      description: "Whenever you play an action, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
  abilities: [
    evasive,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "action",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "rcf-2",
      name: "CHEEEEOHOOOO!",
      text: "CHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "defender-is-character" }],
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "rcf-3",
      name: "WAYFINDING",
      text: "WAYFINDING Whenever you play an action, gain 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mauiHalfsharkI18n,
};
