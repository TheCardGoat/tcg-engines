import type { CharacterCard } from "@tcg/lorcana-types";
import { incrediboyBuddyPineI18n } from "./177-incrediboy-buddy-pine.i18n";

export const incrediboyBuddyPine: CharacterCard = {
  id: "mD0",
  canonicalId: "ci_mD0",
  reprints: ["set12-177"],
  cardType: "character",
  name: "Incrediboy",
  version: "Buddy Pine",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 177,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6a9d1a4cd8c74378a3e6081adf6c0797",
  },
  text: [
    {
      title: "NERDING OUT",
      description: "When you play this character, if a Hero character is in play, gain 1 lore.",
    },
    {
      title: "SPOILER ALERT",
      description: "This character also counts as being named Syndrome for Shift.",
    },
  ],
  classifications: ["Storyborn", "Inventor"],
  abilities: [
    {
      id: "mD0-1",
      name: "NERDING OUT",
      type: "triggered",
      text: "NERDING OUT When you play this character, if a Hero character is in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-character-count",
        controller: "any",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Hero",
        excludeSelf: true,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "mD0-2",
      name: "SPOILER ALERT",
      text: "SPOILER ALERT This character also counts as being named Syndrome for Shift.",
      type: "static",
      effect: {
        type: "property-modification",
        property: "name",
        operation: "add-alias",
        value: "Syndrome",
        target: "SELF",
      },
    },
  ],
  i18n: incrediboyBuddyPineI18n,
};
