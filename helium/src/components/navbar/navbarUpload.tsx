import React from "react";
import { ITimeTable } from "../../interfaces/timeslots";
import { convertToITimeTable, getDefaultTimeTable } from "../../jsonio";

export function NavBarUpload(props: {
  updateTimeTableData: (json: ITimeTable) => void;
}) {
  const { updateTimeTableData } = props;
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const onClick = () => {
    hiddenFileInput.current!.click();
  };

  const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const fileUploaded = (event.target as HTMLInputElement).files;
    if (fileUploaded) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target as FileReader).result?.toString();
        if (text) {
          const res = convertToITimeTable(JSON.parse(text));
          updateTimeTableData(res);
        } else {
          updateTimeTableData(getDefaultTimeTable());
        }
      };
      reader.readAsText(fileUploaded[0], "utf-8");
      // manually reset hidden value
      // so it can be triggered again
      hiddenFileInput.current!.value = "";
    }
  };

  return (
    <>
      <button className="navbar--button" onClick={() => onClick()}>
        导入
      </button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={(e) => onFileChange(e)}
        style={{ display: "none" }}
        accept=".json"
      />
    </>
  );
}
