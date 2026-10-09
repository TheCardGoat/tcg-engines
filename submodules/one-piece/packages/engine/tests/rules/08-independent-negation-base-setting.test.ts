import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic control: a legacy setter can feed a numeric negation condition.
test("legacy base-power eligibility retains numeric-dependent negation review", () => {
  const brook = getCard("ST01-011");
  const original = brook.effects;
  try {
    brook.effects = {
      permanentEffects: [
        {
          actions: [
            {
              action: "setBasePower",
              target: {
                player: "self",
                zones: ["character"],
                self: true,
                count: { amount: 1 },
                filters: [{ filter: "basePower", comparison: "eq", value: 3000 }],
              },
              value: 8000,
            },
          ],
        },
        {
          actions: [
            {
              action: "modifyCost",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
              value: 12,
            },
          ],
        },
        {
          conditions: [
            {
              condition: "cardState",
              target: "this",
              property: "power",
              comparison: "gte",
              value: 8000,
            },
          ],
          actions: [
            {
              action: "negateEffects",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
              duration: "permanent",
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        hand: [brook],
        activeDon: 2,
        deck: ["ST01-003", "ST01-003", "ST01-003"],
        life: ["ST01-003", "ST01-003", "ST01-003", "ST01-003"],
      },
      {
        leaderCardId: "ST01-001",
        hand: [],
        deck: ["ST01-003", "ST01-003", "ST01-003"],
        life: ["ST01-003", "ST01-003", "ST01-003", "ST01-003"],
      },
    );
    e.asSouth().play(brook);
    expect(e.getView("judge").prompts.some((prompt) => prompt.seat === "judge")).toBe(true);
  } finally {
    brook.effects = original;
  }
});

// CR 8-1-3-3 and 8-2-1: Teach and Roger negate only their controller's effects.
// Neither restriction can invalidate the opponent's permanent effects.
test.each(
  (["south", "north"] as const).flatMap((seat) =>
    ["Teach", "Roger"].map((opponent) => ({ seat, opponent })),
  ),
)(
  "opposing $opponent does not block $seat Linlin when Saul changes his own cost",
  ({ seat, opponent }) => {
    const linlinPlayer = {
      leaderCardId: "OP03-077",
      character: ["OP17-112", "OP17-107"],
      hand: ["OP17-089"],
      activeDon: 4,
      deck: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
      life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
    };
    const opposingPlayer =
      opponent === "Teach"
        ? {
            leaderCardId: "OP09-081",
            hand: [],
            deck: ["ST06-003", "ST06-003", "ST06-003"],
            life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
          }
        : {
            leaderCardId: "ST04-001",
            character: ["OP13-064"],
            hand: [],
            deck: ["ST04-009", "ST04-009", "ST04-009"],
            life: ["ST04-009", "ST04-009", "ST04-009", "ST04-009"],
          };
    const e = OnePieceTestEngine.create(
      seat === "south" ? linlinPlayer : opposingPlayer,
      seat === "south" ? opposingPlayer : linlinPlayer,
      { activeSeat: seat },
    );
    e.playCard("OP17-089", seat);
    expect(e.getView("judge").prompts.filter((prompt) => prompt.seat === "judge")).toHaveLength(0);
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, seat);
    const view = e.getView(seat);
    expect(view.players[seat].characters.find((card) => card?.cardId === "OP17-089")?.cost).toBe(
      16,
    );
    expect(view.players[seat].characters.find((card) => card?.cardId === "OP17-107")?.power).toBe(
      8000,
    );
    expect(view.players[seat].trash.map((card) => card.cardId)).toEqual([
      "ST06-003",
      "ST06-003",
      "ST06-003",
    ]);
    expect(view.players[seat].deckCount).toBe(1);
    expect(e.getView("judge").prompts).toHaveLength(0);
  },
);

// Roger's unconditional negation removes Linlin's aura without numeric feedback.
test.each(["south", "north"] as const)(
  "%s Roger removes his own Linlin aura while opposing Saul keeps his cost",
  (seat) => {
    const opponent = seat === "south" ? "north" : "south";
    const rogerPlayer = {
      leaderCardId: "OP08-058",
      character: ["OP17-112", "OP17-107"],
      hand: ["OP13-064"],
      activeDon: 10,
      deck: ["ST04-009", "ST04-009", "ST04-009"],
      life: ["ST04-009", "ST04-009", "ST04-009", "ST04-009"],
    };
    const saulPlayer = {
      leaderCardId: "ST06-001",
      character: ["OP17-089"],
      hand: [],
      deck: ["ST06-003", "ST06-003", "ST06-003"],
      life: ["ST06-003", "ST06-003", "ST06-003", "ST06-003"],
    };
    const e = OnePieceTestEngine.create(
      seat === "south" ? rogerPlayer : saulPlayer,
      seat === "south" ? saulPlayer : rogerPlayer,
      { activeSeat: seat },
    );
    expect(
      e.getView(seat).players[seat].characters.find((card) => card?.cardId === "OP17-107")?.power,
    ).toBe(8000);
    e.playCard("OP13-064", seat);
    expect(e.getView("judge").prompts.filter((prompt) => prompt.seat === "judge")).toHaveLength(0);
    e.resolveDecision("effectOptional", { optionId: "no" }, seat);
    const view = e.getView(seat);
    expect(view.players[seat].characters.find((card) => card?.cardId === "OP17-107")?.power).toBe(
      4000,
    );
    expect(
      view.players[opponent].characters.find((card) => card?.cardId === "OP17-089")?.cost,
    ).toBe(16);
    expect(e.getView("judge").prompts).toHaveLength(0);
  },
);

// Synthetic native effects isolate the dependency graph; these are not Brook's printed effects.
test.each(
  (["negateEffects", "negatePlayerEffects"] as const).flatMap((actionKind) =>
    [false, true].map((unrestricted) => ({ actionKind, unrestricted })),
  ),
)(
  "$actionKind respects timing scope, unrestricted=$unrestricted",
  ({ actionKind, unrestricted }) => {
    const brook = getCard("ST01-011");
    const original = brook.effects;
    try {
      brook.effects = {
        permanentEffects: [
          {
            actions: [
              {
                action: "setBasePower",
                target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
                value: 2000,
              },
            ],
          },
          {
            conditions: [
              {
                condition: "cardState",
                target: "this",
                property: "power",
                comparison: "gte",
                value: 1000,
              },
            ],
            actions: [
              {
                ...(actionKind === "negateEffects"
                  ? {
                      action: "negateEffects" as const,
                      target: {
                        player: "self" as const,
                        zones: ["character" as const],
                        self: true,
                        count: { amount: 1 },
                      },
                    }
                  : { action: "negatePlayerEffects" as const, player: "self" as const }),
                duration: "permanent",
                ...(unrestricted ? {} : { effectTypes: ["onPlay" as const] }),
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST01-001",
          hand: [brook],
          activeDon: 2,
          deck: ["ST01-003", "ST01-003", "ST01-003"],
          life: ["ST01-003", "ST01-003", "ST01-003", "ST01-003"],
        },
        {
          leaderCardId: "ST01-001",
          hand: [],
          deck: ["ST01-003", "ST01-003", "ST01-003"],
          life: ["ST01-003", "ST01-003", "ST01-003", "ST01-003"],
        },
      );
      e.asSouth().play(brook);
      expect(e.getView("judge").prompts.some((prompt) => prompt.seat === "judge")).toBe(
        unrestricted,
      );
      if (!unrestricted) expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
    } finally {
      brook.effects = original;
    }
  },
);
