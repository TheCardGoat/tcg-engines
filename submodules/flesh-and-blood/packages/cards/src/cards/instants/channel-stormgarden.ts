import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/channel-stormgarden.generated.ts";

export const channelStormgarden = definePitchFamily(fabPitchFamilies["channel-stormgarden"], {
  abilities: () => ({
    entersCreatesLightningFlow: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "create-token", token: "lightning-flow", controller: "controller" },
      },
    },
    firstDestroyedLightningFlowAmps: {
      kind: "static",
      staticKind: "triggered",
      limit: { count: 1, per: "turn", ordinals: [1] },
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: { kind: "any" },
            filter: { name: "Lightning Flow" },
          },
        },
      },
      resolution: { kind: "effect", effect: { type: "amp", amount: 1 } },
    },
    channelLightning: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: { kind: "named", name: "flow" },
              count: 1,
              target: { selector: "self" },
            },
            {
              type: "unless",
              effect: { type: "destroy", target: { selector: "self" } },
              escape: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["pitch"],
                  filter: { typeBox: { supertypes: ["Lightning"] } },
                  count: { type: "count", what: "counters-on-source" },
                },
                to: { zone: "deck", position: "bottom" },
              },
            },
          ],
        },
      },
      label: { name: "channel-lightning" },
    },
  }),
});

export const { yellow: channelStormgardenYellow } = channelStormgarden.cards;
