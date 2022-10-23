export interface ITimeSlot {
  weekday: number;
  time: number;
}

export interface ITimeTableSchema {
  columnHeaders: string[];
  rowHeaders: string[];
  rowSubHeaders: string[];
  persons: string[];
}

export interface ITimeTable {
  schema: ITimeTableSchema;
  timeSlots: Map<string, ITimeSlot[]>;
}
