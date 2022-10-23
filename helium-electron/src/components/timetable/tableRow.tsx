import React from "react";

import "../../styles/timetable.scss";

export function TableRow(props: { children: React.ReactNode, extraClassName?: string }) {
  const { children, extraClassName } = props;
  return <tr className={"timetable--row " + extraClassName ?? ""}>{children}</tr>;
}
