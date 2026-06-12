import type { CharacterCard } from "@tcg/lorcana-types";
import { joeyBluePigeonI18n } from "./036-joey-blue-pigeon.i18n";

export const joeyBluePigeon: CharacterCard = {
  id: "Zwk",
  canonicalId: "ci_Zwk",
  reprints: ["set8-036"],
  cardType: "character",
  name: "Joey",
  version: "Blue Pigeon",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 36,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8667edc82b784cbb96e48962ef4583a9",
    tcgPlayer: 631376,
  },
  text: [
    {
      title: "I'VE GOT JUST THE THING",
      description:
        "Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [{ type: "has-keyword", keyword: "Bodyguard" }],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "jla-1",
      name: "I'VE GOT JUST THE THING",
      text: "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: joeyBluePigeonI18n,
};
