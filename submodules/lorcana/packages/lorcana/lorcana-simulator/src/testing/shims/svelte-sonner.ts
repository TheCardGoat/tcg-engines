import Toaster from "./svelte-sonner.svelte";

export { Toaster };

export type ToasterProps = Record<string, unknown>;

type ToastOptions = Record<string, unknown>;
type ToastMethod = (message: string, options?: ToastOptions) => void;

const noopToastMethod: ToastMethod = (_message, _options) => {};

export const toast = Object.assign(noopToastMethod, {
  error: noopToastMethod,
  info: noopToastMethod,
  success: noopToastMethod,
  warning: noopToastMethod,
});
