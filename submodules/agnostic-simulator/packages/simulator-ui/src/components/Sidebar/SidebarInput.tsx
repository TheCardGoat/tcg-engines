import { TextInput, type TextInputProps } from "@mantine/core";
import classes from "./Sidebar.module.css";

export function SidebarInput({ className, ...rest }: TextInputProps) {
  return (
    <TextInput
      data-slot="sidebar-input"
      classNames={{ input: classes.inputControl }}
      className={`${classes.input} ${className ?? ""}`}
      {...rest}
    />
  );
}
