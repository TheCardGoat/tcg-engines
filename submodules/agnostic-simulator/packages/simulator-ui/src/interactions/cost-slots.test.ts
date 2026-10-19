import { expect, test } from "vite-plus/test";
import type { OptionSelectionInput } from "@tcg/protocol";
import {
  assignedCostEntities,
  autoAssignCostSlots,
  bestOptionForEntity,
  normalizeCostSlotValue,
} from "./cost-slots";

function input(
  resources: Array<[entity: string, colors: string[]]>,
  slots: Array<{ color?: string }>,
): OptionSelectionInput {
  const options = resources.flatMap(([entity, colors]) =>
    colors.map((color) => ({
      id: JSON.stringify([entity, color]),
      entity: { kind: "card" as const, instanceId: entity },
      text: { key: `${entity} · ${color}` },
      enabled: true,
    })),
  );
  return {
    kind: "option-selection",
    id: "resourcePayment",
    text: { key: "Assign resources to the cost" },
    required: true,
    min: slots.length,
    max: slots.length,
    options,
    presentation: {
      kind: "cost-slots",
      slots: slots.map((slot) => ({
        text: { key: slot.color ? `${slot.color} resource` : "Any resource" },
        color: slot.color,
        optionIds: options
          .filter((option) => !slot.color || JSON.parse(option.id)[1] === slot.color)
          .map((option) => option.id),
      })),
    },
  };
}

test("normalizeCostSlotValue pads a positional draft to the slot count", () => {
  const cost = input(
    [
      ["a", ["blue"]],
      ["b", ["green"]],
    ],
    [{ color: "blue" }, { color: "green" }],
  );
  expect(normalizeCostSlotValue(cost, ["x", "y"])).toEqual(["x", "y"]);
  expect(normalizeCostSlotValue(cost, ["x"])).toEqual(["x", ""]);
  expect(normalizeCostSlotValue(cost, undefined)).toEqual(["", ""]);
});

test("auto-assign keeps player picks and spends monicolor sources first", () => {
  const cost = input(
    [
      ["apex1", ["blue", "green"]],
      ["magnate", ["green"]],
      ["apex3", ["blue", "green"]],
    ],
    [{ color: "blue" }, { color: "green" }],
  );
  expect(autoAssignCostSlots(cost, undefined)).toEqual([
    JSON.stringify(["apex1", "blue"]),
    JSON.stringify(["magnate", "green"]),
  ]);
  expect(autoAssignCostSlots(cost, [JSON.stringify(["apex3", "blue"]), ""])).toEqual([
    JSON.stringify(["apex3", "blue"]),
    JSON.stringify(["magnate", "green"]),
  ]);
});

test("board taps prefer the colored pip and never double-engage", () => {
  const cost = input(
    [
      ["apex", ["blue", "green"]],
      ["magnate", ["green"]],
    ],
    [{ color: "blue" }, { color: "green" }],
  );
  expect(bestOptionForEntity(cost, "apex", undefined)).toEqual({
    slotIndex: 0,
    optionId: JSON.stringify(["apex", "blue"]),
  });
  // A monicolor green source skips the blue slot and lands on green.
  expect(bestOptionForEntity(cost, "magnate", undefined)).toEqual({
    slotIndex: 1,
    optionId: JSON.stringify(["magnate", "green"]),
  });
  const draft = [JSON.stringify(["apex", "blue"]), ""];
  expect(bestOptionForEntity(cost, "apex", draft)).toBeUndefined();
  expect(assignedCostEntities(cost, draft)).toEqual(new Set(["apex"]));
});

test("auto-assign completes a three-slot cost and refuses the impossible", () => {
  const cost = input(
    [
      ["apex1", ["blue", "green"]],
      ["magnate", ["green"]],
      ["apex3", ["blue", "green"]],
    ],
    [{ color: "green" }, {}, {}],
  );
  const done = autoAssignCostSlots(cost, undefined);
  expect(done).toHaveLength(3);
  expect(assignedCostEntities(cost, done).size).toBe(3);
  const impossible = input([["apex", ["blue"]]], [{ color: "white" }]);
  expect(autoAssignCostSlots(impossible, undefined)).toBeUndefined();
});
