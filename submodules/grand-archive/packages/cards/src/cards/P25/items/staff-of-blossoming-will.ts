import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const staffOfBlossomingWill: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4moumzcx9z",
  slug: "staff-of-blossoming-will",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4moumzcx9z:face:default",
      catalogId: "4moumzcx9z",
      name: "Staff of Blossoming Will",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "STAFF"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\n[Diao Chan Bonus] (1), REST: Target player summons a Flowerbud token.",
      abilities: [
        {
          id: "4moumzcx9z-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "4moumzcx9z-a2",
          kind: "activated",
          text: "[Diao Chan Bonus] (1), REST: Target player summons a Flowerbud token.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Flowerbud",
            controller: {
              binding: "target-opponent",
            },
          },
        },
      ],
    },
  },
};

export default staffOfBlossomingWill;
