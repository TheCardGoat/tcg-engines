import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("parsed Chopper gives zero then one DON to separate recipients", () => {
  const card = getCard("OP08-001"),
    original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const e = OnePieceTestEngine.create({
      leaderCardId: card,
      character: ["OP01-015", "OP08-016"],
      restedDon: 2,
    });
    const a = e.findCardInZone("south", "character", "OP01-015"),
      b = e.findCardInZone("south", "character", "OP08-016");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().chooseTargets(a, b);
    e.resolveDecision("effectGiveDonEachCount", { optionId: "0" }, "south");
    e.resolveDecision("effectGiveDonEachCount", { optionId: "1" }, "south");
    expect(
      e.getView("south").players.south.characters.flatMap((c) => (c ? [c.attachedDon] : [])),
    ).toEqual([0, 1]);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  } finally {
    card.effects = original;
  }
});

test("parsed protection still permits the controller's own Orlumbus KO", () => {
  const card = getCard("OP08-038"),
    original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: [card],
      activeDon: 1,
      character: ["OP04-079", "ST02-002"],
    });
    const id = e.findCardInZone("south", "character", "OP04-079");
    e.asSouth().play(card);
    e.asSouth().acceptOptional();
    e.asSouth().activateMain(id);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").players.south.deckCount).toBe(8);
  } finally {
    card.effects = original;
  }
});
