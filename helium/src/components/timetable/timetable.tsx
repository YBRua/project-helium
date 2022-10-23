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

  assigned: Map<string, ITimeSlot>;
  addAssigned: (person: string, timeSlot: ITimeSlot) => void;
  removeAssigned: (person: string) => void;

  timeSlots: Map<string, ITimeSlot[]>;
  addPersonAt: (row: number, col: number, person: string) => void;
  removePersonAt: (row: number, col: number, person: string) => void;

  selectedPerson: string; // person name
  setSelectedPerson: (person: string) => void;
}) {
  const {
    columnHeaders,
    rowHeaders,
    rowSubHeaders,
    rowData,
    timeSlots,
    selectedPerson,
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
                        if (assigned.has(selectedPerson)) {
                          // if person is already assigned
                          // remove person from previous time slot
                          const slot = assigned.get(selectedPerson)!;
                          if (
                            slot.weekday === colIdx &&
                            slot.time === _getRowId(rowIdx, subRowIdx)
                          ) {
                            // do nothing if we are clicking on the same cell
                            setSelected("");
                            return;
                          }
                          removePersonAt(
                            slot.time,
                            slot.weekday,
                            selectedPerson
                          );
                          removeAssigned(selectedPerson);
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
