import type { CharacterCard } from "@tcg/lorcana-types";
import { hueySavvyNephewI18n } from "./145-huey-savvy-nephew.i18n";
import { support } from "../../../helpers/abilities/support";

export const hueySavvyNephew: CharacterCard = {
  id: "iYO",
  canonicalId: "ci_Qsl",
  reprints: ["set3-145", "set9-138"],
  cardType: "character",
  name: "Huey",
  version: "Savvy Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 145,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5008e2e0ceb04bb9878d2590c92b32ee",
    tcgPlayer: 650073,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "THREE NEPHEWS",
      description:
        "Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    support,
    {
      effect: {
        condition: {
          type: "and",
          conditions: [
            { type: "has-named-character", name: "Dewey", controller: "you" },
            { type: "has-named-character", name: "Louie", controller: "you" },
          ],
        },
        then: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            amount: 3,
            target: "CONTROLLER",
            type: "draw",
          },
        },
        type: "conditional",
      },
      id: "aka-2",
      name: "THREE NEPHEWS",
      text: "THREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: hueySavvyNephewI18n,
};
