import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Title } from "./Title";

type Props = {
  title: string;
  routeBack?: string;
};

const Header = ({ title, routeBack }: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }} className="mb-6">
        {routeBack && (
          <Link to={routeBack || ""}>
            <ArrowBack className="mr-4" color="info" />
          </Link>
        )}
      <Title className="!font-bold !text-4xl">{title}</Title>
    </Box>
  );
};

export default Header;
