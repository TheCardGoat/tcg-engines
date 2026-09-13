import type { Preview } from "@storybook/react-vite";

import { createSimulatorAnimationScope, DefaultSimulatorEntityVisual } from "../src/animation";
import { entities, zones } from "../src/storybook/fixtures";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Vite resolves stylesheet side-effect imports for Storybook.
import "../src/storybook/preview.css";

const StorybookAnimation = createSimulatorAnimationScope<{
  entities: typeof entities;
  zones: typeof zones;
}>();

const preview: Preview = {
  decorators: [
    (Story) => (
      <StorybookAnimation.Root
        sessionKey="simulator-ui-storybook"
        initialState={{ entities, zones }}
        initialVersion={1}
        projection={{
          getEntity: (state, entityId) =>
            state.entities.find((entity) => entity.id === entityId) ?? null,
          getZone: (state, ref) => state.zones.find((zone) => zone.id === ref.id) ?? null,
        }}
        entityRenderer={DefaultSimulatorEntityVisual}
        viewerSeatId={null}
        animationSpeed="off"
      >
        <Story />
      </StorybookAnimation.Root>
    ),
  ],
  parameters: {
    controls: { expanded: true },
    layout: "fullscreen",
  },
};

export default preview;
