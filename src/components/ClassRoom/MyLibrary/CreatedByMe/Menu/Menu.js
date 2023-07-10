import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import MoreVertIcon from "@mui/icons-material/MoreVert";
export default function AccountMenu({
  handleLikeQuiz,
  handleImportantQuiz,
  subject,
  lessonName,
  grade,
  lessonImage,
  questions,
  quizType,
  refId,
  role,
  totalDuration,
  totalMarks,
  createdAt,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(questions, "questions MenuC");
  console.log(quizType, "quizType MenuC");
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVertIcon
              sx={{ fontSize: "10px", width: 22, height: 32 }}
            ></MoreVertIcon>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 12,
              height: 12,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() =>
            handleLikeQuiz(
              subject,
              lessonName,
              grade,
              lessonImage,
              questions,
              quizType,
              refId,
              role,
              totalDuration,
              totalMarks,
              createdAt
            )
          }
        >
          <FavoriteIcon sx={{ fontSize: 14, marginRight: "10px" }} /> Like
        </MenuItem>
        {/* <Divider />
        <MenuItem sx={{ marginRight: "20px" }} onClick={handleClose}>
          <BeenhereIcon
            sx={{ fontSize: 14, marginRight: "10px", fontWeight: 500 }}
          />{" "}
          Save
        </MenuItem> */}
        <Divider />
        <MenuItem
          sx={{ marginRight: "20px" }}
          onClick={() =>
            handleImportantQuiz(
              subject,
              lessonName,
              grade,
              lessonImage,
              questions,
              quizType,
              refId,
              role,
              totalDuration,
              totalMarks,
              createdAt
            )
          }
        >
          <BeenhereIcon
            sx={{ fontSize: 14, marginRight: "10px", fontWeight: 500 }}
          />{" "}
          Imp
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
