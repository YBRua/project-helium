import { personEntryToString } from "./hooks/useGroup";
import { ITimeTable, ITimeTableSchema } from "./interfaces/timeslots";

export function getDefaultTimeTable(): ITimeTable {
  return {
    schema: {
      columnHeaders: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      rowHeaders: ["14:00-16:00", "16:00-18:00", "18:00-20:00"],
      rowSubHeaders: ["值班", "报修"],
      persons: ["点击“导入”加载 JSON 时间表"],
      groups: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => `组${x}`),
    },
    timeSlots: new Map([["点击“导入”加载 JSON 时间表", []]]),
  };
}

export function convertToITimeTable(jsonObject: any): ITimeTable {
  const timeTable = getDefaultTimeTable();
  timeTable.schema = jsonObject["schema"];
  timeTable.timeSlots = new Map(Object.entries(jsonObject["timeSlots"]));
  for (let i = timeTable.schema.groups.length; i < 9; i++) {
    timeTable.schema.groups.push(`组${i + 1}`);
  }

  return timeTable as ITimeTable;
}

export function convertToOScopeCompatible(
  schema: ITimeTableSchema,
  timeTable: string[][][],
  groups: Map<String, number>,
) {
  const rowHeaders = schema.rowHeaders;
  const columnHeaders = schema.columnHeaders;
  const rowSubHeaders = schema.rowSubHeaders;
  const groupId2Names = schema.groups;
  const res = [];
  for (let i = 0; i < rowHeaders.length; i++) {
    for (let j = 0; j < columnHeaders.length; j++) {
      const date = columnHeaders[j];
      const time = rowHeaders[i];
      // const dayTime = `${columnHeaders[j]}@${rowHeaders[i]}`;
      for (let k = 0; k < rowSubHeaders.length; k++) {
        const location = rowSubHeaders[k];
        const attendees = [];
        for (let l = 0; l < timeTable[i * rowSubHeaders.length + k][j].length; l++) {
          const person = timeTable[i * rowSubHeaders.length + k][j][l];
          const group = groups.get(personEntryToString({
            name: person,
            weekday: j,
            time: i * rowSubHeaders.length + k,
          }));
          attendees.push({
            name: person,
            group: groupId2Names[group ?? 0],
          })
        }

        res.push({
          date: date,
          time: time,
          location: location,
          attendees: attendees,
        })
      }
    }
  }
  return res;
}
