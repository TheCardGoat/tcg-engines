import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sweetAmbrosia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dgyduwh84p",
  slug: "sweet-ambrosia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dgyduwh84p:face:default",
      catalogId: "dgyduwh84p",
      name: "Sweet Ambrosia",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Banish Sweet Ambrosia: Recover 3. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "dgyduwh84p-a1",
          kind: "activated",
          text: "Banish Sweet Ambrosia: Recover 3. (To recover, remove that many damage counters from your champion.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
      ],
    },
  },
};

export default sweetAmbrosia;
