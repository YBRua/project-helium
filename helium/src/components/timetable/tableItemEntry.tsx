import React from "react";
import { IPersonEntry } from "../../hooks/useGroup";

export function TableItemEntry(props: {
  person: string;
  onClick: () => void;
  onRemove: () => void;
  isSelected: boolean;
  enableDuplicate: Map<string, boolean>;
  group: number;
  groupId2Name: string[];
  onGroupIncrement: () => void;
  onGroupDecrement: () => void;
}) {
  const {
    person,
    onClick,
    onRemove,
    isSelected,
    enableDuplicate,
    group,
    groupId2Name,
    onGroupIncrement,
    onGroupDecrement,
  } = props;

  const isDuplicateEnabled = enableDuplicate.get(person) ?? false;

  let extraClassName = isSelected ? "timetable--row-entry-selected " : "";
  if (isDuplicateEnabled) {
    extraClassName += "timetable--row-entry-duplicate ";
  }

  const groupClass = `timetable--row-entry-group-${group}`;
  return (
    <div className={"timetable--row-entry-container " + extraClassName}>
      <div
        className={"timetable--row-entry-group " + groupClass}
        onClick={onGroupIncrement}
        onContextMenu={(e) => {
          e.preventDefault();
          onGroupDecrement();
        }}
      >
        ■ {groupId2Name[group]}
      </div>
      <div className="timetable--row-entry" onClick={() => onClick()}>
        {person}
      </div>
      <div className="timetable--row-entry-rm" onClick={() => onRemove()}>
        ❌
      </div>
    </div>
  );
}
