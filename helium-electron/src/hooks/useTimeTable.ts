import { useState } from "react";

export function useTimeTable(nRows: number, nCols: number) {
  const [timeTable, setTimeTable] = useState(
    Array.from({ length: nRows }, () => Array.from({ length: nCols }, () => []))
  );

  const addPersonAt = (row: number, col: number, person: string) => {
    setTimeTable((prev) => {
      const newTimeTable: string[][][] = JSON.parse(JSON.stringify(prev));
      newTimeTable[row][col].push(person);
      return newTimeTable;
    });
  };

  const removePersonAt = (row: number, col: number, person: string) => {
    setTimeTable((prev) => {
      const newTimeTable: string[][][] = JSON.parse(JSON.stringify(prev));
      newTimeTable[row][col] = newTimeTable[row][col].filter(
        (p) => p !== person
      );
      return newTimeTable;
    });
  };

  return [timeTable, addPersonAt, removePersonAt, setTimeTable] as const;
}
