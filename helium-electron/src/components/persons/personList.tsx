import React from "react";
import { ITimeSlot } from "../../interfaces/timeslots";
import { Person } from "./person";

export function PersonList(props: {
  persons: string[];
  assigned: Map<string, ITimeSlot>;
  selectedPerson: string;
  setSelectedPerson: (selected: string) => void;
}) {
  const { persons, assigned, selectedPerson, setSelectedPerson } = props;
  return (
    <div>
      {persons
        .filter((person) => !assigned.has(person))
        .map((person, index) => {
          return (
            <Person
              key={index}
              name={person}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
            />
          );
        })}
    </div>
  );
}
