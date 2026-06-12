import type { CharacterCard } from "@tcg/lorcana-types";
import { kingLouieJungleVipI18n } from "./012-king-louie-jungle-vip.i18n";

export const kingLouieJungleVip: CharacterCard = {
  id: "184",
  canonicalId: "ci_184",
  reprints: ["set2-012"],
  cardType: "character",
  name: "King Louie",
  version: "Jungle VIP",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "002",
  cardNumber: 12,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a9c44f3e0884493b853e0a1c8b1fca6",
    tcgPlayer: 527613,
  },
  text: [
    {
      title: "LAY IT ON THE LINE",
      description:
        "Whenever another character is banished, you may remove up to 2 damage from this character.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: "SELF",
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "3ec-1",
      name: "LAY IT ON THE LINE",
      text: "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.",
      trigger: {
        event: "banish",
        on: "OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: kingLouieJungleVipI18n,
};
