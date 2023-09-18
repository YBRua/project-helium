import { useState } from "react";
import { ITimeSlot } from "../interfaces/timeslots";

export function useAssignedPerson(init: Map<string, ITimeSlot[]>) {
  const [assignedPerson, setAssignedPerson] = useState(init);

  const addAssignedPerson = (person: string, timeSlot: ITimeSlot) => {
    setAssignedPerson((prev) => {
      const newSet = new Map(prev);
      const timeSlots = newSet.get(person);
      newSet.set(person, [...(timeSlots || []), timeSlot]);
      return newSet;
    });
  };

  const removeAssignedPerson = (person: string, timeSlot: ITimeSlot) => {
    setAssignedPerson((prev) => {
      const newSet = new Map(prev);
      const timeSlots = newSet.get(person);
      if (timeSlots) {
        const newTimeSlots = timeSlots.filter((ts) => ts.weekday !== timeSlot.weekday || ts.time !== timeSlot.time);
        newSet.set(person, newTimeSlots);
        console.log(newSet);
      }
      return newSet;
    })
  };

  return [
    assignedPerson,
    addAssignedPerson,
    removeAssignedPerson,
    setAssignedPerson,
  ] as const;
}
