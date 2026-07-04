import type { CharacterCard } from "@tcg/lorcana-types";
import { incrediboyBuddyPineI18n } from "./177-incrediboy-buddy-pine.i18n";

export const incrediboyBuddyPine: CharacterCard = {
  id: "mD0",
  canonicalId: "ci_mD0",
  slug: "lorcana-ci_mD0",
  printings: [
    {
      id: "set12-177",
      artId: "set12-177",
      setCode: "set12",
      collectorNumber: "177",
      rarity: "common",
      imageUrl: "",
    },
  ],
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
    lorcast: "crd_705137b1ace0487ba1f71ee39019989a",
    tcgPlayer: "692216",
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
