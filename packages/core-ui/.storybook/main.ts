import type { StorybookConfig } from "@storybook/sveltekit";
import tailwindcss from "@tailwindcss/vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { PluginOption } from "vite";

function isNamedPlugin(value: unknown): value is { name: string } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("name" in value)) {
    return false;
  }

  return typeof (value as { name?: unknown }).name === "string";
}

function pluginOptionHasName(option: PluginOption, name: string): boolean {
  if (Array.isArray(option)) {
    return option.some((inner) => pluginOptionHasName(inner, name));
  }

  return isNamedPlugin(option) && option.name === name;
}

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
  addons: [
    getAbsolutePath("@storybook/addon-svelte-csf"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/sveltekit"),
    options: {},
  },
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|ts|svelte)"],
  async viteFinal(config) {
    const existingPlugins = config.plugins ?? [];
    const hasTailwind = existingPlugins.some((plugin) =>
      pluginOptionHasName(plugin, "tailwindcss"),
    );

    if (!hasTailwind) {
      config.plugins = [...existingPlugins, tailwindcss()];
    }

    return config;
  },
};
export default config;
