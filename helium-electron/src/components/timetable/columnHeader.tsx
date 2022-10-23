import React from "react";

export function ColumnHeader(props: { headerText: string }) {
  return <th className="timetable--header">{props.headerText}</th>;
}
