// Native synthetic CR11 fixture; no current catalog loop is claimed.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
const mode = process.argv[2];
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
      optional: true,
      actions: [
        ...(mode === "random" ? [{ action: "shuffleDeck" as const, player: "self" as const }] : []),
        ...(["finite", "random"].includes(mode ?? "")
          ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
          : []),
        ...body,
      ],
    },
    { trigger: "activateMain", actions: body },
  ],
};
let e = OnePieceTestEngine.create({
  hand: [card],
  activeDon: 3,
  deck: ["ST01-003", "ST01-004", "ST01-005"],
});
const source = e.findCardInZone("south", "hand", card);
e.playCard(card, "south");
e.asSouth().acceptOptional();
let changedStateCanRestart = false;
if (mode === "finite" || mode === "random") {
  e.asSouth().acceptOptional();
  e.asSouth().declineOptional();
} else {
  const prompt = e.pendingDecision("loopIterations", "south");
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  const invalid = e.expectFailure({
    type: "resolvePrompt",
    seat: "north",
    promptId: prompt.id,
    iterations: 1,
  });
  e = OnePieceTestEngine.fromState(invalid.state);
  if (e.pendingDecision("loopIterations", "south").id !== prompt.id)
    throw new Error("Wrong-seat retry lost prompt");
  const negative = e.expectFailure({
    type: "resolvePrompt",
    seat: "south",
    promptId: prompt.id,
    iterations: -1,
  });
  e = OnePieceTestEngine.fromState(negative.state);
  if (e.pendingDecision("loopIterations", "south").id !== prompt.id)
    throw new Error("Invalid count lost prompt");
  e.exec({
    type: "resolvePrompt",
    seat: "south",
    promptId: prompt.id,
    iterations: mode === "zero" ? 0 : mode === "large" ? Number.MAX_SAFE_INTEGER : 1,
  });
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.asSouth().activateMain(source);
  if (e.getView("south").prompts.length !== 0) throw new Error("Stopped loop restarted unchanged");
  // A real DON attachment changes game state without changing card definitions.
  const leader = e.getView("south").players.south.leader.instanceId;
  if (!leader) throw new Error("Expected visible Leader");
  e.attachDon(leader, 1, "south");
  e.asSouth().activateMain(source);
  changedStateCanRestart = Boolean(e.pendingDecision("effectOptional", "south"));
  e.asSouth().declineOptional();
}
const view = e.getView("south");
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    deck: view.players.south.deckCount,
    sameCharacter: view.players.south.characters.some((c) => c?.instanceId === source),
    changedStateCanRestart,
    stoppedLog: view.logs.some((log) => log.message.includes("cannot be restarted")),
  }),
);
