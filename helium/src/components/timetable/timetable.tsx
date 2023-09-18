import React from "react";
import { TableRow } from "./tableRow";
import { ColumnHeader } from "./columnHeader";
import { TableItem } from "./tableItem";

import { ITimeSlot } from "../../interfaces/timeslots";

import "../../styles/timetable.scss";

export function TimeTable(props: {
  columnHeaders: string[];
  rowHeaders: string[];
  rowSubHeaders: string[];
  rowData: string[][][];

  assigned: Map<string, ITimeSlot[]>;
  addAssigned: (person: string, timeSlot: ITimeSlot) => void;
  removeAssigned: (person: string, timeslots: ITimeSlot) => void;

  timeSlots: Map<string, ITimeSlot[]>;
  addPersonAt: (row: number, col: number, person: string) => void;
  removePersonAt: (row: number, col: number, person: string) => void;

  selectedPerson: string; // person name
  setSelectedPerson: (person: string) => void;

  enableDuplicate: Map<string, boolean>;
}) {
  const {
    columnHeaders,
    rowHeaders,
    rowSubHeaders,
    rowData,
    timeSlots,
    selectedPerson,
    enableDuplicate,
  } = props;
  const { assigned, addAssigned, removeAssigned } = props;
  const { addPersonAt, removePersonAt } = props;
  const { setSelectedPerson: setSelected } = props;

  const assignableTimeSlots = timeSlots.get(selectedPerson) || [];

  function _getRowId(row: number, subRow: number) {
    return rowSubHeaders.length * row + subRow;
  }

  return (
    <table className="timetable">
      {/* Table header */}
      <thead>
        <tr className="timetable--row">
          <th className="timetable--row-header timetable--first-col"></th>
          <th className="timetable--row-header timetable--first-col"></th>
          {columnHeaders.map((header, index) => {
            return <ColumnHeader key={index} headerText={header} />;
          })}
        </tr>
      </thead>

      {/* Table body */}
      <tbody>
        {rowHeaders.map((header, rowIdx) => {
          // create rows
          // for each row, it contains multiple subrows
          // specified by rowSubHeaders
          return rowSubHeaders.map((subHeader, subRowIdx) => {
            let rowHeader = null;

            // first subrow of each row contains the row header
            if (subRowIdx === 0) {
              rowHeader = (
                <td
                  className="timetable--row-header timetable--first-col"
                  rowSpan={rowSubHeaders.length}
                >
                  {header}
                </td>
              );
            }

            // use different bg color for odd and even rows
            let extraClassName = rowIdx % 2 ? "timetable--row-darker" : "";
            return (
              <TableRow
                key={`${rowIdx}-${subRowIdx}`}
                extraClassName={extraClassName}
              >
                {rowHeader}
                <td className="timetable--row-header timetable--first-col">
                  {subHeader}
                </td>
                {rowData[_getRowId(rowIdx, subRowIdx)].map(
                  (persons, colIdx) => {
                    // creating each cell

                    // check if the cell is assignable
                    // if it is, it will have a different bg color when rendering
                    let isAssignable = false;
                    for (const timeSlot of assignableTimeSlots) {
                      if (
                        timeSlot.weekday === colIdx &&
                        timeSlot.time === _getRowId(rowIdx, subRowIdx)
                      ) {
                        isAssignable = true;
                        break;
                      }
                    }

                    const onCellClick = () => {
                      // handle clicks on a (assignable) timetable cell
                      // if cell is assignable, add person to cell
                      if (isAssignable) {
                        if (assigned.get(selectedPerson)?.length ?? 0 > 0) {
                          const slots = assigned.get(selectedPerson)!;
                          for (const slot of slots) {
                            // do nothing if the person has been assigned to the cell
                            if (
                              slot.weekday === colIdx &&
                              slot.time === _getRowId(rowIdx, subRowIdx)
                            ) {
                              setSelected("");
                              return;
                            }
                          }

                          // if the person could only be assigned once,
                          // move it from the previous cell to the newly selected cell.
                          const isDuplicateEnabled =
                            enableDuplicate.get(selectedPerson) ?? false;
                          if (!isDuplicateEnabled) {
                            for (const slot of slots) {
                              removePersonAt(
                                slot.time,
                                slot.weekday,
                                selectedPerson
                              );
                              removeAssigned(selectedPerson, slot);
                            }
                          }
                        }

                        // add person to new time slot
                        addPersonAt(
                          _getRowId(rowIdx, subRowIdx),
                          colIdx,
                          selectedPerson
                        );
                        addAssigned(selectedPerson, {
                          weekday: colIdx,
                          time: _getRowId(rowIdx, subRowIdx),
                        });
                        setSelected("");
                      }
                    };

                    return (
                      <TableItem
                        key={colIdx}
                        currentTimeSlot={{
                          weekday: colIdx,
                          time: _getRowId(rowIdx, subRowIdx),
                        }}
                        persons={persons}
                        isAssignable={isAssignable}
                        onCellClick={onCellClick}
                        selectedPerson={selectedPerson}
                        setSelected={setSelected}
                        assigned={assigned}
                        removeAssigned={removeAssigned}
                        removePersonAt={removePersonAt}
                      />
                    );
                  }
                )}
              </TableRow>
            );
          });
        })}
      </tbody>
    </table>
  );
}
