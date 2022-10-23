import React from "react";
import { ITimeSlot } from "../../interfaces/timeslots";
import { TableItemEntry } from "./tableItemEntry";

export function TableItem(props: {
  persons: string[];
  isAssignable: boolean;
  onCellClick: () => void;

  assigned: Map<string, ITimeSlot>;
  removeAssigned: (person: string) => void;

  removePersonAt: (row: number, col: number, person: string) => void;

  selectedPerson: string;
  setSelected: (person: string) => void;
}) {

  const { persons, isAssignable, onCellClick } = props;
  const { assigned, removeAssigned, removePersonAt } = props;
  const { selectedPerson, setSelected } = props;

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
          const timeSlot = assigned.get(person);
          if (timeSlot) {
            removePersonAt(timeSlot.time, timeSlot.weekday, person);
            removeAssigned(person);
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
          />
        );
      })}
    </td>
  );
}
