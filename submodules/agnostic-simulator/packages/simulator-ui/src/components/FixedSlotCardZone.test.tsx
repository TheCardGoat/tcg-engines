import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { FixedSlotCardZone } from "./FixedSlotCardZone";

describe("FixedSlotCardZone", () => {
  test("preserves a fixed capacity while rendering only occupied cards", () => {
    const markup = renderToStaticMarkup(
      <FixedSlotCardZone
        capacity={6}
        items={["unit-a", "unit-b"]}
        ariaLabel="Battle area"
        renderItem={(item) => <span>{item}</span>}
        renderEmptySlot={(index) => <span>empty-{index + 1}</span>}
      />,
    );

    expect(markup).toContain('data-slot-capacity="6"');
    expect(markup).toContain('data-slot-count="2"');
    expect(markup.match(/data-fixed-slot-index=/g)).toHaveLength(6);
    expect(markup.match(/data-fixed-slot-state="occupied"/g)).toHaveLength(2);
    expect(markup.match(/data-fixed-slot-state="empty"/g)).toHaveLength(4);
    expect(markup).toContain(">unit-a</span>");
    expect(markup).toContain(">empty-6</span>");
  });

  test("can preserve slot order in a horizontal row", () => {
    const markup = renderToStaticMarkup(
      <FixedSlotCardZone
        capacity={2}
        items={["one"]}
        ariaLabel="Character area"
        layout="row"
        renderItem={(item) => <span>{item}</span>}
      />,
    );

    expect(markup).toContain("flex");
    expect(markup).not.toContain("grid-template-columns");
  });

  test("can keep capacity semantic while hiding vacant slots from the visual lane", () => {
    const markup = renderToStaticMarkup(
      <FixedSlotCardZone
        capacity={6}
        items={["unit-a", "unit-b"]}
        ariaLabel="Battle area"
        showEmptySlots={false}
        renderItem={(item) => <span>{item}</span>}
      />,
    );

    expect(markup).toContain('data-slot-capacity="6"');
    expect(markup.match(/data-fixed-slot-index=/g)).toHaveLength(2);
    expect(markup).not.toContain('data-fixed-slot-state="empty"');
    expect(markup).toContain("repeat(2, minmax(0, 1fr))");
  });

  test("keeps overflow entities operable while retaining the semantic capacity", () => {
    const markup = renderToStaticMarkup(
      <FixedSlotCardZone
        capacity={2}
        items={["unit-a", "unit-b", "unit-c"]}
        ariaLabel="Battle area"
        showEmptySlots={false}
        renderItem={(item) => <span>{item}</span>}
      />,
    );

    expect(markup).toContain('data-slot-capacity="2"');
    expect(markup).toContain('data-slot-count="3"');
    expect(markup.match(/data-fixed-slot-state="occupied"/g)).toHaveLength(3);
    expect(markup).toContain(">unit-c</span>");
  });
});
