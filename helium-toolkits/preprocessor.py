import json
import pandas as pd
import preprocessor_config as pconfig

from collections import defaultdict


if __name__ == '__main__':
    # load file
    df = pd.read_excel(pconfig.XLSX_FILE_NAME, sheet_name=pconfig.SHEET_NAME)

    schema = pconfig.schema

    # concat row headers and subheaders
    full_row_headers = []
    for row_header in schema['rowHeaders']:
        for row_subheader in schema['rowSubHeaders']:
            full_row_headers.append(f'{row_header}@{row_subheader}')

    timeslots = defaultdict(list)  # name -> list of available time

    # iterate over each candidate
    for idx, row in df.iterrows():
        # this should be the name of the candidate
        name = row[pconfig.NAME_COLUMN_KEY]
        # this should be a string of the available time
        time_str = str(row[pconfig.TIME_COLUMN_KEY])
        # split the string by delimiter
        times = time_str.split(pconfig.TIME_STR_DELIMITER)

        for time in times:
            # skip ignore values
            if time in pconfig.IGNORE_VALUES:
                if len(times) != 1:
                    # we dont expect the result to contain
                    # more than one ignore value
                    # e.g. it cannot be things like '周三18:00、以上时间段都没空'
                    print(f'{name}: invalid result')
                timeslots[name] = []
                continue

            res = time.split(pconfig.TIME_DELIMITER)

            # it should split time into 2 parts date and time slot
            if len(res) != 2:
                raise ValueError(f'invalid time format: {time} ({name})')

            # unpack values
            date, timeslot = res

            if pconfig.SHOULD_APPEND_DELIMITER:
                date += pconfig.TIME_DELIMITER

            date = pconfig.post_process_date(date)
            timeslot = pconfig.post_process_time(timeslot)

            for sub in schema['rowSubHeaders']:
                timeslots[name].append(
                    {'weekday': date, 'time': f'{timeslot}@{sub}'})

    schema['persons'] = list(timeslots.keys())

    # construct string to int mapping
    col_header_to_idx = {h: i for i, h in enumerate(schema['columnHeaders'])}
    row_header_to_idx = {h: i for i, h in enumerate(full_row_headers)}

    # map string values to int indexes
    for name, times in timeslots.items():
        for time in times:
            time['weekday'] = col_header_to_idx[time['weekday']]
            time['time'] = row_header_to_idx[time['time']]

    # construct final time table
    timetable = {
        'schema': schema,
        'timeSlots': timeslots,
    }

    # dump results
    json.dump(
        timetable,
        open(pconfig.OUTPUT_FILE_NAME, 'w'), ensure_ascii=False, indent=2)
