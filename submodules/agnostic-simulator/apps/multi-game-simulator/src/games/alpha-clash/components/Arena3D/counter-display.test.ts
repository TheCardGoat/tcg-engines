import { expect, test } from "vite-plus/test";
import {
  counterAppearance,
  counterCountsDuringTransfers,
  visibleCounters,
} from "./counter-display";

test("named markers retain count and have a readable fallback", () => {
  expect(visibleCounters({ streak: 3, toxic: 1, bounty: 0 })).toEqual([
    ["streak", 3],
    ["toxic", 1],
  ]);
  expect(counterAppearance("temper").label).toBe("TEMP");
  expect(counterAppearance("custom").label).toBe("CUST");
});

test("queued transfers reveal each destination count only after its landing", () => {
  const cards = [
    { instanceId: "a", counters: { streak: 1 } },
    { instanceId: "b", counters: { streak: 0 } },
    { instanceId: "c", counters: { streak: 1 } },
  ];
  const moves = [
    { sequence: 1, kind: "streak", amount: 1, fromId: "a", toId: "b" },
    { sequence: 2, kind: "streak", amount: 1, fromId: "b", toId: "c" },
  ];
  const first = counterCountsDuringTransfers(cards, moves);
  expect(first.get("a")?.streak).toBe(1);
  expect(first.get("b")?.streak).toBe(1);
  expect(first.get("c")?.streak).toBe(0);
  const second = counterCountsDuringTransfers(cards, moves.slice(1));
  expect(second.get("a")?.streak).toBe(1);
  expect(second.get("b")?.streak).toBe(0);
  expect(second.get("c")?.streak).toBe(0);
  expect(counterCountsDuringTransfers(cards, []).get("c")?.streak).toBe(1);
});
