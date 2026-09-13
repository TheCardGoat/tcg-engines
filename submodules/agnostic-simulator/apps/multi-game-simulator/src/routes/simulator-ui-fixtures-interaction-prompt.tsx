import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import InteractionPromptFixturesPage from "../components/InteractionPromptFixturesPage";

export default function SimulatorUiFixturesInteractionPromptRoute() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <InteractionPromptFixturesPage />
    </MantineProvider>
  );
}
