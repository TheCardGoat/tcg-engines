/**
 * Tests for constant effect parsing: standalone keyword effects (<Blocker>),
 * While conditions, and During your [opponent's] turn clauses.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

describe("standalone keyword effects", () => {
  // Printed card keywords like <Repair 1>, <Blocker>, etc. belong in
  // `card.keywordEffects` (populated by the normalizer), NOT in the `effects`
  // array. `parseEffect` must drop these segments so they do not produce a
  // spurious `grantKeyword` CardEffect. `grantKeyword` is reserved for
  // effects that bestow a keyword on a target (e.g. "it gets <Repair 1>").

  test("<Blocker> alone produces no CardEffect", () => {
    expect(parseEffect("<Blocker>")).toEqual([]);
  });

  test("<Breach 3> alone produces no CardEffect", () => {
    expect(parseEffect("<Breach 3>")).toEqual([]);
  });

  test("<Repair> alone produces no CardEffect", () => {
    expect(parseEffect("<Repair>")).toEqual([]);
  });

  test("<Repair 1> alone produces no CardEffect", () => {
    expect(parseEffect("<Repair 1>")).toEqual([]);
  });

  test("<Support> alone produces no CardEffect", () => {
    expect(parseEffect("<Support>")).toEqual([]);
  });

  test("<First Strike> alone produces no CardEffect", () => {
    expect(parseEffect("<First Strike>")).toEqual([]);
  });

  test("<High-Maneuver> alone produces no CardEffect", () => {
    expect(parseEffect("<High-Maneuver>")).toEqual([]);
  });

  test("<Suppression> alone produces no CardEffect", () => {
    expect(parseEffect("<Suppression>")).toEqual([]);
  });

  test("<Repair 1> followed by a 【When Paired】 block keeps only the When Paired effect", () => {
    const effects = parseEffect(
      "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.",
    );
    expect(effects).toHaveLength(1);
    expect(effects[0].activation.timing).toEqual(["whenPaired"]);
  });

  test("'While ..., this Unit gets <Blocker>' is NOT treated as a printed keyword", () => {
    // The `While` segment should parse as a constant effect with a
    // precondition, not be dropped as if it were a printed keyword. The
    // segment parser's printed-keyword detection only triggers on standalone
    // segments, so this must flow through to the While-handling branch.
    const effects = parseEffect(
      "While you have another (Gjallarhorn) Unit in play, this Unit gets <Blocker>.",
    );
    expect(effects).toHaveLength(1);
    expect(effects[0].type).toBe("constant");
    expect(effects[0].activation.conditions).toBeDefined();
  });
});

describe("While conditions", () => {
  test("While this Unit is damaged, draw 1", () => {
    const [effect] = parseEffect("While this Unit is damaged, draw 1.");
    expect(effect.activation.conditions).toMatchObject([{ type: "selfIsDamaged" }]);
  });

  test("While this Unit is (Zeon), it gets AP+2 this turn", () => {
    const [effect] = parseEffect("While this Unit is (Zeon), it gets AP+2 this turn.");
    // trait value is lowercased by the parser
    expect(effect.activation.conditions).toMatchObject([{ type: "selfHasTrait", trait: "zeon" }]);
    expect(effect.directives[0]).toMatchObject({ action: { stat: "ap", amount: 2 } });
  });

  test("While this Unit is blue, draw 1", () => {
    const [effect] = parseEffect("While this Unit is blue, draw 1.");
    expect(effect.activation.conditions).toMatchObject([{ type: "selfIsColor", color: "blue" }]);
  });

  test("While this Unit has <Breach>, it gets AP+1 this turn", () => {
    const [effect] = parseEffect("While this Unit has <Breach>, it gets AP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([
      { type: "selfHasKeyword", keyword: "Breach" },
    ]);
  });

  test("While this Unit has 5 or more AP, it gets HP+1 this turn", () => {
    const [effect] = parseEffect("While this Unit has 5 or more AP, it gets HP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([
      { type: "selfStat", stat: "ap", comparison: "gte", value: 5 },
    ]);
  });

  test("While you have 2 or more Units in play, draw 1", () => {
    const [effect] = parseEffect("While you have 2 or more Units in play, draw 1.");
    expect(effect.activation.conditions).toMatchObject([
      { type: "unitCount", owner: "friendly", comparison: "gte", count: 2 },
    ]);
  });
});

describe("During your turn / opponent's turn", () => {
  test("During your turn produces Constant with friendly isTurn precondition", () => {
    const [effect] = parseEffect("During your turn, this Unit gets AP+1 this turn.");
    expect(effect.type).toBe("constant");
    expect(effect.activation.conditions).toMatchObject([{ type: "isTurn", whose: "friendly" }]);
  });

  test("During your opponent's turn produces Constant with opponent isTurn precondition", () => {
    const [effect] = parseEffect("During your opponent's turn, this Unit can't attack.");
    expect(effect.type).toBe("constant");
    expect(effect.activation.conditions).toMatchObject([{ type: "isTurn", whose: "opponent" }]);
  });
});
