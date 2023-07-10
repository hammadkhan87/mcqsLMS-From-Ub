import React from "react";
import "./Dashboard.scss";
import { NavLink } from "react-router-dom";
import CeateChapter from "./CreateChapter/CeateChapter";
import CreateQuiz from "./CreateQuiz/CreateQuiz";
import Sidebar from "./Sidebar/Sidebar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DynamicStatistic from "./DynamicStatistic/DynamicStatistic";
import MathKeyboard from "./MathKeyboard/MathKeyboard";
import EditLesson from "./EditLesson/EditLesson";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="main-div">
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
        }}
      >
        <Tabs 
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider", marginTop: 4 }}
        >
          <h2>Admin Pannel</h2>
          <Tab label="Create Chapter" {...a11yProps(0)} />
          <Tab label="Create Quiz" {...a11yProps(1)} />
          <Tab label="Edite lesson" {...a11yProps(2)} />
          <Tab label="Dynamic statistic" {...a11yProps(3)} />
          
        </Tabs>
        <TabPanel value={value} index={0}>
          <CeateChapter />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CeateChapter />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CreateQuiz />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <EditLesson/>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <DynamicStatistic />
        </TabPanel>
       
      </Box>

      {/* <div className="left-side">
        <div>
          <h2>Admin Pannel</h2>
        </div>
        <div className="m-links">
          <span>Create Quiz</span>
          <NavLink to="/admin/create-chapter">
            <span>Create chapter</span>
          </NavLink>
          <span>Edite lesson</span>
          <span>Dynamic statistic</span>
          <span>Logout</span>
        </div>
      </div>
      <div className="right-side">
        <CreateQuiz/>
      </div> */}
    </div>
  );
};

export default Dashboard;
