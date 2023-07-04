import { Typography } from "@mui/material";

type Props = {
  children: string;
};

const Caption = ({ children }: Props) => {
  return (
    <Typography
      color="secondary"
      className="uppercase"
      fontFamily="montserrat"
      fontWeight={500}
    >
      {children}
    </Typography>
  );
};

export default Caption;
