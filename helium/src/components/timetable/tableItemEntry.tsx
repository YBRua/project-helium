import React from "react";
import { IPersonEntry } from "../../hooks/useGroup";

export function TableItemEntry(props: {
  person: string;
  onClick: () => void;
  onRemove: () => void;
  isSelected: boolean;
  enableDuplicate: Map<string, boolean>;
  group: number;
  onToggleGroups: () => void;
}) {
  const {
    person,
    onClick,
    onRemove,
    isSelected,
    enableDuplicate,
    group,
    onToggleGroups,
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
        onClick={onToggleGroups}
      >
        ■ {group}
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
