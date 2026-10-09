// Synthetic native CR11 programs, not real-card infinite-loop claims.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
import { MandatoryLoopDetector } from "../../src/engine/mandatory-loop.ts";
import { beginDonIdentityProcess } from "../../src/engine/don-state.ts";
const mode = process.argv[2];
const seat = mode === "north" ? "north" : "south";
const card = getCard("ST01-001");
const give: Action = {
  action: "giveDon",
  target: { player: "self", self: true, zones: ["leader"], count: { amount: 1 } },
  count: { amount: 1 },
  donState: "active",
};
const returned: Action = { action: "returnDon", player: "self", amount: 1 };
const actions: Action[] = [
  ...(mode === "finite" ? [{ action: "draw" as const, player: "self" as const, amount: 1 }] : []),
  { action: "addDon", count: { amount: mode === "zero" ? 0 : 1 }, state: "active" },
  ...(mode === "simple" ? [] : [give]),
  returned,
];
card.effects = {
  effects: [
    { trigger: "activateMain", actions: [returned] },
    {
      trigger: "whenDonReturned",
      actions,
      ...(mode === "optional" ? { optional: true } : {}),
      ...(mode === "once" ? { oncePerTurn: true } : {}),
    },
  ],
};
const fixture = {
  leaderCardId: card.id,
  activeDon: mode === "choice" ? 2 : 1,
  donDeckCount: mode === "choice" ? 8 : 9,
  deck: ["ST01-003", "ST01-004"],
};
const engine = OnePieceTestEngine.create(
  seat === "south" ? fixture : {},
  seat === "north" ? fixture : {},
  { activeSeat: seat },
);
if (mode === "ledger" || mode === "restriction") {
  // Admission-unit controls intentionally do not execute an unsupported infinite program.
  const state = engine.getState();
  if (mode === "ledger") beginDonIdentityProcess(state);
  else
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
  state.resolutionQueue = [
    {
      kind: "effectAction",
      id: "audit",
      controller: seat,
      sourceInstanceId: state.players[seat].leaderInstanceId,
      action: { action: "addDon", count: { amount: 1 }, state: "active" },
    },
  ];
  const detector = new MandatoryLoopDetector();
  const admitted = detector.repeats(state) || detector.repeats(state);
  process.stdout.write(JSON.stringify({ admitted }));
} else {
  engine.activateEffect(engine.leader(seat), "activateMain", seat);
  const view = engine.getView(seat);
  process.stdout.write(
    JSON.stringify({
      status: view.status,
      finishReason: view.finishReason,
      prompts: view.prompts.length,
      deck: view.players[seat].deckCount,
      don:
        view.players[seat].activeDon +
        view.players[seat].restedDon +
        view.players[seat].donDeckCount +
        view.players[seat].leader.attachedDon,
    }),
  );
}
