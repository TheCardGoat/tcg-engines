import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurKingVictoriousI18n } from "./194-arthur-king-victorious.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const arthurKingVictorious: CharacterCard = {
  id: "xkQ",
  canonicalId: "ci_KRT",
  reprints: ["set5-194"],
  cardType: "character",
  name: "Arthur",
  version: "King Victorious",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 194,
  rarity: "legendary",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ad336bbf94b74813aa25312a57af4525",
    tcgPlayer: 561981,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "KNIGHTED BY THE KING",
      description:
        "When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
    },
  ],
  classifications: ["Floodborn", "Hero", "King"],
  abilities: [
    shift(5),
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
          {
            type: "grant-ability",
            ability: "can-challenge-ready",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
      id: "d3q-2",
      name: "KNIGHTED BY THE KING",
      text: "KNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: arthurKingVictoriousI18n,
};
