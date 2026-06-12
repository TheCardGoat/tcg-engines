import type { CharacterCard } from "@tcg/lorcana-types";
import { royalGuardOctopusSoldierI18n } from "./052-royal-guard-octopus-soldier.i18n";

export const royalGuardOctopusSoldier: CharacterCard = {
  id: "z2N",
  canonicalId: "ci_z2N",
  reprints: ["set8-052"],
  cardType: "character",
  name: "Royal Guard",
  version: "Octopus Soldier",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 52,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5251999627264dabb73043f14e7b7b25",
    tcgPlayer: 631386,
  },
  text: [
    {
      title: "HEAVILY ARMED",
      description:
        "Whenever you draw a card, this character gains Challenger +1 this turn. (They get +1 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "9mz-1",
      name: "HEAVILY ARMED",
      text: "HEAVILY ARMED Whenever you draw a card, this character gains Challenger +1 this turn.",
      trigger: {
        event: "draw",
        on: "YOU",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: royalGuardOctopusSoldierI18n,
};
