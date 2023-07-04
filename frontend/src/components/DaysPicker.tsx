import { Theme } from "@emotion/react";
import { Button, Box, SxProps } from "@mui/material";

const numberToDayMap: Record<number, string> = {
  0: "Mon",
  1: "Tue",
  2: "Wed",
  3: "Thu",
  4: "Fri",
  5: "Sat",
  6: "Sun",
};

type Props = {
  containerStyles: SxProps<Theme>;
  active: Record<number, boolean>;
  setActive: (value: Record<number, boolean>) => void;
};

const DaysPicker = ({ containerStyles, active, setActive }: Props) => {
  return (
    <Box
      className="pointer-events-none"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        ...containerStyles,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((num) => (
        <Button
          // onClick={() => setActive({ ...active, [num]: !active[num] })}
          size="small"
          variant={active[num] ? "contained" : "outlined"}
        >
          {numberToDayMap[num]}
        </Button>
      ))}
    </Box>
  );
};

export default DaysPicker;
