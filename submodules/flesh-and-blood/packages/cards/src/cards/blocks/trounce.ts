import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/trounce.generated.ts";

const clashWithAttacker = {
  type: "clash" as const,
  with: { selector: "attacking-hero" as const },
};

const putRevealsOnBottom = {
  type: "sequence" as const,
  steps: [
    {
      type: "move-card" as const,
      target: {
        selector: "binding" as const,
        binding: "revealed-clash-controller",
      },
      to: { zone: "deck" as const, position: "bottom" as const },
    },
    {
      type: "move-card" as const,
      target: {
        selector: "binding" as const,
        binding: "revealed-clash-opponent",
      },
      to: { zone: "deck" as const, position: "bottom" as const },
    },
  ],
};

const mintWinnerTrio = {
  type: "sequence" as const,
  steps: [
    { type: "create-token" as const, token: "gold" as const, controller: "winner" as const },
    { type: "create-token" as const, token: "might" as const, controller: "winner" as const },
    { type: "create-token" as const, token: "vigor" as const, controller: "winner" as const },
  ],
};

export const trounce = definePitchFamily(fabPitchFamilies["trounce"], {
  abilities: () => ({
    clashTwiceOnDefend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            clashWithAttacker,
            putRevealsOnBottom,
            {
              type: "conditional",
              condition: { type: "has-status", status: "won-clash" },
              then: {
                type: "sequence",
                steps: [
                  clashWithAttacker,
                  putRevealsOnBottom,
                  {
                    type: "conditional",
                    condition: { type: "has-status", status: "won-clash" },
                    then: mintWinnerTrio,
                  },
                ],
              },
              else: {
                type: "conditional",
                condition: { type: "has-status", status: "opponent-won-clash" },
                then: {
                  type: "sequence",
                  steps: [
                    clashWithAttacker,
                    putRevealsOnBottom,
                    {
                      type: "conditional",
                      condition: { type: "has-status", status: "opponent-won-clash" },
                      then: mintWinnerTrio,
                    },
                  ],
                },
                else: {
                  type: "sequence",
                  steps: [clashWithAttacker, putRevealsOnBottom],
                },
              },
            },
          ],
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});

export const { red: trounceRed } = trounce.cards;
