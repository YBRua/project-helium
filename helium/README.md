# Project Helium

排班辅助工具，但是代码逆天，state 和 hook 到处乱飞，绝赞重构中。

目前部署在 <https://helium.ybirua.top/>。如果哪天这个链接挂了应该是我的阿里云服务器欠费了，或者它真的转正了。

## 构建项目

```sh
# install dependencies
yarn
# start dev server
yarn dev
# build (output will be written to 'dist')
yarn build
```

## 使用手册

### 导航栏

- 导入：导入一个 JSON 时间表
- 重置：清空当前排班，重置回默认时间表
- 导出：将当前排班导出为 JSON

### 右侧控制台

- 清空：清空当前排班
- 排序：按照候选人有空的时间段数量排序，经验上先安排有空时间段少的人比较好操作
- 人员列表：单击某个人会在左侧排班表上高亮显示他有空的时间段

### 导入的 JSON 格式

导入的 JSON 应该至少包含以下字段

- `schema`: 时间表的概要
  - `columnHeaders (List[str])`: 非空。每列的名称，通常每一列是某一天（日期或者一星期中的某一天）
  - `rowHeaders (List[str])`: 非空。每行的名称，通常每一行是某个时间段
  - `rowSubHeaders (List[str])`: 非空。将每一行进一步拆分，通常可能是岗位或者地点（教室）。**必须至少包含 1 个元素**。
  - `persons (List[str])`: 人
- `timeSlots (Map[str, List[TimeSlot]])`: 一个字典，key 为 `person` 中的值，`value` 是 `list` of `dict`
  - `list` 中每个 `dict` (称作 `TimeSlot`) 需要包含 `weekday` 和 `time` 两个 key。
    - `weekday (int)`: 一个 index，对应 `columnHeaders` 中某一天
    - `time (int)`: 一个 index，对应 `rowHeaders * rowSubHeaders` 中某一个时间段的某一个岗位/地点

目前 Helium 的实现里不会检查上传的 JSON 格式是否合法。不合法的 JSON 可能导致应用崩溃。

可以考虑使用 [Helium Toolkit 提供的 Preprocessor](./../helium-toolkits/preprocessor_config.py) 来自动化地从一些 xlsx 格式的问卷结果导出 JSON。

#### 一个示例文件

```json
{
    "schema": {
        "columnHeaders": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        "rowHeaders": ["14:00-16:00", "16:00-18:00", "18:00-20:00"],
        "rowSubHeaders": ["肯德基", "麦当劳"],
        "persons": ["各歪暗"],
    },
    "timeSlots": {
        "各歪暗": [
        {
            "weekday": 1,
            "time": 0
        },
        {
            "weekday": 1,
            "time": 1
        }
        ]
    },
}
```
