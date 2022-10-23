import * as fs from "fs";
import { dialog } from "electron";
import { ITimeTable, ITimeTableSchema } from "../interfaces/timeslots";

function getDefaultTimeTable(): ITimeTable {
  return {
    schema: {
      columnHeaders: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      rowHeaders: ["14:00-16:00", "16:00-18:00", "18:00-20:00"],
      rowSubHeaders: ["值班", "报修"],
      persons: ["点击“导入”加载 JSON 时间表"],
    },
    timeSlots: new Map([["点击“导入”加载 JSON 时间表", []]]),
  };
}

function _convertToITimeTable(jsonObject: any): ITimeTable {
  const timeTable = getDefaultTimeTable();
  timeTable.schema = jsonObject["schema"];
  timeTable.timeSlots = new Map(Object.entries(jsonObject["timeSlots"]));
  return timeTable as ITimeTable;
}

export async function loadJsonFile(): Promise<ITimeTable> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "Select a JSON file",
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (canceled) {
    return null;
  }

  const filePath = filePaths[0];
  const file = fs.readFileSync(filePath, "utf8");
  if (!file) {
    return null;
  }
  return _convertToITimeTable(JSON.parse(file));
}

export function convertToOScopeCompatible(
  schema: ITimeTableSchema,
  timeTable: string[][][]
) {
  const rowHeaders = schema.rowHeaders;
  const columnHeaders = schema.columnHeaders;
  const rowSubHeaders = schema.rowSubHeaders;
  const res = [];
  for (let i = 0; i < rowHeaders.length; i++) {
    for (let j = 0; j < columnHeaders.length; j++) {
      const dayTime = `${columnHeaders[j]}@${rowHeaders[i]}`;
      for (let k = 0; k < rowSubHeaders.length; k++) {
        const location = rowSubHeaders[k];
        const persons = Array.from(timeTable[i * rowSubHeaders.length + k][j]);
        res.push({
          time: dayTime,
          location: location,
          attendees: persons,
        });
      }
    }
  }
  return res;
}

export async function saveJsonFile(json: Object) {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Export JSON file",
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (canceled) {
    return;
  }

  fs.writeFileSync(filePath, JSON.stringify(json));
  return;
}
