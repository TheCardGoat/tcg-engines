import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("parsed Teach keeps Character negation through the next opposing turn then expires", () => {
  const card = getCard("OP09-093"),
    original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", character: [{ card, playedOnTurn: 1 }] },
      { leaderCardId: "ST01-001", character: ["OP09-083"] },
    );
    const teach = e.findCardInZone("south", "character", card),
      augur = e.findCardInZone("north", "character", "OP09-083");
    e.asSouth().activateMain(teach);
    e.asSouth().chooseNoTargets();
    e.asSouth().chooseTargets(augur);
    e.asSouth().endTurn();
    e.expectFailure({
      type: "activateEffect",
      seat: "north",
      sourceInstanceId: augur,
      trigger: "activateMain",
    });
    e.asNorth().endTurn();
    e.asSouth().endTurn();
    e.asNorth().activateMain(augur);
    e.asNorth().declineOptional();
    expect(e.getView("north").prompts).toHaveLength(0);
  } finally {
    card.effects = original;
  }
});

test("parsed Kuzan requires a Character payment and resolves its position before discard", () => {
  const card = getCard("OP09-101"),
    original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const empty = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: [card], activeDon: 4 },
      { leaderCardId: "ST01-001", hand: ["ST02-002", "ST02-006"] },
    );
    empty.asSouth().play(card);
    expect(empty.getView("north").players.north.handCount).toBe(2);
    expect(empty.getView("south").prompts).toHaveLength(0);
    let e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: [card], activeDon: 4 },
      {
        leaderCardId: "ST01-001",
        character: ["ST02-002"],
        hand: ["ST02-002", "ST02-006"],
        life: ["ST01-011"],
      },
    );
    const paid = e.findCardInZone("north", "character", "ST02-002");
    e.asSouth().play(card);
    e.pendingDecision("effectLifePosition", "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");
    expect(e.getView("north").players.north.life.at(-1)).toMatchObject({
      instanceId: paid,
      cardId: "ST02-002",
    });
    e.asNorth().trashFromHand("ST02-006");
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").prompts).toHaveLength(0);
  } finally {
    card.effects = original;
  }
});
