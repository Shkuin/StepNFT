import { Typography } from "@mui/material";

export const Title = ({ children, ...props }: any) => (
  <Typography
    color={"white"}
    fontFamily={"montserrat"}
    fontSize={34}
    {...props}
  >
    {children}
  </Typography>
);
