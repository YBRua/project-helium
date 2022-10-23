import React from "react";

export function TableItemEntry(props: {
  person: string;
  onClick: () => void;
  onRemove: () => void;
  isSelected: boolean;
}) {
  const extraClassName = props.isSelected ? "timetable--row-entry-selected" : "";
  return (
    <div className="timetable--row-entry-container">
      <div className={"timetable--row-entry " + extraClassName} onClick={() => props.onClick()}>
        {props.person}
      </div>
      <div className="timetable--row-entry-rm" onClick={() => props.onRemove()}>❌</div>
    </div>
  );
}
