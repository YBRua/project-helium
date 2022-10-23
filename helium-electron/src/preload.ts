// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { ITimeTableSchema } from "./interfaces/timeslots";

contextBridge.exposeInMainWorld("electronAPI", {
  loadJsonFile: () => ipcRenderer.invoke("dialog:openJson"),
  saveJsonFile: (schema: ITimeTableSchema, timeTable: string[][][]) =>
    ipcRenderer.send("dialog:saveJson", schema, timeTable),
});
