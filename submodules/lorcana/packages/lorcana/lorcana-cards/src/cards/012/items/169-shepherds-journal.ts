import type { ItemCard } from "@tcg/lorcana-types";
import { shepherdsJournalI18n } from "./169-shepherds-journal.i18n";

export const shepherdsJournal: ItemCard = {
  id: "zo6",
  canonicalId: "ci_zo6",
  reprints: ["set12-169"],
  cardType: "item",
  name: "Shepherd's Journal",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 169,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5459a4d694d44a97bf71319a8ab35a32",
  },
  text: [
    {
      title: "MARGIN NOTES",
      description:
        "When you play this item, you may look at the top card of your deck. Put it on either the top of your deck or into your discard.",
    },
    {
      title: "KEY TO THE PUZZLE 1",
      description:
        "{I}, Banish this item — Return another item card from your discard to your hand.",
    },
  ],
  abilities: [
    {
      id: "zo6-1",
      name: "MARGIN NOTES",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "discard",
              remainder: true,
            },
          ],
        },
      },
      text: "MARGIN NOTES When you play this item, you may look at the top card of your deck. Put it on either the top of your deck or into your discard.",
    },
    {
      id: "zo6-2",
      name: "KEY TO THE PUZZLE 1",
      type: "activated",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "return-from-discard",
        cardType: "item",
        target: "CONTROLLER",
        count: 1,
        destination: "hand",
        filter: {
          type: "source",
          ref: "other",
        },
      },
      text: "KEY TO THE PUZZLE 1 {I}, Banish this item — Return another item card from your discard to your hand.",
    },
  ],
  i18n: shepherdsJournalI18n,
};
