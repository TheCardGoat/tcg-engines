// Native synthetic CR11 fixture; no current catalog loop is claimed.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
const mode = process.argv[2];
const seat = mode === "north" ? "north" : "south";
const otherSeat = seat === "south" ? "north" : "south";
const card = getCard("EB01-005");
const body: Action[] = [
  {
    action: "returnToHand",
    target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
  },
  { action: "play", source: { player: "self", zone: "hand" }, self: true, count: { amount: 1 } },
];
card.effects = {
  effects: [
    {
      trigger: "onPlay",
      actions: [
        {
          action: "optional",
          actions: [
            ...(mode === "random"
              ? [{ action: "shuffleDeck" as const, player: "self" as const }]
              : []),
            ...(["finite", "random"].includes(mode ?? "")
              ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
              : []),
            ...(mode?.startsWith("nested")
              ? [{ action: "optional" as const, actions: body }]
              : body),
          ],
        },
      ],
    },
    { trigger: "activateMain", actions: body },
  ],
};
const fixture = {
  hand: [card],
  activeDon: 3,
  deck: ["ST01-003", "ST01-004", "ST01-005"],
};
let e = OnePieceTestEngine.create(
  seat === "south" ? fixture : {},
  seat === "north" ? fixture : {},
  { activeSeat: seat },
);
const source = e.findCardInZone(seat, "hand", card);
e.playCard(card, seat);
e.resolveDecision(
  "effectActionOptional",
  { optionId: mode === "nestedOuter" ? "no" : "yes" },
  seat,
);
let changedStateCanRestart = false;
if (mode === "nestedOuter") {
  if (e.getView(seat).prompts.length !== 0)
    throw new Error("Declining outer wrapper opened inner choice");
} else if (mode === "nestedInner") {
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.resolveDecision("effectActionOptional", { optionId: "no" }, seat);
} else if (mode === "finite" || mode === "random") {
  e.resolveDecision("effectActionOptional", { optionId: "yes" }, seat);
  e.resolveDecision("effectActionOptional", { optionId: "no" }, seat);
} else {
  const prompt = e.pendingDecision("loopIterations", seat);
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  const invalid = e.expectFailure({
    type: "resolvePrompt",
    seat: otherSeat,
    promptId: prompt.id,
    iterations: 1,
  });
  e = OnePieceTestEngine.fromState(invalid.state);
  if (e.pendingDecision("loopIterations", seat).id !== prompt.id)
    throw new Error("Wrong-seat retry lost prompt");
  const negative = e.expectFailure({
    type: "resolvePrompt",
    seat: seat,
    promptId: prompt.id,
    iterations: -1,
  });
  e = OnePieceTestEngine.fromState(negative.state);
  if (e.pendingDecision("loopIterations", seat).id !== prompt.id)
    throw new Error("Invalid count lost prompt");
  e.exec({
    type: "resolvePrompt",
    seat: seat,
    promptId: prompt.id,
    iterations: mode === "zero" ? 0 : mode === "large" ? Number.MAX_SAFE_INTEGER : 1,
  });
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.activateEffect(source, "activateMain", seat);
  if (e.getView(seat).prompts.length !== 0) throw new Error("Stopped loop restarted unchanged");
  // A real DON attachment changes game state without changing card definitions.
  const leader = e.getView(seat).players[seat].leader.instanceId;
  if (!leader) throw new Error("Expected visible Leader");
  e.attachDon(leader, 1, seat);
  e.activateEffect(source, "activateMain", seat);
  changedStateCanRestart = Boolean(e.pendingDecision("effectActionOptional", seat));
  e.resolveDecision("effectActionOptional", { optionId: "no" }, seat);
}
const view = e.getView(seat);
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    deck: view.players[seat].deckCount,
    sameCharacter: view.players[seat].characters.some((c) => c?.instanceId === source),
    changedStateCanRestart,
    stoppedLog: view.logs.some((log) => log.message.includes("cannot be restarted")),
  }),
);
