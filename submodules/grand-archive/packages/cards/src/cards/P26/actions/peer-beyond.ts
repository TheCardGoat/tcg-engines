import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const peerBeyond: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "54ebGqHpLO",
  slug: "peer-beyond",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "54ebGqHpLO:face:default",
      catalogId: "54ebGqHpLO",
      name: "Peer Beyond",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit gains true sight until end of turn. (Units with true sight can attack objects with stealth.)\n\nEphemerate — (1) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "54ebGqHpLO-a1",
          kind: "card-resolution",
          text: "Target unit gains true sight until end of turn. (Units with true sight can attack objects with stealth.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "true-sight",
              },
            },
          },
        },
        {
          id: "54ebGqHpLO-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (1) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default peerBeyond;
