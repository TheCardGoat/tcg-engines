// Synthetic native requirements; the parent supplies an external execution watchdog.
import "../../../cards/src/index.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

const giver = getCard("ST01-007");
const target = getCard("EB01-005");
const oldGiver = giver.effects;
const oldTarget = target.effects;
try {
  giver.effects = {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addActivationCosts",
            target: {
              player: "self",
              zones: ["character"],
              filters: [{ filter: "name", value: "Doma" }],
              count: { amount: 1 },
            },
            costs: [{ cost: "trashFromHand", amount: 21 }],
            duration: "thisTurn",
          },
        ],
      },
    ],
  };
  target.effects = {
    effects: [
      {
        trigger: "activateMain",
        costs: [{ cost: "trashFromHand", amount: 20 }],
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  };
  const handIds = [
    "ST01-002",
    "ST01-003",
    "ST01-004",
    "ST01-005",
    "ST01-006",
    "ST01-008",
    "ST01-009",
    "ST01-010",
    "ST01-011",
    "ST01-012",
  ];
  const engine = OnePieceTestEngine.create({
    leaderCardId: "ST01-001",
    character: [giver.id, target.id],
    hand: handIds.flatMap((id) => Array.from({ length: 4 }, () => id)),
    deck: ["ST01-013", "ST01-014"],
  });
  engine.asSouth().activateMain(giver.id);
  const result = engine.expectFailure({
    type: "activateEffect",
    seat: "south",
    sourceInstanceId: engine.findCardInZone("south", "character", target.id),
    trigger: "activateMain",
  });
  const view = OnePieceTestEngine.fromState(result.state).getView("south");
  console.log(
    JSON.stringify({
      rejected: !result.accepted,
      handCount: view.players.south.hand.length,
      trashCount: view.players.south.trash.length,
      prompts: view.prompts.length,
    }),
  );
} finally {
  giver.effects = oldGiver;
  target.effects = oldTarget;
}
