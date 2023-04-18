import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Dropdown from '../../components/dropdown/dropdown2';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


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
const AudioPlayer = ({ src,index,value }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      
      {value === index &&<audio controls src={src} autoPlay={false}></audio>}
    </div>
  );
};

const Article = () => {


  const [update, setUpdate] = useState(true);
  const [article, setArticle] = useState(Object);
  const { title } = useParams();
  const [value, setValue] = React.useState(0);
  const [language, setLanguage] = React.useState('');
  const styles = {
    articleContainer: {
      maxWidth: "90%",
      margin: "0 auto",
      padding: "16px",
    },
    articleImage: {
      maxWidth: "100%",
      height: "auto",
      marginLeft: "20%"
    },
    articleTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginTop: "16px",
    },
    articleContent: {
      marginTop: "8px",
    },
    articleDate: {
      marginTop: "8px",
      fontStyle: "italic",
      color: "#999",
    },
  };

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getArticle = async () => {

    try {

      const response = await axios.get(`${process.env.REACT_APP_URI}get_article/${title}`)
      setArticle(response.data)

    } catch (err) {
      console.log(err);
    }
  }
  const handleAddLanguage = async () => {
    try {
      const form = new FormData();
      form.append('title', article.title);
      form.append('language', language);
      console.log(language + article.title);
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_URI}add_language/`,
        data: form,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
        },
      });

      setUpdate(!update);
    } catch (err) {
      console.log(err);
    }
    
  }
  useEffect(() => {
    getArticle();
  }, [update, getArticle]);


  return (
    <div style={styles.articleContainer}>
      <img src={article?.image_url} alt={article?.title} style={styles.articleImage} />
      <h1 style={styles.articleTitle}>{article?.title}</h1>
      <p style={styles.articleDate}>Date Published: {article?.publish_date}</p>
      <p style={styles.articleDate}>Author: {article?.author}</p>
      <Stack direction="row" spacing={1}>
        <span><Dropdown setLanguage={setLanguage} language={language} article={article} style={{ display: "inline-block" }}></Dropdown></span>
        <span><Button onClick={handleAddLanguage} style={{ display: "inline-block" }} >
          <AddIcon ></AddIcon>
        </Button></span>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            {article.original_text !== undefined && <Tab value={0} label="English" {...a11yProps(0)} />}
            {article.translated_text_german !== undefined && <Tab value={1} label="German" {...a11yProps(1)} />}
            {article.translated_text_spanish !== undefined && <Tab value={2} label="Spanish" {...a11yProps(2)} />}
            {article.translated_text_french !== undefined && <Tab value={3} label="French" {...a11yProps(3)} />}
            {article.translated_text_italian !== undefined && <Tab value={4} label="Italian" {...a11yProps(4)} />}
            {article.translated_text_dutch !== undefined && <Tab value={5} label="Dutch" {...a11yProps(5)} />}
            {article.translated_text_portuguese !== undefined && <Tab value={6} label="Portuguese" {...a11yProps(6)} />}
            {article.translated_text_swedish !== undefined && <Tab value={7} label="Swedish" {...a11yProps(7)} />}
            {article.translated_text_danish !== undefined && <Tab value={8} label="Danish" {...a11yProps(8)} />}
            {article.translated_text_norwegian !== undefined && <Tab value={9} label="Norwegian" {...a11yProps(9)} />}
            {article.translated_text_finnish !== undefined && <Tab value={10} label="Finnish" {...a11yProps(10)} />}
            {article.translated_text_icelandic !== undefined && <Tab value={11} label="Icelandic" {...a11yProps(11)} />}

          </Tabs>
        </Box>

        {article.original_text && <div><br></br><TabPanel value={value} index={0}>{article.original_text}</TabPanel></div>}
        {article.translated_text_german !== undefined && <div><AudioPlayer value={value} index={1} src ={article.audio_url_german}/><TabPanel value={value} index={1}>{article.translated_text_german}</TabPanel></div>}
        {article.translated_text_spanish !== undefined && <div><AudioPlayer value={value} index={2} src ={article.audio_url_spanish}/><TabPanel value={value} index={2}>{article.translated_text_spanish}</TabPanel></div>}
        {article.translated_text_french !== undefined &&<div><AudioPlayer value={value} index={3} src ={article.audio_url_french}/><TabPanel value={value} index={3}>{article.translated_text_french}</TabPanel></div>}
        {article.translated_text_italian !== undefined && <div><AudioPlayer value={value} index={4} src ={article.audio_url_italian}/><TabPanel value={value} index={4}>{article.translated_text_italian}</TabPanel></div>}
        {article.translated_text_dutch !== undefined && <div><AudioPlayer value={value} index={5} src ={article.audio_url_dutch}/><TabPanel value={value} index={5}>{article.translated_text_dutch}</TabPanel></div>}
        {article.translated_text_portuguese !== undefined && <div><AudioPlayer value={value} index={6} src ={article.audio_url_portuguese}/><TabPanel value={value} index={6}>{article.translated_text_portuguese}</TabPanel></div>}
        {article.translated_text_swedish !== undefined && <div><AudioPlayer value={value} index={7} src ={article.audio_url_swedish}/><TabPanel value={value} index={7}>{article.translated_text_swedish}</TabPanel></div>}
        {article.translated_text_danish !== undefined && <div><AudioPlayer value={value} index={8} src ={article.audio_url_danish}/><TabPanel value={value} index={8}>{article.translated_text_danish}</TabPanel></div>}
        {article.translated_text_norwegian !== undefined && <div><AudioPlayer value={value} index={9} src ={article.audio_url_norwegian}/><TabPanel value={value} index={9}>{article.translated_text_norwegian}</TabPanel></div>}
        {article.translated_text_finnish !== undefined && <div><AudioPlayer value={value} index={10} src ={article.audio_url_finnish}/><TabPanel value={value} index={10}>{article.translated_text_finnish}</TabPanel></div>}
        {article.translated_text_icelandic !== undefined && <div><AudioPlayer value={value} index={11} src ={article.audio_url_icelandic}/><TabPanel value={value} index={11}>{article.translated_text_icelandic}</TabPanel></div> }



      </Box>
    </div>
  );
};


export default Article;