import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseCompassionateFriendI18n } from "./024-minnie-mouse-compassionate-friend.i18n";

export const minnieMouseCompassionateFriend: CharacterCard = {
  id: "pv2",
  canonicalId: "ci_pv2",
  reprints: ["set5-024"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Compassionate Friend",
  inkType: ["amber"],
  set: "005",
  cardNumber: 24,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_edb33beb5360472080df4b6d2a6878a2",
    tcgPlayer: 561949,
  },
  text: [
    {
      title: "PATCH THEM UP",
      description:
        "Whenever this character quests, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "g8h-1",
      name: "PATCH THEM UP",
      text: "PATCH THEM UP Whenever this character quests, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseCompassionateFriendI18n,
};
