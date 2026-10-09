// Synthetic CR11 programs; no real-card infinite-loop claim.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
import { observeOptionalLoop } from "../../src/engine/optional-loop.ts";
import { beginDonIdentityProcess } from "../../src/engine/don-state.ts";
const mode = process.argv[2] ?? "south";
const seat = mode.startsWith("north") ? "north" : "south";
const other = seat === "south" ? "north" : "south";
const card = getCard("ST01-001"),
  bootstrap = getCard("ST02-001"),
  drawer = getCard("ST01-003");
const give: Action = {
  action: "giveDon",
  target: { player: "self", self: true, zones: ["leader"], count: { amount: 1 } },
  count: { amount: 1 },
  donState: "active",
};
const actions: Action[] = [
  { action: "addDon", count: { amount: 1 }, state: "active" },
  give,
  { action: "returnDon", player: "self", amount: 1 },
];
let cycle: Action[] = actions;
if (mode === "finite") cycle = [{ action: "draw", player: "self", amount: 1 }, ...actions];
if (mode === "choice")
  cycle = [
    { action: "addDon", count: { amount: 2 }, state: "active" },
    { action: "returnDon", player: "self", amount: 1 },
  ];
if (mode === "up-to")
  cycle = [actions[0]!, { ...give, count: { amount: 1, upTo: true } }, actions[2]!];
card.effects = {
  effects: [
    { trigger: "activateMain", actions },
    { trigger: "whenDonReturned", optional: true, actions: cycle },
  ],
};
drawer.effects = {
  effects: [{ trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] }],
};
if (mode === "restriction")
  card.effects.permanentEffects = [
    {
      actions: [
        {
          action: "modifyPower",
          target: { player: "self", self: true, zones: ["leader"], count: { amount: 1 } },
          value: 1000,
          duration: "thisTurn",
        },
      ],
    },
  ];
if (mode === "replacement")
  card.effects.replacementEffects = [
    { replacedEvent: "ko", replacementAction: { action: "draw", player: "self", amount: 1 } },
  ];
if (mode === "non-turn")
  bootstrap.effects = {
    effects: [
      {
        trigger: "activateMain",
        actions: [{ action: "returnDon", player: "opponent", amount: 1 }],
      },
    ],
  };
const fixture = {
  leaderCardId: card.id,
  character: [drawer],
  activeDon: mode === "non-turn" ? 1 : 0,
  donDeckCount: mode === "non-turn" ? 9 : 10,
  deck: ["ST01-004", "ST01-005", "ST01-006"],
};
let engine = OnePieceTestEngine.create(
  seat === "south" ? fixture : { leaderCardId: bootstrap.id },
  seat === "north" ? fixture : { leaderCardId: bootstrap.id },
  { activeSeat: mode === "non-turn" ? other : seat },
);
const resume = () => {
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
};
if (mode === "ledger") {
  const state = engine.getState();
  beginDonIdentityProcess(state);
  engine = OnePieceTestEngine.fromState(state);
}
engine.activateEffect(
  engine.leader(mode === "non-turn" ? other : seat),
  "activateMain",
  mode === "non-turn" ? other : seat,
);
resume();
if (mode === "mixed") {
  // Admission-unit proof: neither profile can borrow evidence from the other.
  const state = engine.getState(),
    boundary = state.optionalLoopEvidence?.[0];
  if (!boundary?.donSourceInstanceId) throw new Error("Missing DON evidence");
  state.promptQueue = [];
  state.resolutionQueue = [
    {
      kind: "effectAction",
      id: "audit-rest",
      controller: seat,
      sourceInstanceId: engine.leader(seat),
      action: {
        action: "rest",
        target: { player: "self", self: true, zones: ["leader"], count: { amount: 1 } },
      },
    },
  ];
  observeOptionalLoop(state);
  if (state.optionalLoopEvidence) throw new Error("DON evidence crossed into rest profile");
  state.optionalLoopEvidence = [{ ...boundary, donSourceInstanceId: undefined }];
  state.resolutionQueue = [
    {
      kind: "effectAction",
      id: "audit-don",
      controller: seat,
      sourceInstanceId: engine.leader(seat),
      action: actions[0]!,
    },
  ];
  observeOptionalLoop(state);
  if (state.optionalLoopEvidence) throw new Error("Rest evidence crossed into DON profile");
  process.stdout.write(JSON.stringify({ cleared: true }));
  process.exit(0);
}
engine.resolveDecision("effectOptional", { optionId: "yes" }, seat);
// Opponent bootstrap and self-cycle have different trigger sources. Certify only the repeated self boundary.
if (mode === "non-turn") {
  resume();
  engine.resolveDecision("effectOptional", { optionId: "yes" }, seat);
}
let restarted = false,
  rejected = 0;
if (["ledger", "restriction", "replacement", "finite"].includes(mode)) {
  for (let i = 0; i < 3 && engine.getView(seat).status === "active"; i++) {
    engine.pendingDecision("effectOptional", seat);
    resume();
    engine.resolveDecision("effectOptional", { optionId: "yes" }, seat);
  }
  if (engine.getView(seat).status === "active")
    engine.resolveDecision("effectOptional", { optionId: "no" }, seat);
} else if (mode === "choice" || mode === "up-to") {
  engine.pendingDecision(mode === "choice" ? "effectReturnDon" : "effectGiveDonCount", seat);
} else {
  const prompt = engine.pendingDecision("loopIterations", seat);
  resume();
  for (const [actor, iterations] of [
    [other, 1],
    [seat, -1],
    [seat, 0.5],
    [seat, Number.MAX_SAFE_INTEGER + 1],
  ] as const) {
    const failure = engine.expectFailure({
      type: "resolvePrompt",
      seat: actor,
      promptId: prompt.id,
      iterations,
    });
    engine = OnePieceTestEngine.fromState(failure.state);
    if (engine.pendingDecision("loopIterations", seat).id !== prompt.id)
      throw new Error("Invalid reply lost declaration");
    rejected++;
  }
  const iterations = mode.endsWith("zero") ? 0 : mode.endsWith("one") ? 1 : Number.MAX_SAFE_INTEGER;
  engine.exec({ type: "resolvePrompt", seat, promptId: prompt.id, iterations });
  if (
    !engine
      .getView(seat)
      .logs.some((log) => log.message.includes(`The loop repeats ${iterations} `))
  )
    throw new Error("Missing declaration log");
  if (mode !== "non-turn") {
    resume();
    engine.activateEffect(engine.leader(seat), "activateMain", seat);
    if (engine.getView(seat).prompts.length) throw new Error("Stopped loop restarted unchanged");
    if (!engine.getView(seat).logs.some((log) => log.message.includes("cannot be restarted")))
      throw new Error("Missing restart refusal");
    engine.activateEffect(engine.findCardInZone(seat, "character", drawer), "activateMain", seat);
    engine.activateEffect(engine.leader(seat), "activateMain", seat);
    restarted = Boolean(engine.pendingDecision("effectOptional", seat));
    engine.resolveDecision("effectOptional", { optionId: "no" }, seat);
  }
}
const view = engine.getView(seat);
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    donDeck: view.players[seat].donDeckCount,
    active: view.players[seat].activeDon,
    attached: view.players[seat].leader.attachedDon,
    restarted,
    rejected,
    stoppedBy: view.logs.findLast((log) => log.message.endsWith("stops the loop."))?.actor,
  }),
);
