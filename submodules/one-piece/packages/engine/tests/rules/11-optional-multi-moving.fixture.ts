// Synthetic native CR11 cases; no printed catalog loop is claimed.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
const mode = process.argv[2] ?? "nested";
const nested = mode.startsWith("nested");
const turn = mode.startsWith("northTurn") ? "north" : "south";
const other = turn === "south" ? "north" : "south";
const south = getCard("EB01-005"),
  north = getCard("EB01-018");
const body: Action[] = [
  {
    action: "returnToHand",
    target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
  },
  { action: "play", source: { player: "self", zone: "hand" }, self: true, count: { amount: 1 } },
];
let e: OnePieceTestEngine;
const finite = mode === "nestedFinite" || mode === "nestedRandom";
if (nested) {
  south.effects = {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "optional",
            actions: [
              {
                action: "optional",
                actions: [
                  ...(mode === "nestedRandom"
                    ? [{ action: "shuffleDeck" as const, player: "self" as const }]
                    : []),
                  ...(finite
                    ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
                    : []),
                  ...body,
                ],
              },
            ],
          },
        ],
      },
      { trigger: "activateMain", actions: body },
    ],
  };
  e = OnePieceTestEngine.create({
    hand: [south],
    activeDon: 3,
    deck: ["ST01-003", "ST01-004", "ST01-005"],
  });
  e.playCard(south, "south");
  e.resolveDecision(
    "effectActionOptional",
    { optionId: mode === "nestedOuterNo" ? "no" : "yes" },
    "south",
  );
  if (mode !== "nestedOuterNo")
    e.resolveDecision(
      "effectActionOptional",
      { optionId: mode === "nestedInnerNo" ? "no" : "yes" },
      "south",
    );
  if (finite) {
    e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectActionOptional", { optionId: "no" }, "south");
  }
} else {
  for (const card of [south, north])
    card.effects = {
      effects: [
        { trigger: "activateMain", actions: body },
        { trigger: "whenOpponentPlaysCharacter", optional: true, actions: body },
      ],
    };
  e = OnePieceTestEngine.create(
    { character: [south], activeDon: 2 },
    { leaderCardId: "ST01-001", character: [north], activeDon: 2 },
    { activeSeat: turn },
  );
  e.activateEffect(
    e.findCardInZone(turn, "character", turn === "south" ? south : north),
    "activateMain",
    turn,
  );
  e.resolveDecision("effectOptional", { optionId: "yes" }, other);
  e.resolveDecision("effectOptional", { optionId: "yes" }, turn);
  // Both Characters have now entered during this turn; one more body reaches a repeated state.
  e.resolveDecision("effectOptional", { optionId: "yes" }, other);
}
let restartedAfterChange = false,
  representativeComplete = false;
if (!finite && mode !== "nestedOuterNo" && mode !== "nestedInnerNo") {
  const ids = [
    e.findCardInZone("south", "character", south),
    ...(!nested ? [e.findCardInZone("north", "character", north)] : []),
  ];
  const before = ids.map((id) => e.getState().cards[id]!.zoneChangeCounter);
  const max = mode.endsWith("Max") || mode === "max";
  const counts = {
    south: max
      ? Number.MAX_SAFE_INTEGER
      : mode.toLowerCase().includes("southlower") || mode === "nestedZero"
        ? 0
        : 3,
    north: max ? Number.MAX_SAFE_INTEGER : mode.toLowerCase().includes("northlower") ? 1 : 3,
  };
  if (nested && !max && mode !== "nestedZero") counts.south = 1;
  for (const seat of (nested ? ["south"] : [turn, other]) as ("south" | "north")[]) {
    const prompt = e.pendingDecision("loopIterations", seat);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    for (const invalid of [
      { seat: seat === "south" ? ("north" as const) : ("south" as const), iterations: 1 },
      { seat, iterations: -1 },
    ]) {
      const rejected = e.expectFailure({ type: "resolvePrompt", promptId: prompt.id, ...invalid });
      e = OnePieceTestEngine.fromState(rejected.state);
      if (e.pendingDecision("loopIterations", seat).id !== prompt.id)
        throw new Error("Invalid declaration consumed prompt");
    }
    e.exec({ type: "resolvePrompt", seat, promptId: prompt.id, iterations: counts[seat] });
  }
  const minimum = nested ? counts.south : Math.min(counts.south, counts.north);
  representativeComplete =
    minimum === 0 ||
    ids.every((id, index) => e.getState().cards[id]!.zoneChangeCounter >= before[index]! + 2);
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  const bootstrap = e.findCardInZone(turn, "character", turn === "south" ? south : north);
  e.activateEffect(bootstrap, "activateMain", turn);
  if (e.getView(turn).prompts.length) throw new Error("Unchanged loop restarted");
  const leader = e.getView(turn).players[turn].leader.instanceId;
  if (!leader) throw new Error("Missing Leader");
  e.attachDon(leader, 1, turn);
  e.activateEffect(bootstrap, "activateMain", turn);
  const owner = nested ? "south" : other;
  const intent = nested ? "effectActionOptional" : "effectOptional";
  restartedAfterChange = Boolean(e.pendingDecision(intent, owner));
  e.resolveDecision(intent, { optionId: "no" }, owner);
}
const view = e.getView("south");
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    stoppedBy: view.logs.findLast((log) => log.message.endsWith("stops the loop."))?.actor,
    southCharacters: view.players.south.characters.filter(Boolean).length,
    northCharacters: view.players.north.characters.filter(Boolean).length,
    deck: view.players.south.deckCount,
    restartedAfterChange,
    representativeComplete,
  }),
);
