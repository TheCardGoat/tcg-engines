import type { WithElementRef } from "$lib/utils";
import type { HTMLSelectAttributes } from "svelte/elements";
import Root from "./select.svelte";

type SelectProps = WithElementRef<HTMLSelectAttributes>;

export {
  Root,
  type SelectProps as Props,
  //
  Root as Select,
};
