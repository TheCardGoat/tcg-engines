import { describe, expect, test } from "vite-plus/test";
import { st09PortgasDAce010, prb01Kaido003 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

function effectKo(engine: OnePieceTestEngine, ace: string) {
  engine.asSouth().play("OP04-038");
  engine.asSouth().chooseTargets();
  engine.asSouth().chooseTargets(ace);
}

describe("ST09-010 Portgas.D.Ace", () => {
  test.each(["top", "bottom"])(
    "battle replacement trashes %s Life after saved-state resume",
    (position) => {
      let e = OnePieceTestEngine.create(
        { character: [{ card: st09PortgasDAce010, rested: true }], life: ["ST09-003", "ST09-006"] },
        { character: [{ card: prb01Kaido003, playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const ace = e.findCardInZone("south", "character", "ST09-010");
      const paid = e.findCardInZone("south", "life", position === "top" ? "ST09-003" : "ST09-006");
      e.asNorth().attack(e.findCardInZone("north", "character", "ST04-003"), ace);
      e.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");
      const prompt = e.pendingDecision("effectLifePosition", "south");
      const step = prompt.steps[0];
      if (step?.kind !== "chooseOption") throw Error("Life position");
      expect(step.options.map((o) => o.id)).toEqual(["top", "bottom"]);
      expect(JSON.stringify(prompt)).not.toContain("Kouzuki Momonosuke");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: prompt.id,
        optionId: "middle",
      });
      expect(e.pendingDecision("effectLifePosition", "south").id).toBe(prompt.id);
      e.resolveDecision("effectLifePosition", { optionId: position }, "south");
      expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(ace);
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
      expect(e.getView("south").players.south.lifeCount).toBe(1);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );

  test("declines battle replacement and keeps Life while Ace is K.O.'d", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st09PortgasDAce010, rested: true }], life: 2 },
      { character: [{ card: prb01Kaido003, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ace = e.findCardInZone("south", "character", "ST09-010");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-003"), ace);
    e.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(ace);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });

  test("zero Life cannot replace an opponent's effect KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ card: st09PortgasDAce010, rested: true }], life: 0 },
    );
    const ace = e.findCardInZone("north", "character", "ST09-010");
    effectKo(e, ace);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(ace);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("accepted opposing effect replacement is spent for the next KO that turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      { character: [{ card: st09PortgasDAce010, rested: true }], life: ["ST09-003", "ST09-006"] },
    );
    const ace = e.findCardInZone("north", "character", "ST09-010");
    effectKo(e, ace);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(ace);
    effectKo(e, ace);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(ace);
    expect(e.getView("north").players.north.lifeCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  // The optional affected-card precedence in 8-1-3-4-2 remains unverified.
  // This covers current OPT bookkeeping, not official replacement ordering.
  test("current engine policy: choosing Rosinante first preserves Ace for a later KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      { character: [{ card: st09PortgasDAce010, rested: true }, "OP05-030"], life: 2 },
    );
    const ace = e.findCardInZone("north", "character", "ST09-010");
    const rosinante = e.findCardInZone("north", "character", "OP05-030");
    effectKo(e, ace);
    const step = e.pendingDecision("effectKoReplacement", "north").steps[0];
    if (step?.kind !== "chooseOption") throw Error("replacement chooser");
    const option = step.options.find((o) => o.label.includes("Rosinante"));
    if (!option) throw Error("Rosinante option");
    e.resolveDecision("effectKoReplacement", { optionId: option.id }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(rosinante);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    effectKo(e, ace);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectLifePosition", { optionId: "top" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(ace);
    expect(e.getView("north").players.north.lifeCount).toBe(1);
  });

  test("can replace own Kaido's effect KO", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST04-001",
      hand: ["OP01-094"],
      activeDon: 10,
      character: ["ST09-010"],
      life: 2,
    });
    const ace = e.findCardInZone("south", "character", "ST09-010");
    e.asSouth().play("OP01-094");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(ace);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.trash).toHaveLength(1);
  });

  test("replacement refreshes on the next turn without Ace leaving the field", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      { character: [{ card: st09PortgasDAce010, rested: true, playedOnTurn: 0 }], life: 2 },
    );
    const ace = e.findCardInZone("north", "character", "ST09-010");
    effectKo(e, ace);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectLifePosition", { optionId: "top" }, "north");
    e.asSouth().endTurn();
    e.asNorth().attack(ace, e.leader("south"));
    e.asSouth().chooseCounter();
    e.asNorth().endTurn();
    effectKo(e, ace);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectLifePosition", { optionId: "top" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(ace);
    expect(e.getView("north").players.north.lifeCount).toBe(0);
  });
});
