import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import InteractionCatalogPage from "../components/InteractionCatalogPage";

export default function InteractionTestRoute() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <InteractionCatalogPage />
    </MantineProvider>
  );
}
