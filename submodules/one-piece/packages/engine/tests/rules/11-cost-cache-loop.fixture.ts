// Synthetic rules fixture: unrelated continuous-cost sources must not prevent
// exact loop proof merely because their derived cache records moving history.
import "../../../cards/src/index.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

const mode = process.argv[2];
const optional = mode === "optional" || mode === "own-choice";
const ownContribution = mode === "own-mandatory" || mode === "own-finite" || mode === "own-choice";
const finite = mode === "own-finite";
const moving = getCard("EB01-005"),
  costSource = getCard("ST01-011");
moving.effects = {
  effects: [
    {
      trigger: "onPlay",
      actions: [
        ...(finite ? [{ action: "draw" as const, player: "self" as const, amount: 1 }] : []),
        {
          action: "ko",
          target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
        },
      ],
    },
    {
      trigger: "onKo",
      ...(optional ? { optional: true } : {}),
      actions: [
        {
          action: "play",
          source: { player: "self", zone: "trash" },
          count: { amount: 1 },
          self: true,
        },
      ],
    },
  ],
};
costSource.effects = {
  permanentEffects: [
    {
      actions: [
        {
          action: "modifyCost",
          value: 1,
          target: {
            player: "self",
            self: true,
            zones: ["character"],
            count: { amount: 1 },
            filters: [{ filter: "cost", comparison: "gte", value: 0 }],
          },
        },
      ],
    },
  ],
};
if (ownContribution) {
  // This extra permanent belongs to the same physical card that moves. Its
  // cache key changes generation on every play; trash has no contribution.
  moving.effects.permanentEffects = [
    {
      actions: [
        {
          action: "modifyCost",
          value: 1,
          target: {
            player: "self",
            self: true,
            zones: ["hand", "character"],
            count: { amount: 1 },
            filters: [{ filter: "cost", comparison: "gte", value: 0 }],
          },
        },
      ],
    },
  ];
}
let e = OnePieceTestEngine.create({
  hand: [moving],
  character: [costSource, costSource],
  activeDon: ownContribution ? 4 : 3,
  ...(finite ? { deck: ["ST02-002", "ST02-006"] } : {}),
});
const movingId = e.findCardInZone("south", "hand", moving);
if (ownContribution) e.asSouth().attachDon(e.findCardInZone("south", "character", costSource), 1);
const initialMovingCost = e.getState().continuousCosts?.values[movingId];
const initialMovingContribution = Object.keys(
  e.getState().continuousCosts?.contributions ?? {},
).some((id) => id.startsWith(`${movingId}:`));
e.playCard(moving, "south");
if (mode === "optional") {
  e.asSouth().acceptOptional();
  const prompt = e.pendingDecision("loopIterations", "south");
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.exec({ type: "resolvePrompt", seat: "south", promptId: prompt.id, iterations: 1000 });
}
let ordinaryChoice = false;
if (mode === "own-choice") {
  e.asSouth().acceptOptional();
  ordinaryChoice = Boolean(e.pendingDecision("effectOptional", "south"));
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.asSouth().declineOptional();
}
const view = e.getView("south"),
  state = e.getState();
process.stdout.write(
  JSON.stringify({
    ...(ownContribution
      ? {
          initialMovingCost,
          initialMovingContribution,
          ordinaryChoice,
          movingZone: state.cards[movingId]?.zone,
          deckCount: view.players.south.deckCount,
        }
      : {}),
    status: view.status,
    reason: view.finishReason,
    prompts: view.prompts.length,
    costSources: Object.keys(state.continuousCosts?.contributions ?? {}).length,
    movingSourceContributes: Object.keys(state.continuousCosts?.contributions ?? {}).some((id) =>
      id.startsWith(`${movingId}:`),
    ),
    costs: view.players.south.characters
      .filter((c) => c?.cardId === costSource.id)
      .map((c) => c!.cost),
  }),
);
