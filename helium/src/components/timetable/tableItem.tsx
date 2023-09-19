import React from "react";
import { ITimeSlot } from "../../interfaces/timeslots";
import { TableItemEntry } from "./tableItemEntry";
import { IPersonEntry } from "../../hooks/useGroup";

export function TableItem(props: {
  currentTimeSlot: ITimeSlot;
  persons: string[];
  isAssignable: boolean;
  onCellClick: () => void;

  assigned: Map<string, ITimeSlot[]>;
  removeAssigned: (person: string, timeSlot: ITimeSlot) => void;

  removePersonAt: (row: number, col: number, person: string) => void;

  selectedPerson: string;
  setSelected: (person: string) => void;

  enableDuplicate: Map<string, boolean>;

  groups: Map<String, number>;
  toggleGroups: (person: IPersonEntry) => void;
  unsetGroups: (person: IPersonEntry) => void;
}) {
  const { currentTimeSlot, persons, isAssignable, onCellClick } = props;
  const { assigned, removeAssigned, removePersonAt } = props;
  const { selectedPerson, setSelected } = props;
  const { enableDuplicate } = props;
  const { groups, toggleGroups, unsetGroups } = props;

  // sort persons by whether duplication is enabled
  persons.sort((a, b) => {
    const aEnabled = enableDuplicate.get(a) || false;
    const bEnabled = enableDuplicate.get(b) || false;
    if (aEnabled && !bEnabled) {
      return 1;
    } else if (!aEnabled && bEnabled) {
      return -1;
    } else {
      return 0;
    }
  });

  const extraClassName = isAssignable ? "timetable--assignable" : "";
  return (
    <td
      className={"timetable--row-cell " + extraClassName}
      onClick={() => onCellClick()}
    >
      {persons.map((person, index) => {
        const onEntryClick = () => {
          setSelected(person);
        };
        const onEntryRemove = () => {
          const timeSlots = assigned.get(person);
          if (timeSlots) {
            removePersonAt(
              currentTimeSlot.time,
              currentTimeSlot.weekday,
              person
            );
            removeAssigned(person, currentTimeSlot);
            unsetGroups({
              name: person,
              weekday: currentTimeSlot.weekday,
              time: currentTimeSlot.time,
            });
            setSelected("");
          }
        };
        const isSelected = person === selectedPerson;
        return (
          <TableItemEntry
            key={index}
            person={person}
            onClick={onEntryClick}
            onRemove={onEntryRemove}
            isSelected={isSelected}
            enableDuplicate={enableDuplicate}
            group={
              groups.get(
                `${person}-${currentTimeSlot.weekday}-${currentTimeSlot.time}`
              ) ?? 0
            }
            onToggleGroups={() => {
              toggleGroups({
                name: person,
                weekday: currentTimeSlot.weekday,
                time: currentTimeSlot.time,
              });
            }}
          />
        );
      })}
    </td>
  );
}
