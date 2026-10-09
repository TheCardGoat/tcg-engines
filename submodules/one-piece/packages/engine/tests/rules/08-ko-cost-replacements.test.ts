import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function hakubaWith(payment: string) {
  return OnePieceTestEngine.create(
    {
      leaderCardId: "ST01-001",
      character: [{ cardId: "OP05-087", attachedDon: 1, playedOnTurn: 0 }, payment],
      deck: ["EB01-025", "EB01-005", "EB01-018"],
    },
    { leaderCardId: "ST01-001", character: ["EB01-018"] },
    { firstPlayer: "north", activeSeat: "south" },
  );
}

function attackAndPay(engine: OnePieceTestEngine) {
  engine.declareAttack(
    engine.findCardInZone("south", "character", "OP05-087"),
    engine.leader("north"),
    "south",
  );
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
}

describe("8-3-1-7 replacement of a K.O. activation cost", () => {
  // Official OP05 FAQ, page 6, Hakuba / Kyros: replacing the K.O. saves
  // Kyros but does not pay Hakuba's printed cost, so no cost reduction follows.
  test.each(["yes", "no"] as const)("Hakuba offers Kyros replacement, choice %s", (optionId) => {
    let engine = hakubaWith("OP04-082");
    const kyros = engine.findCardInZone("south", "character", "OP04-082");
    const opponent = engine.findCardInZone("north", "character", "EB01-018");
    attackAndPay(engine);
    const prompt = engine.pendingDecision("effectKoReplacement", "south");
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    expect(engine.pendingDecision("effectKoReplacement", "south").id).toBe(prompt.id);
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: prompt.id,
      optionId: "invalid",
    });
    expect(engine.pendingDecision("effectKoReplacement", "south").id).toBe(prompt.id);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    engine.resolveDecision("effectKoReplacement", { optionId }, "south");
    if (optionId === "no") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [opponent] }, "south");
    }
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === kyros)).toBe(
      optionId === "yes",
    );
    expect(view.players.south.leader.rested).toBe(optionId === "yes");
    expect(view.players.north.characters.find((card) => card?.instanceId === opponent)?.cost).toBe(
      optionId === "yes" ? 5 : 0,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("mandatory Thatch replacement draws but does not pay Hakuba's K.O. cost", () => {
    const engine = hakubaWith("OP08-045");
    const thatch = engine.findCardInZone("south", "character", "OP08-045");
    attackAndPay(engine);
    const view = engine.getView("south");
    expect(view.players.south.trash.some((card) => card.instanceId === thatch)).toBe(true);
    expect(view.players.south.handCount).toBe(1);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.north.characters[0]?.cost).toBe(5);
    expect(view.prompts).toHaveLength(0);
  });

  test("10-2-13-5: replacement consumes an activated once-per-turn cost attempt", () => {
    // Synthetic timing variant: no compatible real once-per-turn KO-cost card
    // and own-turn replacement has been established. Preserve the catalog.
    const hakuba = getCard("OP05-087");
    const original = hakuba.effects;
    const printed = original?.effects?.find((block) => block.trigger === "whenAttacking");
    if (!printed) throw new Error("Expected Hakuba's printed effect.");
    try {
      hakuba.effects = {
        ...original,
        effects: [{ ...printed, trigger: "activateMain", oncePerTurn: true }],
      };
      const engine = hakubaWith("OP04-082");
      const source = engine.findCardInZone("south", "character", "OP05-087");
      engine.activateEffect(source, "activateMain", "south");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
      expect(engine.getView("south").players.north.characters[0]?.cost).toBe(5);
      expect(
        engine.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: source,
          trigger: "activateMain",
        }).accepted,
      ).toBe(false);
    } finally {
      hakuba.effects = original;
    }
  });
});
