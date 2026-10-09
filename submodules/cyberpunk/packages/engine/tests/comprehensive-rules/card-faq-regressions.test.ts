import { create } from "mutative";
import { describe, expect, it } from "vite-plus/test";
import { structuredCards } from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../src/active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../src/testing/index.ts";
import { enqueueEventTriggers, continueTriggerResolution } from "../../src/ability-executor.ts";
import { createOperations } from "../../src/operations/index.ts";
import type { GameEvent } from "../../src/types/game-events.ts";
import type { MoveLog } from "../../src/logging/move-log.ts";
import { computeEffectiveCost } from "../../src/moves/compute-effective-cost.ts";
import type { CardDefinition } from "@tcg/cyberpunk-types";

const aliases: Record<string, string> = {
  "el-sombrero-n-la-venganza-lenta": "el-sombreron-la-venganza-lenta",
  "gilded-mato-n": "gilded-maton",
  "judy-a-lvarez-braindance-maestro": "judy-alvarez-braindance-maestro",
  "judy-a-lvarez-nothing-to-doubt": "judy-alvarez-nothing-to-doubt",
  "les-e-le-mens": "les-elemens",
  "muamar-reyes-el-capita-n": "muamar-reyes-el-capitan",
};
function card(slug: string): CardDefinition {
  const definition = structuredCards.find((c) => c.slug === (aliases[slug] ?? slug));
  if (!definition) throw new Error(`Missing authored card ${slug}`);
  return definition;
}
function faq(slug: string, number: number, run: () => void) {
  it(`${slug} FAQ ${number}`, run);
}
const corpo = card("corpo-security");
const operator = card("field-operator");
const cab = card("delamain-cab");
const floor = card("floor-it");
const nomad = card("riding-nomad");
function power(engine: CyberpunkTestEngine, definition: CardDefinition, player = P1) {
  return getEffectivePower(engine.getState(), engine.findCardId(definition, "field", player));
}
function acceptTrigger(engine: CyberpunkTestEngine, player = P1) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTrigger") throw new Error("Expected trigger choice");
  const option = choice.payload.options[0];
  if (!option) throw new Error("Expected a trigger option");
  engine.executeMove("resolveTrigger", { args: { triggerId: option.triggerId } }, player);
}

describe("Official card FAQ boundary regressions", () => {
  faq("afterparty-at-lizzie-s", 1, () => {
    const source = card("afterparty-at-lizzie-s");
    const e = CyberpunkTestEngine.createWithFixture({
      hand: [source],
      eddies: 1,
      deck: [corpo],
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
    });
    e.playCard(source, { as: P1 });
    e.resolveEffectTargetIds([], { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getHandCount(P1)).toBe(1);
    expect(e.getGigDice(P1).map((d) => d.faceValue)).toEqual([2, 3]);
  });
  faq("alt-cunningham-mother-of-daemons", 1, () => {
    const source = card("alt-cunningham-mother-of-daemons");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [source, { card: corpo, attachedGears: [card("riot-shield")] }],
        deck: [floor],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2 },
    );
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.useBlocker(corpo, { as: P1 });
    expect(e.getHandCount(P1)).toBe(1);
  });
  for (const [slug, mode] of [
    ["dexter-deshawn-off-the-grid", "buff"],
    ["padre-man-of-the-cross", "spend"],
    ["wakako-okada-peace-and-harmony", "weaken"],
  ] as const) {
    faq(slug, 1, () => {
      const source = card(slug);
      const e = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: source, faceDown: true }],
        eddies: 1,
      });
      e.callLegend(source, { as: P1 });
      e.resolveChooseEffect(mode, { as: P1 });
      e.expectNoPendingChoice();
      expect(e.getHandCount(P1)).toBe(0);
    });
  }
  for (const slug of ["corpo-security", "jacked-in-voodoo-boy"]) {
    faq(slug, 1, () => {
      const source = card(slug),
        racer = card("valentino-street-racer");
      const e = CyberpunkTestEngine.createWithFixture(
        { hand: [source, racer], eddies: 8 },
        { gigArea: [{ dieType: "d4", faceValue: 2 }] },
      );
      e.playCard(source, { as: P1 });
      e.playCard(racer, { as: P1 });
      e.resolveEffectTarget(source, { as: P1 });
      expect(getEffectiveRules(e.getState(), e.findCardId(source, "field", P1))).toContain(
        "adrenaline",
      );
      expect(e.expectFailure(() => e.attackRival(source, { as: P1 })).success).toBe(false);
    });
  }
  faq("detonate", 1, () => {
    const source = card("detonate"),
      legend = card("v-corporate-exile"),
      gear = card("kiroshi-optics");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 1 },
      { legendArea: [{ card: legend, faceDown: false, attachedGears: [gear] }] },
    );
    e.playCard(source, { as: P1 });
    e.resolveEffectTarget(gear, { as: P1 });
    expect(e.getCardsInZone("trash", P2).map((c) => c.definitionId)).toContain(gear.id);
    expect(e.getCard(legend, "legendArea", P2).meta.attachedGearIds).toEqual([]);
  });
  faq("detonate", 2, () => {
    const source = card("detonate");
    const e = CyberpunkTestEngine.createWithFixture({ hand: [source], eddies: 1 });
    e.playCard(source, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(source.id);
  });
  it("Bootleg current Sell reveal behavior (source conflict)", () => {
    const source = card("bootleg-black-sapphire-show");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], deck: [corpo], eddies: 5 },
      {},
      { preserveDeckOrder: true },
    );
    e.playCard(source, { as: P1 });
    const sold = e.getCardsInZone("eddieArea", P1).find((c) => c.definitionId === corpo.id);
    expect(sold?.meta.faceDown).toBe(true);
    expect(sold?.meta.revealed).toBe(true);
    expect(e.getEvents("cardsRevealed")).toHaveLength(1);
  });
  faq("bootleg-black-sapphire-show", 3, () => {
    const source = card("bootleg-black-sapphire-show");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source, floor], deck: [corpo], eddies: 5 },
      {},
      { preserveDeckOrder: true },
    );
    e.sellCard(floor, { as: P1 });
    e.playCard(source, { as: P1 });
    expect(e.getCardsInZone("eddieArea", P1).map((c) => c.definitionId)).toContain(corpo.id);
    expect(e.getEddies(P1)).toBe(2);
  });
  for (const slug of ["fool-on-the-hill", "three-mouths-one-desire"]) {
    faq(slug, 1, () => {
      const source = card(slug);
      const e = CyberpunkTestEngine.createWithFixture(
        { hand: [source], eddies: 3, deck: [corpo, operator, cab] },
        {},
        { preserveDeckOrder: true },
      );
      const before = e.getCardsInZone("deck", P1).map((c) => c.instanceId);
      e.playCard(source, { as: P1 });
      expect(e.getState().G.turnMetadata.pendingChoice).toBeDefined();
      expect(e.getCardsInZone("deck", P1).map((c) => c.instanceId)).toEqual(before);
    });
  }
  faq("tetratronic-rippler", 1, () => {
    const source = card("tetratronic-rippler");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: operator, hasLag: false, attachedGears: [source] }], deck: [cab] },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    const before = e.getCardsInZone("deck", P1).map((c) => c.instanceId);
    e.attackRival(operator, { as: P1 });
    expect(e.getState().G.turnMetadata.pendingChoice?.type).toBe("scry");
    expect(e.getCardsInZone("deck", P1).map((c) => c.instanceId)).toEqual(before);
  });
  faq("judy-a-lvarez-nothing-to-doubt", 1, () => {
    const source = card("judy-a-lvarez-nothing-to-doubt");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [{ card: source, hasLag: false }],
      eddies: 1,
      deck: 0,
    });
    e.activateAbility(source, 0, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(source, "field", P1).meta.spent).toBe(true);
    expect(e.isGameOver()).toBe(false);
  });
  faq("rita-wheeler-no-stupid-questions", 1, () => {
    const source = card("rita-wheeler-no-stupid-questions");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], deck: 0 },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    e.attackRival(source, { as: P1 });
    expect(e.isGameOver()).toBe(true);
    expect(e.getWinnerId()).toBe(P2);
  });
  faq("modded-kusanagi", 1, () => {
    const source = card("modded-kusanagi");
    const e = CyberpunkTestEngine.createWithFixture({ trash: [source] });
    e.completeTurn({ as: P1 });
    expect(e.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(source.id);
    expect(e.getCardsInZone("hand", P1).map((c) => c.definitionId)).not.toContain(source.id);
  });
  faq("panam-palmer-strength-through-family", 1, () => {
    const source = card("panam-palmer-strength-through-family"),
      legend = card("v-corporate-exile"),
      second = card("rogue-amendiares-preem-solo");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [source],
      legendArea: [
        { card: legend, faceDown: true },
        { card: second, faceDown: true },
      ],
    });
    e.callLegend(legend, { as: P1 });
    expect(e.expectFailure(() => e.callLegend(second, { as: P1 })).success).toBe(false);
    expect(e.getCard(second, "legendArea", P1).meta.faceDown).toBe(true);
  });
  faq("screw-lovelorn-fool", 2, () => {
    const source = card("screw-lovelorn-fool");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], trash: [source] },
      { field: [{ card: corpo, spent: true, powerModifier: 20 }] },
    );
    const old = e.findCardId(source, "trash", P1),
      defeated = e.findCardId(source, "field", P1);
    e.attackUnit(defeated, corpo, { as: P1 });
    e.resolveFullFight({ as: P1 });
    e.resolveEffectTarget(old, { as: P1 });
    expect(e.getCardsInZone("hand", P1).map((c) => c.instanceId)).toEqual([old]);
    expect(e.getCardsInZone("trash", P1).map((c) => c.instanceId)).toContain(defeated);
  });
  faq("shattered-memories", 1, () => {
    const source = card("shattered-memories");
    const e = CyberpunkTestEngine.createWithFixture({ hand: [source], eddies: 4 }, {});
    e.playCard(source, { as: P1 });
    e.resolveChooseEffect("draw", { as: P1 });
    e.resolveChooseEffect("draw", { as: P2 });
    expect(e.getHandCount(P1)).toBe(5);
    expect(e.getHandCount(P2)).toBe(5);
    expect(
      e
        .getEvents("cardMoved")
        .filter(
          (event) =>
            event.fromZone === "hand" &&
            event.toZone === "trash" &&
            event.cardId !== e.findCardId(source, "trash", P1),
        ),
    ).toHaveLength(0);
  });
  faq("viktor-vektor-sit-down-and-relax", 1, () => {
    const source = card("viktor-vektor-sit-down-and-relax"),
      gear = card("kiroshi-optics");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: source, faceDown: true }], deck: [gear, corpo], eddies: 1 },
      {},
      { preserveDeckOrder: true },
    );
    e.callLegend(source, { as: P1 });
    e.resolveScryTo("hand", [], { as: P1 });
    expect(e.getHandCount(P1)).toBe(0);
    expect(
      e
        .getCardsInZone("deck", P1)
        .slice(-5)
        .map((c) => c.definitionId),
    ).toContain(gear.id);
  });
  faq("valentino-guerrera", 1, () => {
    const source = card("valentino-guerrera");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], gigArea: [{ dieType: "d6", faceValue: 5 }] },
      { field: [corpo], gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    e.attackUnit(source, corpo, { as: P1 });
    e.resolveAttack({ as: P1 });
    expect(e.expectFailure(() => e.useBlocker(corpo, { as: P2 })).success).toBe(false);
  });
  faq("sandayu-oda-hanako-s-guardian", 1, () => {
    const source = card("sandayu-oda-hanako-s-guardian");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 7 },
      { field: [operator] },
    );
    e.playCard(source, { as: P1 });
    expect(e.expectFailure(() => e.attackUnit(source, operator, { as: P1 })).errorCode).toBe(
      "TARGET_READY",
    );
  });
  faq("towerfall", 1, () => {
    const source = card("towerfall");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 6, gigArea: [{ dieType: "d4", faceValue: 2 }] },
      { gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );
    e.playCard(source, { as: P1 });
    const choice = e.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseEffect");
    if (!choice || choice.type !== "chooseEffect") throw new Error("Expected modes");
    expect(choice.payload.options.map((o) => o.id)).not.toContain("both");
  });
  faq("deadman-transmitter", 2, () => {
    const source = card("deadman-transmitter"),
      zealots = card("maelstrom-zealots");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: zealots, hasLag: false, attachedGears: [source] }] },
      { field: [{ card: nomad, spent: true }] },
    );
    e.attackUnit(zealots, nomad, { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getCardsInZone("trash", P2).map((c) => c.definitionId)).toContain(nomad.id);
    expect(e.getCardsInZone("field", P1).map((c) => c.definitionId)).toContain(zealots.id);
  });
  faq("kerry-eurodyne-the-last-rockerboy", 2, () => {
    const source = card("kerry-eurodyne-the-last-rockerboy");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [{ card: source, hasLag: false }],
      gigArea: [{ dieType: "d4", faceValue: 4 }],
    });
    e.activateAbility(source, 0, { as: P1 });
    expect(e.getCard(source, "field", P1).meta.spent).toBe(true);
    expect(e.getHandCount(P1)).toBe(0);
    e.expectNoPendingChoice();
  });
  faq("maman-brigitte-spirit-of-death", 1, () => {
    const source = card("maman-brigitte-spirit-of-death");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source, floor], eddies: 5 },
      { field: [corpo] },
    );
    e.playCard(source, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(floor, "hand", P1)).toBeDefined();
    expect(e.getCard(corpo, "field", P2)).toBeDefined();
  });

  faq("river-ward-detective-on-the-hunt", 1, () => {
    const source = card("river-ward-detective-on-the-hunt");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: false }],
    });
    e.activateAbility(source, 1, { as: P1 });
    e.resolveEffectTargetIds([e.findCardId(source, "legendArea", P1)], { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(source, "legendArea", P1).meta.spent).toBe(true);
  });
  faq("el-sombrero-n-la-venganza-lenta", 3, () => {
    const source = card("el-sombrero-n-la-venganza-lenta");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], eddies: 2 },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    e.attackRival(source, { as: P1 });
    acceptTrigger(e);
    expect(e.getEddies(P1)).toBe(0);
    expect(power(e, source)).toBe(4);
    e.expectNoPendingChoice();
  });

  faq("6th-street-recruits", 1, () => {
    const source = card("6th-street-recruits"),
      heavy = card("maxtac-heavy");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          source,
          { card: heavy, hasLag: false, attachedGears: [card("adrenaline-converter")] },
        ],
        gigArea: [{ dieType: "d10", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d6", faceValue: 2, source: "rival" },
        ],
      },
      { combatProgression: "manual" },
    );
    e.attackRival(heavy, { as: P1 });
    e.resolveAttack({ as: P1 });
    e.resolveAttack({ as: P2, pass: true });
    e.resolveAttack({ as: P1, gigIdsToSteal: e.getGigDice(P2).map((d) => d.id) });
    expect(e.getGigCount(P2)).toBe(0);
    for (const value of [2, 3]) {
      if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
      e.resolveEffectTargetIds([e.findGigIdByType(P1, "d10")], {
        as: P1,
        allowPendingChoice: true,
        reason: "Choose the increased face",
      });
      e.resolveAdjustGig(value, { as: P1 });
    }
    e.expectNoPendingChoice();
    expect(e.getGigDice(P1).find((d) => d.dieType === "d10")?.faceValue).toBe(3);
  });
  faq("maelstrom-goons", 1, () => {
    const source = card("maelstrom-goons");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: source,
            hasLag: false,
            powerModifier: 4,
            attachedGears: [card("adrenaline-converter")],
          },
        ],
      },
      {
        hand: [floor, cab],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      { combatProgression: "manual" },
    );
    e.attackRival(source, { as: P1 });
    e.resolveAttack({ as: P1 });
    e.resolveAttack({ as: P2, pass: true });
    e.resolveAttack({ as: P1, gigIdsToSteal: e.getGigDice(P2).map((d) => d.id) });
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget")
      e.resolveDiscardFromHand([floor], { as: P2 });
    e.expectNoPendingChoice();
    expect(e.getHandCount(P2)).toBe(0);
    expect(e.getCardsInZone("trash", P2).map((c) => c.definitionId)).toEqual(
      expect.arrayContaining([floor.id, cab.id]),
    );
  });
  faq("kerry-eurodyne-the-last-rockerboy", 3, () => {
    const source = card("kerry-eurodyne-the-last-rockerboy");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [{ card: source, hasLag: false }],
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });
    e.activateAbility(source, 0, { as: P1 });
    e.judgeReadyCard(source, { as: P1 });
    e.activateAbility(source, 0, { as: P1 });
    expect(e.getHandCount(P1)).toBe(4);
    expect(e.getCard(source, "field", P1).meta.spent).toBe(true);
  });
  faq("evelyn-parker-beautiful-enigma", 1, () => {
    const source = card("evelyn-parker-beautiful-enigma");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        eddies: 1,
        gigArea: [{ dieType: "d20", faceValue: 20 }],
      },
      { field: [{ card: operator, hasLag: false }] },
    );
    e.activateAbility(source, 1, { as: P1 });
    e.completeTurn({ as: P1 });
    e.attackRival(operator, { as: P2 });
    e.resolveFullSteal({ as: P2 });
    e.judgeReadyCard(operator, { as: P2 });
    expect(e.expectFailure(() => e.completeTurn({ as: P2 })).errorCode).toBe("MUST_ATTACK");
  });
  faq("evelyn-parker-beautiful-enigma", 2, () => {
    const source = card("evelyn-parker-beautiful-enigma");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        eddies: 1,
        gigArea: [{ dieType: "d20", faceValue: 20 }],
      },
      { field: [{ card: operator, hasLag: false }], hand: [cab], eddies: 4 },
    );
    e.activateAbility(source, 1, { as: P1 });
    e.completeTurn({ as: P1 });
    e.playCard(cab, { as: P2 });
    expect(e.getCard(cab, "field", P2)).toBeDefined();
    expect(e.expectFailure(() => e.completeTurn({ as: P2 })).errorCode).toBe("MUST_ATTACK");
  });

  faq("jackie-welles-pour-one-out-for-me", 1, () => {
    const source = card("jackie-welles-pour-one-out-for-me");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: true }],
      hand: [cab, card("mox-inciters")],
      eddies: 10,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });
    e.playCard(cab, { as: P1 });
    e.callLegend(source, { as: P1 });
    const before = e.getHandCount(P1);
    e.playCard(card("mox-inciters"), { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getHandCount(P1)).toBe(before - 1);
    expect(e.getGigDice(P1)[0]?.faceValue).toBe(3);
  });
  faq("yorinobu-arasaka-embracing-destruction", 1, () => {
    const source = card("yorinobu-arasaka-embracing-destruction");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: true }],
        field: [
          { card: operator, hasLag: false },
          { card: operator, hasLag: false },
        ],
        eddies: 1,
        gigArea: [{ dieType: "d20", faceValue: 20 }],
      },
      { field: [{ card: nomad, spent: true }], gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    const ids = e.getCardsInZone("field", P1).map((c) => c.instanceId);
    e.attackUnit(ids[0]!, nomad, { as: P1 });
    e.resolveFullFight({ as: P1 });
    e.callLegend(source, { as: P1 });
    const before = e.getHandCount(P1);
    e.attackRival(ids[1]!, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getHandCount(P1)).toBe(before);
  });

  faq("mt0d12-flathead", 2, () => {
    const source = card("mt0d12-flathead"),
      reaction = floor;
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], gigArea: [{ dieType: "d6", faceValue: 4 }] },
      {
        field: [corpo],
        hand: [reaction],
        eddies: 0,
        legendArea: [
          {
            card: card("wakako-okada-peace-and-harmony"),
            faceDown: false,
            attachedGears: [card("zetatech-faceplate")],
          },
        ],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
    );
    e.attackRival(source, { as: P1 });
    e.resolveAttack({ as: P1 });
    e.playCard(reaction, { as: P2 });
    e.resolveEffectTarget(source, {
      as: P2,
      allowPendingChoice: true,
      reason: "Resolve the payment Faceplate after Floor It",
    });
    e.resolveEffectTargetIds([e.findGigIdByType(P2, "d8")], {
      as: P2,
      allowPendingChoice: true,
      reason: "Choose a reduced face",
    });
    e.resolveAdjustGig(4, { as: P2 });
    expect(e.getStreetCred(P1)).toBe(e.getStreetCred(P2));
    expect(e.expectFailure(() => e.useBlocker(corpo, { as: P2 })).errorCode).toBe(
      "CANT_BE_BLOCKED",
    );
  });
  faq("take-control", 1, () => {
    const source = card("take-control"),
      appetite = card("appetite-for-destruction");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        hand: [source],
        eddies: 2,
        field: [{ card: corpo, spent: true }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        hand: [appetite],
        eddies: 3,
        field: [{ card: nomad, hasLag: false, attachedGears: [card("gorilla-arms")] }],
      },
      { activePlayerId: P2 },
    );
    e.playCard(appetite, { as: P2 });
    e.attackUnit(nomad, corpo, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.playCard(source, { as: P1 });
    e.resolveFullFight({ as: P2 });
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget")
      e.resolveEffectTargetIds([e.findGigIdByType(P1, "d4")], { as: P2 });
    e.expectNoPendingChoice();
    expect(e.getGigCount(P1)).toBe(1);
    expect(e.getEvents("gigStolen")).toHaveLength(0);
  });
  faq("take-control", 2, () => {
    const source = card("take-control");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        hand: [source],
        eddies: 2,
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      { field: [{ card: operator, hasLag: false, attachedGears: [card("gorilla-arms")] }] },
      { activePlayerId: P2 },
    );
    e.attackRival(operator, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.playCard(source, { as: P1 });
    e.resolveFullSteal({ as: P2 });
    e.expectNoPendingChoice();
    expect(e.getGigCount(P1)).toBe(2);
    expect(e.getEvents("gigStolen")).toHaveLength(0);
  });

  for (const slug of [
    "carnage-at-the-colosseum",
    "maxtac-heavy",
    "octant",
    "trauma-team-operatives",
    "we-gotta-live-together",
    "zetatech-berserk",
  ]) {
    faq(slug, 1, () => {
      const source = card(slug),
        legend = card("wakako-okada-peace-and-harmony");
      const e = CyberpunkTestEngine.createWithFixture(
        {
          hand: [source],
          eddies: 10,
          field: [cab],
          trash: [operator],
          legendArea: [{ card: legend, faceDown: false }],
          gigArea: [{ dieType: "d8", faceValue: 8 }],
        },
        {
          field: [corpo],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
        },
      );
      const id = e.findCardId(source, "hand", P1),
        printed = source.cost;
      const cost = computeEffectiveCost(e.getState(), id, P1);
      expect(cost).toBeLessThan(printed!);
      if (source.type === "gear") e.attachGear(source, cab, { as: P1 });
      else e.playCard(source, { as: P1 });
      expect(e.getEddies(P1)).toBe(10 - cost);
      expect(source.cost).toBe(printed);
      expect(e.getState().G.cardIndex[id]?.definitionId).toBe(source.id);
    });
  }
  for (const [slug, number] of [
    ["caliber-totentanz-s-top-dog", 1],
    ["minotaur", 2],
    ["pacifica-netrunner", 1],
    ["royce-don-t-call-me-simon", 1],
  ] as const) {
    faq(slug, number, () => {
      const source = card(slug);
      const e = CyberpunkTestEngine.createWithFixture(
        { hand: [source], eddies: 10, gigArea: [{ dieType: "d20", faceValue: 20 }] },
        { field: [corpo, corpo] },
      );
      e.playCard(source, { as: P1 });
      expect(e.executeMove("resolveEffectTarget", { args: { pass: true } }, P1)).toMatchObject({
        success: false,
        errorCode: "CANNOT_PASS",
      });
      expect(e.getCardsInZone("field", P2)).toHaveLength(2);
    });
  }
  faq("minotaur", 1, () => {
    const source = card("minotaur");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 7 },
      { field: [corpo], gigArea: [{ dieType: "d4", faceValue: 4 }] },
    );
    e.playCard(source, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(source, "field", P1)).toBeDefined();
    expect(e.getCard(corpo, "field", P2)).toBeDefined();
  });
  faq("offduty-malfini", 1, () => {
    const source = card("offduty-malfini");
    const e = CyberpunkTestEngine.createWithFixture({ hand: [source], eddies: 4 });
    e.playCard(source, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(source, "field", P1).meta.spent).toBe(true);
  });
  faq("mt0d12-flathead", 1, () => {
    const source = card("mt0d12-flathead");
    const e = CyberpunkTestEngine.createWithFixture({ hand: [source] });
    e.sellCard(source, { as: P1 });
    expect(e.getEddies(P1)).toBe(1);
    expect(e.getCard(source, "eddieArea", P1).meta.faceDown).toBe(true);
  });
  faq("misty-olszewski-mender-of-broken-spirits", 2, () => {
    const source = card("misty-olszewski-mender-of-broken-spirits");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [source], deck: [corpo], spentEddies: 1 },
      {},
      { preserveDeckOrder: true },
    );
    e.completeTurn({ as: P1 });
    e.resolveCardTypeChoice("legend", { as: P1 });
    expect(e.getCard(corpo, "trash", P1)).toBeDefined();
    expect(e.getEddies(P1)).toBe(0);
  });
  faq("v-corporate-exile", 1, () => {
    const source = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: source, faceDown: false }], eddies: 5 },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    const id = e.findCardId(source, "legendArea", P1);
    e.executeMove("playCard", { args: { cardId: id } }, P1);
    e.expectNoPendingChoice();
    expect(e.getCard(source, "field", P1).meta.hasLag).toBe(true);
    expect(e.getCard(source, "field", P1).meta.spent).toBe(false);
    expect(e.getEddies(P1)).toBe(0);
    expect(e.expectFailure(() => e.attackRival(source, { as: P1 })).success).toBe(false);
  });
  it("does not play attached Gear from the Legend area as a Legend", () => {
    const legend = card("v-corporate-exile"),
      gear = card("kiroshi-optics");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: legend, faceDown: false, attachedGears: [gear] }],
      eddies: 5,
    });
    const gearId = e.findCardId(gear, "legendArea", P1);
    const move = e.getPrompt(P1).availableMoves.find((m) => m.moveId === "playCard");
    if (!move || move.inputSpec.type !== "playCard")
      throw new Error("Expected Legend play candidates");
    expect(move.inputSpec.candidates.map((c) => c.cardId)).not.toContain(gearId);
    expect(
      e.executeMove(
        "playCard",
        { args: { cardId: gearId, attachToId: e.findCardId(legend, "legendArea", P1) } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "CARD_NOT_IN_HAND" });
  });
  faq("wild-in-the-streets", 1, () => {
    const source = card("wild-in-the-streets");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 5, field: [cab] },
      { field: [corpo] },
    );
    e.playCard(source, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(source, "trash", P1)).toBeDefined();
    expect(e.getCard(cab, "field", P1)).toBeDefined();
  });
  faq("wild-in-the-streets", 3, () => {
    const source = card("wild-in-the-streets");
    const e = CyberpunkTestEngine.createWithFixture({
      hand: [source],
      eddies: 5,
      field: [{ card: cab, spent: true }],
    });
    e.playCard(source, { as: P1 });
    expect(e.executeMove("resolveEffectTarget", { args: { pass: true } }, P1)).toMatchObject({
      success: false,
      errorCode: "CANNOT_PASS",
    });
    e.resolveEffectTarget(cab, { as: P1 });
    expect(e.getCard(cab, "trash", P1)).toBeDefined();
  });

  faq("alt-cunningham-soulkiller-architect", 1, () => {
    const alt = card("alt-cunningham-soulkiller-architect"),
      program = card("wild-in-the-streets");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: alt, faceDown: false }],
      trash: [program],
      eddies: 5,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });
    e.activateAbility(alt, 0, { as: P1 });
    e.judgeReadyCard(alt, { as: P1 });
    e.activateAbility(alt, 1, { as: P1 });
    e.resolveEffectTarget(program, { as: P1 });
    expect(e.getEddies(P1)).toBe(0);
    expect(e.getCard(program, "deck", P1)).toBeDefined();
    e.expectNoPendingChoice();
  });
  faq("alt-cunningham-soulkiller-architect", 2, () => {
    const alt = card("alt-cunningham-soulkiller-architect"),
      program = card("wild-in-the-streets");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: alt, faceDown: false }],
      hand: [program],
      eddies: 5,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });
    e.activateAbility(alt, 0, { as: P1 });
    e.judgeReadyCard(alt, { as: P1 });
    e.activateAbility(alt, 0, { as: P1 });
    e.playCard(program, { as: P1 });
    expect(e.getEddies(P1)).toBe(2);
  });
  faq("panam-palmer-nomad-cavalry", 1, () => {
    const source = card("panam-palmer-nomad-cavalry"),
      gear = card("riot-shield");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [operator],
      legendArea: [{ card: source, faceDown: false, attachedGears: [gear] }],
      eddies: 2,
    });
    e.activateAbility(source, 0, { as: P1 });
    e.resolveEffectTarget(gear, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCard(operator, "field", P1).meta).toMatchObject({
      spent: false,
      attachedGearIds: [e.findCardId(gear, "field", P1)],
    });
  });
  faq("royce-psycho-on-the-edge", 1, () => {
    const source = card("royce-psycho-on-the-edge"),
      gear = card("riot-shield");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: false }],
      hand: [gear],
      eddies: 5,
    });
    const id = e.findCardId(source, "legendArea", P1);
    expect(
      e.executeMove(
        "playCard",
        { args: { cardId: e.findCardId(gear, "hand", P1), attachToId: id } },
        P1,
      ).success,
    ).toBe(true);
    expect(e.getCard(source, "legendArea", P1).meta.attachedGearIds).toHaveLength(1);
    expect(getEffectivePower(e.getState(), id)).toBe(source.power! + gear.power! + 2);
  });
  faq("goro-takemura-hands-unclean", 1, () => {
    const source = card("goro-takemura-hands-unclean");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: source, faceDown: false }] },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2 },
    );
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    expect(
      e.executeMove(
        "useBlocker",
        { args: { blockerId: e.findCardId(source, "legendArea", P1) } },
        P1,
      ).success,
    ).toBe(false);
  });
  faq("johnny-silverhand-rocking-renegade", 2, () => {
    const source = card("johnny-silverhand-rocking-renegade");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        field: [{ card: operator, hasLag: false }],
        eddies: 2,
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    e.activateAbility(source, 0, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(operator, { as: P1 });
    e.attackRival(operator, { as: P1 });
    e.resolveFullSteal({ as: P1 });
    expect(e.getGigCount(P1)).toBe(1);
  });
  faq("overwatch-panam-s-gift", 1, () => {
    const source = card("overwatch-panam-s-gift");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: operator, attachedGears: [source] }] },
      { field: [corpo] },
    );
    const before = e.getCard(operator, "field", P1).meta.spent;
    expect(e.expectFailure(() => e.activateAbility(source, 0, { as: P1 })).success).toBe(false);
    expect(e.getCard(operator, "field", P1).meta.spent).toBe(before);
    expect(e.getCard(corpo, "field", P2)).toBeDefined();
  });
  faq("satori-sword-of-saburo", 1, () => {
    const source = card("satori-sword-of-saburo");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: operator, hasLag: false, attachedGears: [source] }], deck: [floor] },
      { field: [{ card: corpo, powerModifier: 2, spent: true }] },
    );
    expect(power(e, operator)).toBe(power(e, corpo, P2));
    e.attackUnit(operator, corpo, { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getHandCount(P1)).toBe(0);
    expect(e.getCard(operator, "trash", P1)).toBeDefined();
    expect(e.getCard(corpo, "trash", P2)).toBeDefined();
  });
  faq("v-streetkid", 3, () => {
    const source = card("v-streetkid"),
      first = card("three-mouths-one-desire"),
      second = card("shattered-memories");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: source, faceDown: true }], deck: [first, second, corpo], eddies: 1 },
      {},
      { preserveDeckOrder: true },
    );
    e.callLegend(source, { as: P1 });
    e.resolveEffectTarget(first, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getHandCount(P1)).toBe(1);
    expect(e.getCard(second, "trash", P1)).toBeDefined();
  });
  faq("goro-takemura-vengeful-bodyguard", 1, () => {
    const source = card("goro-takemura-vengeful-bodyguard");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        field: [{ card: operator, hasLag: true }],
        eddies: 1,
      },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2 },
    );
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.activateAbility(source, 1, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(operator, { as: P1 });
    e.useBlocker(operator, { as: P1 });
    expect(e.getState().G.attackState?.defenderId).toBe(e.findCardId(operator, "field", P1));
  });
  faq("goro-takemura-vengeful-bodyguard", 3, () => {
    const source = card("goro-takemura-vengeful-bodyguard");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        field: [{ card: corpo, attachedGears: [card("riot-shield")] }],
        hand: [floor],
        deck: 0,
      },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2 },
    );
    for (const c of e.getCardsInZone("deck", P1))
      e.judgeMoveCardToZone(c.instanceId, "trash", { as: P1 });
    expect(e.getCardsInZone("deck", P1)).toHaveLength(0);
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.useBlocker(corpo, { as: P1 });
    e.resolveDiscardFromHand([floor], { as: P1 });
    expect(e.getWinnerId()).toBe(P2);
    expect(e.getCard(floor, "trash", P1)).toBeDefined();
  });
  faq("judy-a-lvarez-braindance-maestro", 2, () => {
    const source = card("judy-alvarez-braindance-maestro"),
      program = card("afterparty-at-lizzie-s");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        field: [operator],
        hand: [program, program],
        eddies: 4,
        deck: [program],
      },
      {},
      { preserveDeckOrder: true },
    );
    const before = power(e, operator);
    e.playCard(program, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(operator, { as: P1 });
    expect(power(e, operator)).toBe(before + 1);
    e.playCard(program, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(operator, { as: P1 });
    expect(power(e, operator)).toBe(before + 2);
  });
  faq("judy-a-lvarez-braindance-maestro", 4, () => {
    const source = card("judy-alvarez-braindance-maestro");
    // The FAQ assumes a QUICK BRAINDANCE Program. Current retail has none.
    const program: CardDefinition = {
      ...card("afterparty-at-lizzie-s"),
      id: "faq-quick-braindance",
      keywords: ["quick"],
    };
    expect(program.classifications).toContain("Braindance");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        field: [operator],
        hand: [program],
        eddies: 2,
      },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2 },
    );
    const before = power(e, operator);
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.playCard(program, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(operator, { as: P1 });
    expect(power(e, operator)).toBe(before + 1);
  });
  faq("tyger-s-whisper", 1, () => {
    const source = card("tyger-s-whisper"),
      legend = card("wakako-okada-peace-and-harmony");
    const e = CyberpunkTestEngine.createWithFixture({
      hand: [source],
      eddies: 2,
      legendArea: [{ card: legend, faceDown: true, spent: true }],
    });
    e.playCard(source, { as: P1 });
    e.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    for (const c of e.getCardsInZone("legendArea", P1)) e.judgeSpendCard(c.instanceId, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.expectFailure(() => e.callLegend(legend, { as: P1 })).success).toBe(false);
    expect(e.getCard(legend, "legendArea", P1).meta.faceDown).toBe(true);
  });
  faq("maxtac-suppression-team", 1, () => {
    const source = card("maxtac-suppression-team"),
      legend = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: legend, faceDown: false }], eddies: 5 },
      { field: [source], gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    expect(
      e.executeMove("goSolo", { args: { cardId: e.findCardId(legend, "legendArea", P1) } }, P1)
        .success,
    ).toBe(true);
    expect(e.expectFailure(() => e.attackRival(legend, { as: P1 })).success).toBe(false);
  });
  faq("swordwise-huscle", 1, () => {
    const source = card("swordwise-huscle");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], deck: [floor] },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    e.attackRival(source, { as: P1 });
    expect(e.getHandCount(P1)).toBe(0);
    e.judgeSetCardMeta(source, { powerModifier: 3 }, { as: P1 });
    expect(power(e, source)).toBe(6);
    e.resolveFullSteal({ as: P1 });
    expect(e.getHandCount(P1)).toBe(0);
  });
  faq("viktor-vektor-drop-your-illusions", 1, () => {
    const source = card("viktor-vektor-drop-your-illusions"),
      gear = card("netwatch-netdriver");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [source], hand: [gear] },
      {},
      { activePlayerId: P2 },
    );
    expect(computeEffectiveCost(e.getState(), e.findCardId(gear, "hand", P1), P1)).toBe(1);
    expect(gear.cost).toBe(3);
  });
  for (const slug of ["netwatch-netdriver", "zetatech-faceplate"]) {
    faq(slug, 1, () => {
      const gear = card(slug);
      const e = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: operator, hasLag: false, attachedGears: [gear] }],
          deck: [floor],
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );
      e.attackRival(operator, { as: P1 });
      expect(e.getState().G.attackState?.step).toBe("attack");
      if (slug === "zetatech-faceplate") {
        expect(e.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
        e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 3, { as: P1 });
        expect(e.getGigDice(P1)[0]?.faceValue).toBe(3);
      } else expect(e.getHandCount(P1)).toBe(1);
      e.expectNoPendingChoice();
      e.resolveAttack({ as: P1 });
      expect(e.getState().G.attackState?.step).toBe("react");
    });
    faq(slug, 3, () => {
      const gear = card(slug),
        source = card("judy-alvarez-nothing-to-doubt");
      const e = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: source, hasLag: false, attachedGears: [gear] }],
          deck: [corpo, floor],
          eddies: 1,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {},
        { preserveDeckOrder: true },
      );
      e.activateAbility(source, 0, { as: P1 });
      expect(e.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
      expect(e.getHandCount(P1)).toBe(0);
      e.executeMove("resolveCardToPlay", { args: { pass: true } }, P1);
      expect(e.getCard(corpo, "hand", P1)).toBeDefined();
      if (slug === "zetatech-faceplate") {
        expect(e.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
        e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 3, { as: P1 });
        expect(e.getHandCount(P1)).toBe(1);
      } else expect(e.getCard(floor, "hand", P1)).toBeDefined();
    });
    faq(slug, 4, () => {
      const gear = card(slug),
        legend = card("v-corporate-exile");
      const e = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: legend, faceDown: false, attachedGears: [gear] }],
          hand: [floor],
          deck: [corpo, cab],
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        { field: [nomad] },
        { preserveDeckOrder: true },
      );
      expect(
        e.executeMove(
          "playCard",
          {
            args: {
              cardId: e.findCardId(floor, "hand", P1),
              paymentSourceIds: [e.findCardId(legend, "legendArea", P1)],
            },
          },
          P1,
        ).success,
      ).toBe(true);
      // Payment triggers must wait through the Program's target choice.
      expect(e.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
      expect(e.getHandCount(P1)).toBe(0);
      if (slug === "zetatech-faceplate")
        e.resolveEffectTarget(nomad, {
          as: P1,
          allowPendingChoice: true,
          reason: "Resolve the payment Faceplate after Floor It.",
        });
      else e.resolveEffectTarget(nomad, { as: P1 });
      expect(power(e, nomad, P2)).toBe(nomad.power! - 1);
      expect(e.getCard(corpo, "hand", P1)).toBeDefined();
      if (slug === "zetatech-faceplate")
        e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 3, { as: P1 });
      else expect(e.getCard(cab, "hand", P1)).toBeDefined();
      e.expectNoPendingChoice();
    });
    for (const gearFirst of [true, false]) {
      it(`${slug} FAQ 2 (${gearFirst ? "spend first" : "attack first"})`, () => {
        const gear = card(slug),
          source = card("swordwise-huscle");
        const e = CyberpunkTestEngine.createWithFixture(
          {
            field: [{ card: source, hasLag: false, attachedGears: [gear] }],
            deck: [floor, cab],
            gigArea: [{ dieType: "d4", faceValue: 2 }],
          },
          { gigArea: [{ dieType: "d6", faceValue: 3 }] },
          { preserveDeckOrder: true },
        );
        e.attackRival(source, { as: P1 });
        const choice = e.getState().G.turnMetadata.pendingChoice;
        if (!choice || choice.type !== "chooseTrigger")
          throw new Error("Expected spend/ATTACK order choice");
        expect(choice.payload.options).toHaveLength(2);
        const selected = choice.payload.options.find(
          (o) => o.sourceCardId === e.findCardId(gearFirst ? gear : source, "field", P1),
        );
        expect(selected).toBeDefined();
        e.executeMove("resolveTrigger", { args: { triggerId: selected!.triggerId } }, P1);
        if (slug === "zetatech-faceplate")
          e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 3, { as: P1 });
        e.expectNoPendingChoice();
        expect(e.getHandCount(P1)).toBe(slug === "netwatch-netdriver" ? 2 : 1);
        expect(e.getState().G.attackState?.step).toBe("attack");
      });
    }
  }
  faq("v-streetkid", 2, () => {
    const source = card("v-streetkid");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: source, faceDown: true }], deck: [corpo, cab], eddies: 1 },
      {},
      { preserveDeckOrder: true },
    );
    const top = e
      .getCardsInZone("deck", P1)
      .slice(0, 2)
      .map((c) => c.instanceId);
    for (const c of e.getCardsInZone("deck", P1).slice(2))
      e.judgeMoveCardToZone(c.instanceId, "removedFromGame", { as: P1 });
    expect(e.getCardsInZone("deck", P1)).toHaveLength(2);
    e.callLegend(source, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getCardsInZone("deck", P1)).toHaveLength(0);
    expect(e.getCardsInZone("trash", P1).map((c) => c.instanceId)).toEqual(
      expect.arrayContaining(top),
    );
    expect(e.isGameOver()).toBe(false);
  });
  for (const slug of [
    "adam-smasher-metal-over-meat",
    "tyger-s-whisper",
    "valentino-street-racer",
    "rogue-amendiares-queen-of-the-afterlife",
  ]) {
    faq(slug, slug === "tyger-s-whisper" ? 2 : 1, () => {
      const source = card(slug),
        relic = card("the-relic-experimental-biochip"),
        legend = card("wakako-okada-peace-and-harmony");
      const e = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: corpo, spent: true, attachedGears: [relic] }, operator],
          trash: [source],
          legendArea: [{ card: legend, faceDown: true }],
        },
        {
          field: [
            { card: nomad, hasLag: false, powerModifier: 10 },
            { card: cab, hasLag: false },
          ],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
        { activePlayerId: P2 },
      );
      e.attackUnit(nomad, corpo, { as: P2 });
      e.resolveFullFight({ as: P2 });
      e.resolveEffectTarget(source, {
        as: P1,
        allowPendingChoice: slug === "tyger-s-whisper" || slug === "valentino-street-racer",
        reason: "Resolve the played Unit's PLAY effect",
      });
      if (slug === "adam-smasher-metal-over-meat") {
        e.expectNoPendingChoice();
        expect(e.getCard(source, "field", P1)).toBeDefined();
        expect(e.getCard(nomad, "trash", P2)).toBeDefined();
        expect(e.getCard(operator, "trash", P1)).toBeDefined();
      } else if (slug === "tyger-s-whisper") {
        e.resolveEffectTargetIds([e.findCardId(legend, "legendArea", P1)], {
          as: P1,
          allowPendingChoice: true,
          reason: "Choose Wakako's CALL mode",
        });
        e.resolveChooseEffect("weaken", { as: P1 });
        e.resolveEffectTarget(cab, { as: P1 });
        expect(e.getCard(legend, "legendArea", P1).meta.faceDown).toBe(false);
        expect(e.getEddies(P1)).toBe(0);
      } else if (slug === "valentino-street-racer") {
        e.resolveEffectTarget(operator, { as: P1 });
        expect(getEffectiveRules(e.getState(), e.findCardId(operator, "field", P1))).toContain(
          "adrenaline",
        );
        expect(e.expectFailure(() => e.attackRival(operator, { as: P1 })).success).toBe(false);
      } else {
        e.judgeSpendCard(operator, { as: P1 });
        e.attackUnit(cab, operator, { as: P2 });
        e.resolveAttack({ as: P2 });
        expect(e.expectFailure(() => e.activateAbility(source, 2, { as: P1 })).success).toBe(false);
        expect(e.getCard(source, "field", P1).meta.hasLag).toBe(true);
      }
    });
  }
  faq("adam-smasher-ender-of-legends", 4, () => {
    const source = card("adam-smasher-ender-of-legends"),
      program = card("nocturne-op55-n1");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: false }],
      hand: [program],
      eddies: 10,
    });
    e.playCard(program, { as: P1 });
    e.resolveChooseEffect("go-solo", { as: P1 });
    const id = e.findCardId(source, "legendArea", P1);
    expect(computeEffectiveCost(e.getState(), id, P1)).toBe(7);
    expect(e.executeMove("goSolo", { args: { cardId: id } }, P1).success).toBe(true);
    expect(e.getEvents("cardPlayed").at(-1)?.cost).toBe(7);
    expect(source.cost).toBe(9);
  });
  faq("dexter-deshawn-off-the-grid", 2, () => {
    const source = card("dexter-deshawn-off-the-grid");
    const e = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: source, faceDown: true }], eddies: 2, deck: [floor] },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2, preserveDeckOrder: true },
    );
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.callLegend(source, { as: P1 });
    e.resolveChooseEffect("draw", { as: P1 });
    expect(e.getCard(floor, "hand", P1)).toBeDefined();
    e.playCard(floor, { as: P1 });
    e.resolveEffectTarget(nomad, { as: P1 });
    expect(power(e, nomad, P2)).toBe(nomad.power! - 1);
  });
  faq("dexter-deshawn-one-last-chance", 1, () => {
    const source = card("dexter-deshawn-one-last-chance");
    const e = CyberpunkTestEngine.createWithFixture({
      hand: [source],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });
    e.playCard(source, { as: P1 });
    e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 2, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getEvents("gigValueChanged")).toHaveLength(0);
    e.judgeSetCardMeta(e.findCardId(source, "field", P1), { hasLag: false }, { as: P1 });
    e.attackRival(source, { as: P1 });
    e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 2, { as: P1 });
    e.expectNoPendingChoice();
    expect(e.getEvents("gigValueChanged")).toHaveLength(0);
  });
  faq("dum-dum-maelstrom-triggerman", 2, () => {
    const source = card("dum-dum-maelstrom-triggerman"),
      shield = card("riot-shield"),
      detonate = card("detonate"),
      gear = card("netwatch-netdriver");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: false }],
        field: [{ card: operator, hasLag: false, attachedGears: [shield] }],
        hand: [gear],
        eddies: 4,
      },
      { hand: [detonate], eddies: 2, gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    const before = power(e, operator);
    e.activateAbility(source, 2, { as: P1 });
    expect(power(e, operator)).toBe(before + 1);
    e.attackRival(operator, { as: P1 });
    e.resolveAttack({ as: P1 });
    e.playCard(detonate, { as: P2 });
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(shield, { as: P2 });
    expect(e.getCard(shield, "trash", P1)).toBeDefined();
    expect(power(e, operator)).toBe(operator.power! + 1);
    e.resolveFullSteal({ as: P1 });
    e.attachGear(gear, operator, { as: P1 });
    expect(power(e, operator)).toBe(operator.power! + 2 + 1);
  });
  faq("el-sombrero-n-la-venganza-lenta", 2, () => {
    const source = card("el-sombreron-la-venganza-lenta");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: source, hasLag: false }],
        eddies: 2,
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
      { gigArea: [{ dieType: "d6", faceValue: 1 }] },
    );
    e.attackRival(source, { as: P1 });
    acceptTrigger(e);
    const captured = power(e, source);
    expect(captured).toBe(source.power! + 4);
    e.judgeSetGigValue(e.findGigIdByType(P1, "d4"), 1, { as: P1 });
    expect(power(e, source)).toBe(captured);
  });
  faq("goro-takemura-losing-his-way", 1, () => {
    const source = card("goro-takemura-losing-his-way");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }] },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    e.attackRival(source, { as: P1 });
    for (const c of e.getCardsInZone("legendArea", P1))
      e.judgeSetCardMeta(c.instanceId, { faceDown: false }, { as: P1 });
    e.resolveFullSteal({ as: P1 });
    expect(power(e, source)).toBe(source.power);
  });
  for (const extraEven of [false, true]) {
    faq("jackie-welles-ride-or-die-choom", extraEven ? 2 : 1, () => {
      const source = card("jackie-welles-ride-or-die-choom");
      const e = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: source, hasLag: false }], gigArea: [{ dieType: "d4", faceValue: 2 }] },
        { gigArea: [{ dieType: "d6", faceValue: 2 }] },
      );
      e.attackRival(source, { as: P1 });
      const captured = power(e, source);
      expect(captured).toBe(source.power! + 2);
      if (extraEven) e.judgeMoveGigToPlayer(e.findGigIdByType(P2, "d6"), P1, { as: P1 });
      else e.judgeSetGigValue(e.findGigIdByType(P1, "d4"), 3, { as: P1 });
      expect(power(e, source)).toBe(captured);
    });
  }
  faq("johnny-silverhand-never-stop-fighting", 4, () => {
    const source = card("johnny-silverhand-never-stop-fighting");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false, powerModifier: -8 }] },
      { field: [{ card: corpo, spent: true }] },
    );
    e.attackUnit(source, corpo, { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getCard(source, "field", P1)).toBeDefined();
    expect(e.getCard(corpo, "field", P2)).toBeDefined();
    expect(e.getEvents("attackResolved").at(-1)?.result).toBe("attackerWins");
  });
  faq("judy-a-lvarez-braindance-maestro", 1, () => {
    const source = card("judy-alvarez-braindance-maestro"),
      lizzy = card("lizzy-wizzy-delicate-weapon"),
      program = card("afterparty-at-lizzie-s");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: source, faceDown: false }],
      field: [operator],
      hand: [lizzy],
      trash: [program],
      eddies: 5,
    });
    e.playCard(lizzy, { as: P1 });
    e.resolveEffectTarget(program, {
      as: P1,
      allowPendingChoice: true,
      reason: "Judy now chooses a Unit for the trash Program.",
    });
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
    e.resolveEffectTarget(operator, { as: P1 });
    expect(power(e, operator)).toBe(operator.power! + 1);
  });
  faq("la-llorona-ghost-of-the-past", 2, () => {
    const source = card("la-llorona-ghost-of-the-past");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [source, { card: corpo, attachedGears: [card("riot-shield")] }] },
      { field: [{ card: nomad, hasLag: false }] },
      { activePlayerId: P2 },
    );
    e.attackRival(nomad, { as: P2 });
    e.resolveAttack({ as: P2 });
    e.useBlocker(source, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTargetIds([], { as: P1 });
    e.useBlocker(corpo, { as: P1 });
    expect(e.getState().G.attackState?.defenderId).toBe(e.findCardId(corpo, "field", P1));
    expect(e.getCard(source, "field", P1).meta.spent).toBe(true);
  });
  faq("maxtac-squadron", 1, () => {
    const source = card("maxtac-squadron"),
      gear = card("sandevistan"),
      legend = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [{ card: source, spent: true, attachedGears: [gear] }],
      legendArea: [{ card: legend, faceDown: false, spent: true }],
    });
    e.completeTurn({ as: P1 });
    const choice = e.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger")
      throw new Error("Expected end-turn order choice");
    const ready = choice.payload.options.find(
      (o) => o.sourceCardId === e.findCardId(gear, "field", P1),
    );
    expect(ready).toBeDefined();
    e.executeMove("resolveTrigger", { args: { triggerId: ready!.triggerId } }, P1);
    e.expectNoPendingChoice();
    expect(e.getCard(source, "field", P1).meta.spent).toBe(false);
    expect(e.getEvents("actionLog")).toContainEqual(
      expect.objectContaining({
        messageKey: "effect.skipped",
        params: expect.objectContaining({
          sourceCardName: source.displayName,
          effectName: "ready",
        }),
      }),
    );
  });
  faq("nadia-fighting-through-grief", 1, () => {
    const source = card("nadia-fighting-through-grief");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 6 },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    e.playCard(source, { as: P1 });
    e.attackRival(source, { as: P1 });
    e.judgeMoveGigToPlayer(e.findGigIdByType(P2, "d6"), P1, { as: P1 });
    e.resolveFullSteal({ as: P1 });
    expect(e.getGigCount(P2)).toBe(0);
    expect(e.getGigCount(P1)).toBe(2);
  });
  faq("sasha-yakovleva-won-t-let-you-down", 1, () => {
    const source = card("sasha-yakovleva-won-t-let-you-down");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }], deck: 0 },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    e.attackRival(source, { as: P1 });
    e.resolveFullSteal({ as: P1 });
    expect(e.getGigCount(P1)).toBe(0);
    expect(e.getGigCount(P2)).toBe(1);
    expect(e.isGameOver()).toBe(false);
  });
  faq("chrome-reverie", 1, () => {
    const source = card("chrome-reverie"),
      racer = card("valentino-street-racer");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 3 },
      { field: [{ card: operator, hasLag: true }], hand: [racer], eddies: 3 },
    );
    e.playCard(source, { as: P1 });
    e.resolveEffectTarget(operator, { as: P1 });
    e.skipToNextPlayerTurn(P1);
    e.playCard(racer, { as: P2 });
    e.resolveEffectTarget(operator, { as: P2 });
    expect(e.expectFailure(() => e.attackRival(operator, { as: P2 })).errorCode).toBe(
      "CANT_ATTACK",
    );
  });
  faq("chrome-reverie", 3, () => {
    const source = card("chrome-reverie"),
      legend = card("wakako-okada-peace-and-harmony");
    const e = CyberpunkTestEngine.createWithFixture({
      hand: [source],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      legendArea: [{ card: legend, faceDown: true }],
    });
    e.playCard(source, { as: P1 });
    e.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    e.spendAllLegends(P1);
    expect(e.expectFailure(() => e.callLegend(legend, { as: P1 })).success).toBe(false);
    expect(e.getCard(legend, "legendArea", P1).meta.faceDown).toBe(true);
  });
  faq("dying-night-v-s-pistol", 1, () => {
    const gear = card("dying-night-v-s-pistol"),
      source = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: source, hasLag: false, attachedGears: [gear] }],
        spentEddies: 2,
        gigArea: [{ dieType: "d4", faceValue: 3 }],
      },
      { gigArea: [{ dieType: "d6", faceValue: 1 }] },
    );
    e.attackRival(source, { as: P1 });
    e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 3, { as: P1 });
    e.resolveFullSteal({ as: P1 });
    e.completeTurn({ as: P1 });
    expect(e.getEddies(P1)).toBe(2);
    expect(e.getGigDice(P1).find((g) => g.dieType === "d4")?.faceValue).toBe(3);
  });
  faq("jackie-welles-pour-one-out-for-me", 2, () => {
    const source = card("jackie-welles-pour-one-out-for-me"),
      legend = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: source, faceDown: false },
        { card: legend, faceDown: false },
      ],
      eddies: 5,
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });
    e.executeMove("goSolo", { args: { cardId: e.findCardId(legend, "legendArea", P1) } }, P1);
    if (e.getState().G.turnMetadata.pendingChoice?.type === "chooseTrigger") acceptTrigger(e);
    e.resolveAdjustGig(e.findGigIdByType(P1, "d4"), 1, { as: P1 });
    expect(e.getHandCount(P1)).toBe(1);
  });
  faq("johnny-silverhand-never-stop-fighting", 3, () => {
    const source = card("johnny-silverhand-never-stop-fighting");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }] },
      {
        field: [
          { card: card("meredith-stout-stone-cold-corpo"), hasLag: false },
          { card: card("meredith-stout-stone-cold-corpo"), hasLag: false },
        ],
        hand: [card("gunpoint-diplomacy")],
        eddies: 4,
      },
      { activePlayerId: P2 },
    );
    const attackers = e.getCardsInZone("field", P2).map((c) => c.instanceId);
    e.playCard(card("gunpoint-diplomacy"), { as: P2 });
    e.resolveEffectTargetIds([attackers[0]!], { as: P2 });
    e.attackUnit(attackers[0]!, source, { as: P2 });
    e.resolveFullFight({ as: P2 });
    expect(e.getCard(source, "field", P1).meta.spent).toBe(false);
    e.judgeSpendCard(source, { as: P1 });
    e.attackUnit(attackers[1]!, source, { as: P2 });
    e.resolveFullFight({ as: P2 });
    expect(e.getCard(source, "field", P1).meta.spent).toBe(true);
  });
  faq("muamar-reyes-el-capita-n", 2, () => {
    const source = card("muamar-reyes-el-capitan");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: true }],
        field: [{ card: operator, hasLag: false }],
        eddies: 1,
      },
      {
        field: [
          { card: nomad, spent: true },
          { card: nomad, spent: true },
        ],
      },
    );
    e.callLegend(source, { as: P1 });
    e.resolveChooseEffect("protect", { as: P1 });
    e.resolveEffectTarget(operator, { as: P1 });
    const ids = e.getCardsInZone("field", P2).map((c) => c.instanceId);
    for (const id of ids) {
      e.attackUnit(operator, id, { as: P1 });
      e.resolveFullFight({ as: P1 });
      expect(e.getCard(operator, "field", P1)).toBeDefined();
      if (id === ids[0]) e.judgeReadyCard(operator, { as: P1 });
    }
    expect(e.getEvents("attackResolved").filter((e) => e.result === "defenderWins")).toHaveLength(
      2,
    );
  });
  faq("muamar-reyes-el-capita-n", 3, () => {
    const source = card("muamar-reyes-el-capitan"),
      zealots = card("maelstrom-zealots");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: source, faceDown: true }],
        field: [{ card: zealots, hasLag: false }],
        eddies: 1,
      },
      { field: [{ card: nomad, spent: true }] },
    );
    e.callLegend(source, { as: P1 });
    e.resolveChooseEffect("protect", { as: P1 });
    e.resolveEffectTarget(zealots, { as: P1 });
    e.attackUnit(zealots, nomad, { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getCard(zealots, "field", P1)).toBeDefined();
    expect(e.getCard(nomad, "trash", P2)).toBeDefined();
    expect(e.getEvents("attackResolved").at(-1)?.result).toBe("defenderWins");
  });
  faq("ruthless-lowlife", 1, () => {
    const source = card("ruthless-lowlife"),
      inciters = card("mox-inciters");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: source, hasLag: false }] },
      { hand: [inciters], eddies: 3, gigArea: [{ dieType: "d4", faceValue: 1 }] },
      { activePlayerId: P2 },
    );
    e.playCard(inciters, { as: P2 });
    e.resolveEffectTarget(source, { as: P2 });
    e.skipToNextPlayerTurn(P2);
    expect(e.expectFailure(() => e.attackRival(source, { as: P1 })).errorCode).toBe(
      "CANT_ATTACK_RIVAL",
    );
    expect(e.completeTurn({ as: P1 }).success).toBe(true);
  });
  for (const slug of ["chrome-fang", "westbrook-netrunner"]) {
    faq(slug, 1, () => {
      const source = card(slug),
        legend = card("v-corporate-exile");
      const e = CyberpunkTestEngine.createWithFixture(
        {
          hand: [source],
          eddies: 5,
          gigArea: [{ dieType: "d12", faceValue: slug === "chrome-fang" ? 12 : 1 }],
        },
        { hand: [operator], eddies: 6, legendArea: [{ card: legend, faceDown: false }] },
      );
      e.playCard(source, { as: P1 });
      e.skipToNextPlayerTurn(P1);
      if (slug === "chrome-fang") {
        e.playCard(operator, { as: P2 });
        e.judgeSetCardMeta(operator, { hasLag: false }, { as: P2 });
        e.attackRival(operator, { as: P2 });
      } else {
        e.executeMove("goSolo", { args: { cardId: e.findCardId(legend, "legendArea", P2) } }, P2);
        e.attackRival(legend, { as: P2 });
      }
      e.resolveFullSteal({ as: P2 });
      expect(e.getGigCount(P1)).toBe(1);
    });
  }
  faq("westbrook-netrunner", 2, () => {
    const source = card("westbrook-netrunner"),
      legend = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 4, gigArea: [{ dieType: "d4", faceValue: 1 }] },
      {
        hand: [card("live-with-the-aftermath")],
        eddies: 8,
        legendArea: [{ card: legend, faceDown: false }],
        field: [corpo],
      },
    );
    e.playCard(source, { as: P1 });
    e.skipToNextPlayerTurn(P1);
    e.playCard(card("live-with-the-aftermath"), { as: P2 });
    e.resolveEffectTarget(corpo, {
      as: P2,
      allowPendingChoice: true,
      reason: "The rival chooses a Unit to defeat.",
    });
    e.resolveEffectTarget(source, { as: P1 });
    e.executeMove("goSolo", { args: { cardId: e.findCardId(legend, "legendArea", P2) } }, P2);
    e.attackRival(legend, { as: P2 });
    e.resolveFullSteal({ as: P2 });
    expect(e.getGigCount(P1)).toBe(1);
  });
  faq("arasaka-emergency-radioport", 1, () => {
    const gear = card("arasaka-emergency-radioport"),
      source = card("swordwise-huscle"),
      legend = card("goro-takemura-hands-unclean");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: source, hasLag: false, attachedGears: [gear] }],
        legendArea: [{ card: legend, faceDown: true }],
        deck: [floor],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    e.attackRival(source, { as: P1 });
    const choice = e.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") throw new Error("Expected spend/ATTACK choice");
    const radioport = choice.payload.options.find(
      (o) => o.sourceCardId === e.findCardId(gear, "field", P1),
    );
    expect(radioport).toBeDefined();
    e.executeMove("resolveTrigger", { args: { triggerId: radioport!.triggerId } }, P1);
    e.resolveEffectTarget(legend, {
      as: P1,
      allowPendingChoice: true,
      reason: "The independent Call decision follows the look decision.",
    });
    expect(e.getHandCount(P1)).toBe(0);
    e.resolveEffectTarget(legend, { as: P1 });
    expect(e.getCard(legend, "legendArea", P1).meta.faceDown).toBe(false);
    expect(e.getHandCount(P1)).toBe(1);
    const events = e.getEvents();
    expect(events.findIndex((e) => e.type === "legendCalled")).toBeLessThan(
      events.findIndex((e) => e.type === "cardsDrawn"),
    );
  });
  faq("appetite-for-destruction", 2, () => {
    const source = card("appetite-for-destruction"),
      gear = card("gorilla-arms");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        hand: [source],
        eddies: 3,
        field: [{ card: operator, hasLag: false, attachedGears: [gear] }],
      },
      {
        field: [{ card: corpo, spent: true }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    e.playCard(source, { as: P1 });
    e.attackUnit(operator, corpo, { as: P1 });
    e.resolveFullFight({ as: P1 });
    e.resolveEffectTargetIds([e.findGigIdByType(P2, "d4")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Gorilla Arms observes this Unit's effect-driven steal.",
    });
    e.resolveEffectTargetIds([e.findGigIdByType(P2, "d6")], { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getGigCount(P1)).toBe(2);
    expect(e.getEvents("gigStolen").map((e) => e.sourceCardId)).toEqual([
      e.findCardId(operator, "field", P1),
      e.findCardId(operator, "field", P1),
    ]);
  });
  faq("appetite-for-destruction", 3, () => {
    const source = card("appetite-for-destruction"),
      muamar = card("muamar-reyes-el-capitan");
    const e = CyberpunkTestEngine.createWithFixture(
      { hand: [source], eddies: 3, field: [{ card: nomad, hasLag: false, powerModifier: 4 }] },
      {
        field: [{ card: operator, spent: true }],
        legendArea: [{ card: muamar, faceDown: true }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 1,
      },
      { activePlayerId: P2 },
    );
    e.callLegend(muamar, { as: P2 });
    e.resolveChooseEffect("protect", { as: P2 });
    e.resolveEffectTarget(operator, { as: P2 });
    // Keep the protection in this turn and grant the Program its real QUICK
    // route through Lizzy/The Relic is unnecessary for the win/protection boundary.
    e.judgeSetTurnMetadata({ activePlayerId: P1 }, { as: P1 });
    e.playCard(source, { as: P1 });
    e.attackUnit(nomad, operator, { as: P1 });
    e.resolveFullFight({ as: P1 });
    e.resolveEffectTargetIds([e.findGigIdByType(P2, "d4")], { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getCard(operator, "field", P2)).toBeDefined();
    expect(e.getGigCount(P1)).toBe(1);
  });
  faq("cyberpsychosis", 3, () => {
    const source = card("cyberpsychosis"),
      relic = card("the-relic-experimental-biochip"),
      aftermath = card("live-with-the-aftermath");
    const e = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: operator, hasLag: false, attachedGears: [relic] }],
        hand: [source],
        eddies: 3,
      },
      {
        field: [{ card: corpo, spent: true }],
        hand: [aftermath],
        trash: [card("lizzy-wizzy-delicate-weapon")],
        eddies: 3,
      },
    );
    e.playCard(source, { as: P1 });
    if (e.getState().G.turnMetadata.pendingChoice) e.resolveEffectTarget(operator, { as: P1 });
    e.attackUnit(operator, corpo, { as: P1 });
    e.resolveAttack({ as: P1 });
    // Remove the defender during React. The attack ends before a fight occurs.
    e.judgeMoveCardToZone(e.findCardId(corpo, "field", P2), "trash", { as: P2 });
    e.resolveFullFight({ as: P1 });
    e.completeTurn({ as: P1 });
    expect(e.getCard(operator, "field", P1)).toBeDefined();
    expect(e.getEvents("attackResolved").filter((e) => e.attackKind === "fight")).toHaveLength(0);
  });
  faq("gunpoint-diplomacy", 1, () => {
    const source = card("gunpoint-diplomacy");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [operator],
      hand: [source],
      eddies: 4,
    });
    e.playCard(source, { as: P1 });
    e.resolveEffectTarget(operator, { as: P1 });
    e.expectNoPendingChoice();
    expect(
      e
        .getState()
        .G.activeEffects.filter(
          (effect) => effect.sourceCardId === e.findCardId(source, "trash", P1),
        )
        .map((effect) => effect.kind),
    ).toEqual(["grantRule", "powerModifier"]);
    expect(power(e, operator)).toBe(operator.power! + 3);
    expect(getEffectiveRules(e.getState(), e.findCardId(operator, "field", P1))).toContain(
      "canAttackReadyUnits",
    );
  });
  faq("meredith-stout-stone-cold-corpo", 1, () => {
    const source = card("meredith-stout-stone-cold-corpo");
    const e = CyberpunkTestEngine.createWithFixture({
      field: [source],
      trash: [floor, cab],
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
    });
    // The FAQ assumes a simultaneous multi-Gig change. Test its public event
    // directly; no current retail card swaps two rival-owned Gigs together.
    create(e.getState(), (state) => {
      const events: GameEvent[] = [],
        logs: MoveLog[] = [];
      const ops = createOperations(state.G, events, logs);
      const dice = state.G.players[P1].gigArea;
      enqueueEventTriggers(
        {
          type: "gigsSwapped",
          dieIds: [dice[0]!, dice[1]!],
          dieValues: [2, 3],
          dieTypes: ["d4", "d6"],
          playerId: P2,
          fromPlayerIds: [P1, P1],
        },
        state,
        ops,
      );
      expect(state.G.turnMetadata.triggerQueue).toHaveLength(1);
      continueTriggerResolution(state, ops);
      expect(state.G.turnMetadata.currentTrigger?.sourceCardId).toBe(
        e.findCardId(source, "field", P1),
      );
      expect(state.G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
      expect(state.G.turnMetadata.triggerQueue).toHaveLength(0);
    });
  });
  it("Dying Night current end-turn text needs its host in play (source conflict)", () => {
    const source = card("dying-night-v-s-pistol"),
      host = card("v-corporate-exile");
    const e = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: host, hasLag: false, attachedGears: [source] }], spentEddies: 2 },
      {
        field: [{ card: corpo, spent: true, powerModifier: 20 }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
    );
    e.attackUnit(host, corpo, { as: P1 });
    e.resolveAdjustGig(e.findGigIdByType(P2, "d4"), 2, { as: P1 });
    e.resolveFullFight({ as: P1 });
    expect(e.getCard(source, "trash", P1)).toBeDefined();
    e.completeTurn({ as: P1 });
    expect(e.getEddies(P1)).toBe(0);
  });
});
