import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

interface SelectProps {
  list: any;
  changed: any;
  defaultValue?: any;
  type: any;
}

export default function NativeSelects({
  list,
  changed,
  type,
  defaultValue
}: SelectProps) {
  const [value, setValue] = React.useState(defaultValue || "");

  const handleChange = (event: any) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const data = list
    ? list.map((item: any, id: any) => {
        if (item.reciter_name_eng) {
          return (
            <option key={item.reciter_name_eng + id} value={item.id}>
              {item.reciter_name_eng} {item.style}
            </option>
          );
        }
        //if its not null
        if (item.name_simple) {
          return (
            <option key={item.name_simple + id} value={item.chapter_number}>
              {item.chapter_number}. {item.name_simple}
            </option>
          );
        }
        if (item.language_name) {
          return (
            <option key={item.language_name + id} value={item.id}>
              {item.language_name} by {item.author_name}
            </option>
          );
        }
        return null;
      })
    : null;

  return (
    <div>
      <FormControl variant='filled'>
        <InputLabel htmlFor='filled-age-native-simple'>{type}</InputLabel>
        <Select
          native
          value={value}
          onChange={(event) => {
            changed(event.target.value, type);
            handleChange(event);
          }}
        >
          {/* <option value={null}> </option> */}

          {data}
        </Select>
      </FormControl>
    </div>
  );
}
