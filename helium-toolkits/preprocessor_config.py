# Configuration file for preprocessor

# name of the xlsx file, should be in the same directory as this script
XLSX_FILE_NAME = '一个xlsx文件.xlsx'
# sheet of the xlsx file
SHEET_NAME = 'Sheet1'
# key to the column for name
NAME_COLUMN_KEY = '提交者'
# key to the column for available time
TIME_COLUMN_KEY = '比如第三题是个有空的时间段的多选题'
# name of the output file
OUTPUT_FILE_NAME = 'timetable-output.json'

# delimiter for time column string
# e.g. '、' in '周三 18:00、周四 18:00'
TIME_STR_DELIMITER = '、'

# delimiter that splits date and time slot
# e.g. '-' in '2月30日-18:00'
# NOTE: If the timeslot does not contain delimiter (e.g. '2月30日18:00')
# you can use '日' as the delimiter and set SHOULD_APPEND_DELIMITER to True
TIME_DELIMITER = '日'
SHOULD_APPEND_DELIMITER = True

# special values that will be ignored when processing
# an empty list will be assigned to the person
IGNORE_VALUES = {'以上时间段都没空', 'nan'}

# timetable schema
schema = {
    # column headers, expected to be dates or weekdays
    'columnHeaders': ['10月31日', '10月32日', '10月33日'],
    # row headers, expected to be time slots
    'rowHeaders': [
        '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-21:30',
    ],
    # row sub headers, expected to be locations / types or anything else
    'rowSubHeaders': ['肯德基'],
}


# post-processor for time and date values,
# do whatever you need to do to the values in these functions
def post_process_time(time: str):
    # here we remove extra parentheses
    return time.split('）')[1]


def post_process_date(date: str):
    return date
