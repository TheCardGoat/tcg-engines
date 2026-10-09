// Synthetic two-controller CR11 program, not a real-card infinite-loop claim.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
import { beginDonIdentityProcess } from "../../src/engine/don-state.ts";
import { auditedDonTransition, optionalDonSources } from "../../src/engine/don-loop.ts";
import type { ResolutionItem } from "../../src/types.ts";
import { observeOptionalLoop } from "../../src/engine/optional-loop.ts";
const turn = process.argv[2] === "north" ? "north" : "south";
const other = turn === "south" ? "north" : "south";
const mode = process.argv[3] ?? "turn-zero";
const south = getCard("ST01-001"),
  north = getCard("ST02-001"),
  bootstrap = getCard("ST01-003"),
  drawer = getCard("ST01-004");
const add: Action = { action: "addDon", count: { amount: 1 }, state: "active" };
const give: Action = {
  action: "giveDon",
  target: { player: "self", self: true, zones: ["leader"], count: { amount: 1 } },
  count: { amount: 1 },
  donState: "active",
};
for (const card of [south, north])
  card.effects = {
    effects: [
      {
        trigger: "activateMain",
        actions: [add, give, { action: "returnDon", player: "self", amount: 1 }],
      },
      {
        trigger: "whenDonReturned",
        optional: true,
        actions: [
          ...(mode === "finite"
            ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
            : []),
          add,
          mode === "up-to" ? { ...give, count: { amount: 1, upTo: true } } : give,
          { action: "returnDon", player: "opponent", amount: 1 },
        ],
      },
    ],
  };
bootstrap.effects = {
  effects: [
    {
      trigger: "activateMain",
      actions: [
        { action: "addDon", player: "opponent", count: { amount: 1 }, state: "active" },
        { action: "returnDon", player: "opponent", amount: 1 },
      ],
    },
  ],
};
drawer.effects = {
  effects: [{ trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] }],
};
if (!south.effects) throw new Error("Missing synthetic south definition");
if (mode === "restriction")
  south.effects.permanentEffects = [
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
  south.effects.replacementEffects = [
    { replacedEvent: "ko", replacementAction: { action: "draw", player: "self", amount: 1 } },
  ];
const extra = getCard("ST01-005");
if (mode === "extra")
  extra.effects = {
    effects: [
      {
        trigger: "whenDonReturned",
        actions: [{ action: "addDon", count: { amount: 0 }, state: "active" }],
      },
    ],
  };
const fixture = (seat: "south" | "north") => ({
  leaderCardId: seat === "south" ? south.id : north.id,
  activeDon: seat === turn ? 0 : 1,
  donDeckCount: seat === turn ? 10 : mode === "choice" ? 8 : 9,
  character: [
    { card: bootstrap, attachedDon: mode === "choice" && seat === other ? 1 : 0 },
    drawer,
    ...(mode === "extra" && seat === turn ? [extra] : []),
  ],
  deck: ["ST01-005", "ST01-006", "ST01-007"],
});
let e = OnePieceTestEngine.create(fixture("south"), fixture("north"), { activeSeat: turn });
const resume = () => {
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
};
if (mode === "ledger") {
  const state = e.getState();
  beginDonIdentityProcess(state);
  e = OnePieceTestEngine.fromState(state);
}
if (mode === "admission") {
  // Unit boundary: whole opposing pool is deterministic, but only the validated two-source profile may admit it.
  const state = e.getState();
  const item: ResolutionItem = {
    kind: "effectAction",
    id: "audit-opponent",
    controller: turn,
    sourceInstanceId: e.leader(turn),
    action: { action: "returnDon", player: "opponent", amount: 1 },
  };
  const sources = optionalDonSources(state, item);
  if (
    sources?.length !== 2 ||
    !sources.includes(e.leader(turn)) ||
    !sources.includes(e.leader(other))
  )
    throw new Error("Two-source profile not validated");
  process.stdout.write(
    JSON.stringify({
      defaultAdmission: auditedDonTransition(state, item),
      singleAdmission: auditedDonTransition(state, item, e.leader(turn)),
      twoAdmission: auditedDonTransition(state, item, sources),
    }),
  );
  process.exit(0);
}
e.activateEffect(e.leader(turn), "activateMain", turn);
if (mode === "extra") {
  // Public bootstrap reaches ordinary effect-order choice; no unsupported cycle is executed.
  e.pendingDecision("readyEffectOrder", turn);
  const state = structuredClone(e.getState());
  state.promptQueue = [];
  const item: ResolutionItem = {
    kind: "effectAction",
    id: "audit-extra",
    controller: turn,
    sourceInstanceId: e.leader(turn),
    action: add,
  };
  if (optionalDonSources(state, item)) throw new Error("Third DON reaction was admitted");
  process.stdout.write(JSON.stringify({ excluded: true, status: e.getView(turn).status }));
  process.exit(0);
}
let restarted = false,
  rejected = 0;
if (mode === "mixed") {
  const state = structuredClone(e.getState()),
    boundary = state.optionalLoopEvidence?.[0];
  if (boundary?.donSourceInstanceIds?.length !== 2) throw new Error("Missing two-source evidence");
  state.promptQueue = [];
  state.optionalLoopEvidence = [
    { ...boundary, donSourceInstanceIds: undefined, donSourceInstanceId: e.leader(turn) },
  ];
  state.resolutionQueue = [
    {
      kind: "effectAction",
      id: "audit",
      controller: turn,
      sourceInstanceId: e.leader(turn),
      action: add,
    },
  ];
  observeOptionalLoop(state);
  if (state.optionalLoopEvidence)
    throw new Error("Single-source evidence crossed into two-source profile");
  state.optionalLoopEvidence = [boundary];
  state.resolutionQueue = [
    {
      kind: "effectAction",
      id: "audit-rest",
      controller: turn,
      sourceInstanceId: e.leader(turn),
      action: {
        action: "rest",
        target: { player: "self", self: true, zones: ["leader"], count: { amount: 1 } },
      },
    },
  ];
  observeOptionalLoop(state);
  if (state.optionalLoopEvidence) throw new Error("Two-source evidence crossed into rest profile");
  state.optionalLoopEvidence = [
    {
      ...boundary,
      donSourceInstanceIds: [e.leader(turn), e.findCardInZone(turn, "character", bootstrap)],
    },
  ];
  state.resolutionQueue = [
    {
      kind: "effectAction",
      id: "audit-membership",
      controller: turn,
      sourceInstanceId: e.leader(turn),
      action: add,
    },
  ];
  observeOptionalLoop(state);
  if (state.optionalLoopEvidence) throw new Error("Changed source membership reused evidence");
  state.optionalLoopEvidence = [boundary];
  if (!north.effects) throw new Error("Missing north definition");
  north.effects.effects = north.effects.effects?.filter((block) => !block.optional);
  observeOptionalLoop(state);
  if (state.optionalLoopEvidence)
    throw new Error("Two-source evidence crossed into one-source profile");
  process.stdout.write(JSON.stringify({ cleared: true }));
  process.exit(0);
}
if (["finite", "ledger", "restriction", "replacement", "choice", "up-to"].includes(mode)) {
  for (let i = 0; i < 8 && e.getView(turn).status === "active"; i++) {
    const seat = i % 2 ? other : turn;
    e.pendingDecision("effectOptional", seat);
    resume();
    e.resolveDecision("effectOptional", { optionId: "yes" }, seat);
    if (mode === "choice" || mode === "up-to") {
      e.pendingDecision(
        mode === "choice" ? "effectOpponentReturnDon" : "effectGiveDonCount",
        mode === "choice" ? other : turn,
      );
      break;
    }
  }
  if (!["choice", "up-to"].includes(mode) && e.getView(turn).status === "active")
    e.resolveDecision("effectOptional", { optionId: "no" }, turn);
} else {
  // Initial opposing active DON becomes attached. Those two distinct boundaries must not match.
  for (const seat of [turn, other, turn] as const) {
    e.pendingDecision("effectOptional", seat);
    resume();
    e.resolveDecision("effectOptional", { optionId: "yes" }, seat);
  }
  const turnCount =
    mode === "tie"
      ? 1
      : mode.startsWith("turn")
        ? mode.endsWith("zero")
          ? 0
          : Number.MAX_SAFE_INTEGER - 1
        : Number.MAX_SAFE_INTEGER;
  const otherCount =
    mode === "tie"
      ? 1
      : mode.startsWith("other")
        ? mode.endsWith("zero")
          ? 0
          : Number.MAX_SAFE_INTEGER - 1
        : Number.MAX_SAFE_INTEGER;
  for (const [seat, count] of [
    [turn, turnCount],
    [other, otherCount],
  ] as const) {
    const prompt = e.pendingDecision("loopIterations", seat);
    resume();
    for (const [actor, iterations] of [
      [seat === "south" ? "north" : "south", 0],
      [seat, -1],
      [seat, 0.5],
      [seat, Number.MAX_SAFE_INTEGER + 1],
    ] as const) {
      const failure = e.expectFailure({
        type: "resolvePrompt",
        seat: actor,
        promptId: prompt.id,
        iterations,
      });
      e = OnePieceTestEngine.fromState(failure.state);
      if (e.pendingDecision("loopIterations", seat).id !== prompt.id)
        throw new Error("Invalid declaration lost prompt");
      rejected++;
    }
    e.exec({ type: "resolvePrompt", seat, promptId: prompt.id, iterations: count });
    resume();
  }
  const stop = turnCount <= otherCount ? turn : other; // Existing engine tie policy.
  const start = () =>
    e.activateEffect(
      stop === turn ? e.leader(turn) : e.findCardInZone(turn, "character", bootstrap),
      "activateMain",
      turn,
    );
  const stopped = e.getView(turn);
  if (
    !stopped.logs.some((log) =>
      log.message.includes(`The loop repeats ${Math.min(turnCount, otherCount)} `),
    )
  )
    throw new Error("Wrong minimum declaration log");
  if (
    stopped.players[stop].leader.attachedDon !== 0 ||
    stopped.players[stop === turn ? other : turn].leader.attachedDon !== 1
  )
    throw new Error("Stopped at wrong DON boundary");
  start();
  if (e.getView(turn).prompts.length) throw new Error("Same-state loop restarted");
  if (!e.getView(turn).logs.some((log) => log.message.includes("cannot be restarted")))
    throw new Error("Missing restart refusal");
  e.activateEffect(e.findCardInZone(turn, "character", drawer), "activateMain", turn);
  start();
  restarted = Boolean(e.pendingDecision("effectOptional", stop));
  e.resolveDecision("effectOptional", { optionId: "no" }, stop);
}
const view = e.getView(turn);
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: e.getView("judge").prompts.length,
    turnAttached: view.players[turn].leader.attachedDon,
    otherAttached: view.players[other].leader.attachedDon,
    turnDeck: view.players[turn].donDeckCount,
    otherDeck: view.players[other].donDeckCount,
    restarted,
    rejected,
    stoppedBy: view.logs.findLast((log) => log.message.endsWith("stops the loop."))?.actor,
  }),
);
