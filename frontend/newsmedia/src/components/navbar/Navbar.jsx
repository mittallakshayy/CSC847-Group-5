import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Dropdown from '../dropdown/dropdown';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';



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

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

export default function SearchAppBar(props) {
    const [open, setOpen] = React.useState(false);
    const [language, setLanguage]=  React.useState('');
    const [url, setUrl]= React.useState('');

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    }
    const handleSubmit = async () => {
        try{  handleOpen();
            const form = new FormData();
            form.append('url', url);
            form.append('language', language);
            console.log(url);
            console.log(language);
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_URI}/upload`,
                data: form,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
                },
            });
            handleClose();
            props.setToggle(!props.toggle);
            setLanguage('');
            setUrl('');
    }catch(err){
        console.log(err);
    }
      
    } 

    const handleChange = (e) => {
    setUrl(e.target.value);
    
    }
    const handleClose = () => {
      setOpen(false);
    };
    const handleOpen = () => {
      setOpen(true);
    };
  return (
    <Box  sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <NewspaperIcon></NewspaperIcon>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
             NewsMedia
          </Typography>
          <Dropdown setLanguage={setLanguage} language={language}></Dropdown>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Enter URL"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleUrlChange}
            />
          </Search>
          <Button variant="outlined" onClick ={handleSubmit} style= {{color:"white"}}>Search</Button>
          <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        </Toolbar>
      </AppBar>
    </Box>
  );
}