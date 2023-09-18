import React, { useState } from "react";
import { useAssignedPerson } from "./hooks/useAssignedPerson";
import { useTimeTable } from "./hooks/useTimeTable";
import { useEnableDuplicate } from "./hooks/useEnableDuplicate";

import { ITimeSlot, ITimeTable } from "./interfaces/timeslots";

import { NavigationBar, NavBarControlPanel } from "./components/navbar/navbar";
import { NavBarButton } from "./components/navbar/navbarButton";
import { NavBarUpload } from "./components/navbar/navbarUpload";
import { TimeTable } from "./components/timetable/timetable";
import { ControlPanel } from "./components/controlPanel/controlPanel";
import { PersonList } from "./components/persons/personList";
import { ControlPanelButton } from "./components/controlPanel/controlPanelButton";

import "./styles/index.css";
import { convertToOScopeCompatible } from "./jsonio";

declare const window: any;

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

const defaultTimeSlotData: ITimeTable = getDefaultTimeTable();

function _getNRows(data: ITimeTable) {
  return data.schema.rowHeaders.length * data.schema.rowSubHeaders.length;
}

function _getNCols(data: ITimeTable) {
  return data.schema.columnHeaders.length;
}

export function App() {
  const [timeTableData, setTimeTableData] =
    useState<ITimeTable>(defaultTimeSlotData);
  const [timeTable, addPersonAt, removePersonAt, setTimeTable] = useTimeTable(
    _getNRows(timeTableData),
    _getNCols(timeTableData)
  );

  const [assigned, addAssigned, removeAssigned, setAssigned] =
    useAssignedPerson(new Map<string, ITimeSlot[]>());

  const [selectedPerson, setSelectedPerson] = useState<string>("");

  const [enableDuplicate, setEnableDuplicatePersons, toggleEnableDuplicate] =
    useEnableDuplicate(new Map<string, boolean>());

  function resetAssigned() {
    // resets the set of assigned persons
    setAssigned(new Map<string, ITimeSlot[]>());
    setTimeTable(
      Array.from({ length: _getNRows(timeTableData) }, () =>
        Array.from({ length: _getNCols(timeTableData) }, () => [])
      )
    );
  }

  function sortByAvailableTime() {
    // sort all candidates by the number of available time slots
    const sorted = new Map<string, ITimeSlot[]>(
      [...timeTableData.timeSlots.entries()].sort(
        (a, b) => a[1].length - b[1].length
      )
    );
    const persons = Array.from(sorted.keys());
    setTimeTableData({
      schema: { ...timeTableData.schema, persons: persons },
      timeSlots: sorted,
    });
  }

  function resetToDefaultTimeTableData() {
    // resets the time table data to the default one
    setTimeTableData(defaultTimeSlotData);
    setEnableDuplicatePersons(defaultTimeSlotData.schema.persons);
    resetAssigned();
    setTimeTable(
      Array.from({ length: _getNRows(timeTableData) }, () =>
        Array.from({ length: _getNCols(timeTableData) }, () => [])
      )
    );
  }

  function updateTimeTableData(timeTableData: ITimeTable) {
    // opens a file dialog and loads the selected file
    setTimeTableData(timeTableData);
    setEnableDuplicatePersons(timeTableData.schema.persons);
    setAssigned(new Map<string, ITimeSlot[]>());
    setTimeTable(
      Array.from({ length: _getNRows(timeTableData) }, () =>
        Array.from({ length: _getNCols(timeTableData) }, () => [])
      )
    );
  }

  function saveTimeTableToJson() {
    // saves timeTable to json
    const json = JSON.stringify(
      convertToOScopeCompatible(timeTableData.schema, timeTable)
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timeTable.json";
    a.click();
  }

  // App layout here
  return (
    <React.StrictMode>
      {/* Navigation bar */}
      <div>
        <NavigationBar>
          <NavBarControlPanel>
            <NavBarUpload
              updateTimeTableData={(e) => {
                updateTimeTableData(e);
              }}
            ></NavBarUpload>

            <NavBarButton
              text="重置"
              onClick={resetToDefaultTimeTableData}
            ></NavBarButton>
            <NavBarButton
              text="导出"
              onClick={saveTimeTableToJson}
            ></NavBarButton>
          </NavBarControlPanel>
        </NavigationBar>
      </div>

      {/* Main body of the application */}
      <div className="app-body">
        {/* LHS: A time table */}
        <div className="timetable-container">
          <TimeTable
            columnHeaders={timeTableData.schema.columnHeaders}
            rowHeaders={timeTableData.schema.rowHeaders}
            rowSubHeaders={timeTableData.schema.rowSubHeaders}
            rowData={timeTable}
            timeSlots={timeTableData.timeSlots}
            selectedPerson={selectedPerson}
            assigned={assigned}
            addAssigned={addAssigned}
            removeAssigned={removeAssigned}
            addPersonAt={addPersonAt}
            removePersonAt={removePersonAt}
            setSelectedPerson={setSelectedPerson}
            enableDuplicate={enableDuplicate}
          ></TimeTable>
        </div>

        {/* RHS: Control panel and candidate selection panel */}
        <div className="rhs-panels">
          <div className="control-panel-container">
            <ControlPanel>
              <ControlPanelButton
                onClick={resetAssigned}
                text="清空"
              ></ControlPanelButton>
              <ControlPanelButton
                onClick={sortByAvailableTime}
                text="排序"
              ></ControlPanelButton>
            </ControlPanel>
          </div>
          <div className="persons-container">
            <PersonList
              persons={timeTableData.schema.persons}
              assigned={assigned}
              enableDuplicate={enableDuplicate}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              toggleEnableDuplicate={toggleEnableDuplicate}
            ></PersonList>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}
