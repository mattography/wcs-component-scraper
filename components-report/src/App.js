import React,{useState,useEffect} from 'react';

//Pillar Imports
import AggregateComponents from './AggregateComponents';
import AppsPillars from './AppsPillars';
import Industries from './Industries';
import OCI from './OCI';
import CloudHWSW from './CloudHWSW';
import Corporate from './Corporate';
import Events from './Events';
import OTN from './OTN';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';


import Box from '@mui/material/Box';
import WarningAmber from '@mui/icons-material/WarningAmber';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ListIcon from '@mui/icons-material/List';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

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

function App(props) {
  const [searchFilter, setFilter] = useState('');
  const [value, setValue] = useState(0);
  const [a11yType, setA11yType] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setA11yType('');
    setFilter('');
  };

  const clearSearch = () => {
    //clear search field and reset focus to input
    setFilter('');
    document.querySelector('input#search').focus();
  }

  function a11yProps(index) {
    return {
      id: `wcs-components-tab-${index}`,
      'aria-controls': `wcs-components-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <AppBar position="fixed" style={{backgroundColor: "#000"}}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{fontFamily: 'Oracle Sans'}}
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Web Content Standards Components
          </Typography>
          <span>Filter by a11y type:</span>
          <ButtonGroup variant="solid" aria-label="outlined button group">
            <Tooltip title="Show All">
              <Button onClick={() => setA11yType('')}><ListIcon/></Button>
            </Tooltip>
            <Tooltip title="Ready">
              <Button onClick={() => setA11yType('a11y-ready')}><WarningAmber style={{color: '#D63B25'}}/></Button>
            </Tooltip>
            <Tooltip title="Unknown">
              <Button onClick={() => setA11yType('a11y-unknown')}><QuestionMarkIcon style={{color: '#e58e01'}}/></Button>
            </Tooltip>
            <Tooltip title="True">
              <Button onClick={() => setA11yType('a11y-true')}><CheckCircleOutline style={{color: '#009a09'}}/></Button>
            </Tooltip>
          </ButtonGroup>
          <Search>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setFilter(e.target.value)}
              value={searchFilter}
              id="search"
            />
            {searchFilter != '' && <Button onClick={() => clearSearch()}><ClearIcon style={{color: '#fff'}}/></Button>}
          </Search>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xlg" style={{position: 'relative', top: 70}}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="pillar-tabs" variant="scrollable">
              <Tab label="Aggregate Components" {...a11yProps(0)}/>
              <Tab label="Apps Pillars" {...a11yProps(1)}/>
              <Tab label="Industries" {...a11yProps(2)}/>
              <Tab label="OCI" {...a11yProps(3)}/>
              <Tab label="Cloud HW and SW" {...a11yProps(4)}/>
              <Tab label="Corporate" {...a11yProps(5)}/>
              <Tab label="Events" {...a11yProps(6)}/>
              <Tab label="OTN" {...a11yProps(7)}/>
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <AggregateComponents searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AppsPillars searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Industries searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <OCI searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <CloudHWSW searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <Corporate searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={6}>
            <Events searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
          <TabPanel value={value} index={7}>
            <OTN searchFilter={searchFilter} a11yType={a11yType}/>
          </TabPanel>
        </Box>
      </Container>
    </div>
  );
}

export default App;
