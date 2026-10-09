import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

const shanks =
  "If your opponent has a Character with 8000 base power or more, give this card in your hand −3 cost. [On Play] If your Leader has the {Red-Haired Pirates} type or is [Uta], your Leader gains +2000 power until the end of your opponent's next End Phase.";
const law =
  "[On Play] Rest up to 1 of your opponent's Characters and that Character will not become active in your opponent's next Refresh Phase. Then, if your opponent has 2 or more rested Characters, your Leader gains +2000 power until the end of your opponent's next End Phase.";

test("Shanks preserves base power hand discount and either Leader requirement", () => {
  const result = buildCardEffects(shanks);
  expect(result?.permanentEffects).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        conditions: expect.arrayContaining([
          expect.objectContaining({
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [{ filter: "basePower", comparison: "gte", value: 8000 }],
          }),
        ]),
        actions: expect.arrayContaining([
          expect.objectContaining({
            action: "modifyCost",
            value: -3,
            target: expect.objectContaining({ self: true, zones: ["hand"] }),
          }),
        ]),
      }),
    ]),
  );
  expect(result?.effects).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        conditions: expect.arrayContaining([
          expect.objectContaining({
            condition: "compound",
            operator: "or",
            conditions: [
              { condition: "leaderTrait", trait: "Red-Haired Pirates", match: "exact" },
              { condition: "leaderName", name: "Uta" },
            ],
          }),
        ]),
        actions: expect.arrayContaining([
          expect.objectContaining({
            action: "modifyPower",
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          }),
        ]),
      }),
    ]),
  );
});

test("Law & Bepo rests then freezes the same physical target before checking rested count", () => {
  const actions = buildCardEffects(law)?.effects?.[0]?.actions;
  expect(actions?.map((a) => a.action)).toEqual(["rest", "freeze", "modifyPower"]);
  expect(actions?.[0]).toMatchObject({
    target: { player: "opponent", zones: ["character"], count: { amount: 1, upTo: true } },
  });
  expect(actions?.[1]).toMatchObject({ action: "freeze", previousActionTargets: true });
  expect(actions?.[2]).toMatchObject({
    action: "modifyPower",
    value: 2000,
    condition: {
      condition: "zoneCount",
      player: "opponent",
      zone: "character",
      comparison: "gte",
      value: 2,
      filters: [{ filter: "state", value: "rested" }],
    },
  });
});
