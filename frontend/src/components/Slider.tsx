import {
  Box,
  Slider as MuiSlider,
  SxProps,
  Theme,
} from "@mui/material";
import Caption from "./Caption";

type Mark = {
  value: number;
  label: string;
};

type Props = {
  title: string;
  marks: Mark[];
  containerStyles: SxProps<Theme>;
  onChange: (e: any, value: number | number[]) => void;
  value: number;
  defaultValue?: number;
};

const Slider = ({
  title,
  marks,
  containerStyles,
  onChange,
  value,
  defaultValue,
}: Props) => {
  return (
    <Box sx={{ width: "100%", ...containerStyles }}>
      <Caption>{title}</Caption>
      <MuiSlider
        aria-label="Steps count"
        defaultValue={defaultValue}
        max={marks.at(-1)!.value}
        min={marks[0].value}
        marks={marks}
        step={null}
        valueLabelDisplay="off"
        color="primary"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default Slider;
