import { useState } from "react";
import { ITimeSlot } from "../interfaces/timeslots";

export function useAssignedPerson(init: Map<string, ITimeSlot>) {
  const [assignedPerson, setAssignedPerson] = useState(init);

  const addAssignedPerson = (person: string, timeSlot: ITimeSlot) => {
    setAssignedPerson((prev) => {
      const newSet = new Map(prev);
      newSet.set(person, timeSlot);
      return newSet;
    });
  };

  const removeAssignedPerson = (person: string) => {
    setAssignedPerson((prev) => {
      const newSet = new Map(prev);
      newSet.delete(person);
      return newSet;
    });
  };

  return [
    assignedPerson,
    addAssignedPerson,
    removeAssignedPerson,
    setAssignedPerson,
  ] as const;
}
