import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { auricShardsRed as auricShardsRules } from "@tcg/flesh-and-blood-cards/cards/instants/auric-shards";
import { volticBoltRed as volticBoltRules } from "@tcg/flesh-and-blood-cards/cards/actions/voltic-bolt";
import { channelStormgardenYellow as channelRules } from "@tcg/flesh-and-blood-cards/cards/instants/channel-stormgarden";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { zyggy as zyggyRules } from "@tcg/flesh-and-blood-cards/cards/heroes/zyggy";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const auricShardsRed = previewCard(auricShardsRules);
const volticBoltRed = previewCard(volticBoltRules);
const channelStormgardenYellow = previewCard(channelRules);
const dash = previewCard(dashRules);
const zyggy = previewCard(zyggyRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-channel-stormgarden-yellow",
  label: "Channel Stormgarden (yellow)",
  description:
    "Channel Stormgarden has entered the arena and created Lightning Flow. Destroy the Flow with Zyggy, then play Voltic Bolt to inspect the +1 amp rider.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "channel-stormgarden-yellow", "lightning-flow", "amp"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [channelStormgardenYellow, volticBoltRed],
        arena: [auricShardsRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const player = engine.as(zyggy);
    player.play(channelStormgardenYellow);
    engine.untilIdle();
    return matchFromEngine(engine, "usurp-preview-channel-stormgarden-yellow");
  },
};
