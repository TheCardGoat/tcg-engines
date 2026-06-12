import { mock } from "bun:test";
import { toast } from "./shims/svelte-sonner";
import { Toaster } from "./shims/svelte-sonner";

mock.module("svelte-sonner", () => ({
  Toaster,
  toast,
}));

mock.module("$app/environment", () => ({
  dev: false,
  browser: false,
  building: false,
  version: "",
}));
