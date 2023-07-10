import React from 'react'
import "./ClassQuizzes.scss"
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Schedule from './Schedule/Schedule';
import Process from './Process/Process';
import Passed from './Passed/Passed';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ClassQuizzes = ({classroom}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className='Quiz-main-div'>
      <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Schedule" {...a11yProps(0)} />
          <Tab label="Progress" {...a11yProps(1)} />
          <Tab label="Paased" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Schedule classroom={classroom}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Process/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Passed/>
      </TabPanel>
    </Box>


    </div>
  )
}

export default ClassQuizzes