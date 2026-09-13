// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { CardTagStrip } from "./CardTagStrip.tsx";
import { keywordTag } from "./card-tags.ts";

afterEach(cleanup);

describe("CardTagStrip", () => {
  it("keeps pointer focus from pinning a tooltip while preserving keyboard focus help", async () => {
    render(<CardTagStrip tags={[keywordTag({ keyword: "Repair", value: 2 })]} compact />);

    const tagButton = screen.getByRole("button", { name: "REPAIR 2" });
    fireEvent.pointerEnter(tagButton);
    expect(await screen.findByRole("tooltip")).not.toBeNull();

    fireEvent.pointerDown(tagButton);
    fireEvent.focus(tagButton);
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());

    fireEvent.blur(tagButton);
    fireEvent.focus(tagButton);
    expect(await screen.findByRole("tooltip")).not.toBeNull();
  });
});
