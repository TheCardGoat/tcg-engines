import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { ChoiceModal } from "./ChoiceModal";

const options = [
  { id: "keep", label: "Keep hand" },
  { id: "redraw", label: "Redraw hand" },
];

describe("ChoiceModal placement", () => {
  test("centers in the viewport by default", () => {
    const markup = renderToStaticMarkup(<ChoiceModal open title="Choose" options={options} />);

    expect(markup).toContain("choice-modal-backdrop fixed");
  });

  test("can center within a positioned board container", () => {
    const markup = renderToStaticMarkup(
      <ChoiceModal open title="Choose" options={options} placement="container" />,
    );

    expect(markup).toContain("choice-modal-backdrop absolute");
    expect(markup).not.toContain("choice-modal-backdrop fixed");
  });
});
