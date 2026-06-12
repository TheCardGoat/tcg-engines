import type { CharacterCard } from "@tcg/lorcana-types";
import { boltSuperdogI18n } from "./004-bolt-superdog.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const boltSuperdog: CharacterCard = {
  id: "xfP",
  canonicalId: "ci_qlj",
  reprints: ["set7-004"],
  cardType: "character",
  name: "Bolt",
  version: "Superdog",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 4,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e8863a1965284a3bad897ee8614d2866",
    tcgPlayer: 619735,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "MARK OF POWER",
      description:
        "Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
    },
    {
      title: "BOLT STARE",
      description: "{E} — Banish chosen Illusion character.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      id: "xfP-2",
      name: "MARK OF POWER",
      type: "triggered",
      trigger: {
        event: "ready",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
          filters: [
            {
              type: "status",
              status: "undamaged",
            },
          ],
        },
      },
      text: "MARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
    },
    {
      id: "xfP-3",
      name: "BOLT STARE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Illusion",
            },
          ],
        },
      },
      text: "BOLT STARE {E} — Banish chosen Illusion character.",
    },
  ],
  i18n: boltSuperdogI18n,
};
