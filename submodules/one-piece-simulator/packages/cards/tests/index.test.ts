import { describe, expect, test } from "vite-plus/test";
import { allCards, cardCatalog, getAllCards, getCard, hasCard } from "../src/index.ts";

describe("@tcg/op-cards", () => {
  test("exports a populated catalog", () => {
    expect(allCards.length).toBeGreaterThan(1900);
    expect(getAllCards()).toHaveLength(allCards.length);
  });

  test("supports card lookup helpers", () => {
    const luffy = getCard("OP13-001");

    expect(luffy.id).toBe("OP13-001");
    expect(luffy.i18n.en.name).toBe("Monkey.D.Luffy");
    expect(hasCard("OP13-001")).toBe(true);
    expect(hasCard("NOPE-999")).toBe(false);
    expect(cardCatalog.get("OP13-001")?.id).toBe("OP13-001");
  });

  test("catalog ids are unique and sorted", () => {
    const ids = allCards.map((card) => card.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
    expect(ids[0]).toBe([...ids].sort((left, right) => left.localeCompare(right))[0]);
  });
});
