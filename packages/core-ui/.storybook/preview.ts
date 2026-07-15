import type { Preview } from "@storybook/sveltekit";

import "../src/app.css";

if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", "dark");
  document.body.classList.add("bg-base-300", "text-base-content");
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
