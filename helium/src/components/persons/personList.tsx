import React from "react";
import { ITimeSlot } from "../../interfaces/timeslots";
import { Person } from "./person";

export function PersonList(props: {
  persons: string[];
  assigned: Map<string, ITimeSlot[]>;
  enableDuplicate: Map<string, boolean>;
  selectedPerson: string;
  setSelectedPerson: (selected: string) => void;
  toggleEnableDuplicate: (person: string) => void;
}) {
  const {
    persons,
    assigned,
    enableDuplicate,
    selectedPerson,
    setSelectedPerson,
    toggleEnableDuplicate,
  } = props;
  return (
    <div>
      {persons
        .filter(
          (person) =>
            enableDuplicate.get(person) === true ||
            !assigned.has(person) ||
            assigned.get(person)?.length === 0
        )
        .map((person, index) => {
          return (
            <Person
              key={index}
              name={person}
              assigned={assigned}
              enableDuplicate={enableDuplicate}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              toggleEnableDuplicate={toggleEnableDuplicate}
            />
          );
        })}
    </div>
  );
}
