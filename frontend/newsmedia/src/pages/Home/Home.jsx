import {useState,useEffect} from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Card from '../../components/Cards/Cards';
import Typography from '@mui/material/Typography';

const Home = (props) =>{
    
  const [articles, setArticles] = useState([]);
  const BASE = process.env.REACT_APP_URI;

  const getArticles = async () =>{

    try{
        const response = await axios.get(`${BASE}/index`);
        
        setArticles(response.data)
        } catch (err){
          console.log(err);
        }
  }
 
  useEffect( () => {
   getArticles();
  }, [props.toggle]);

  return (
    <div style ={{marginTop: "50px"}}>
         <Typography variant="h3" gutterBottom style={{display:"flex",justifyContent:"center",marginBottom:"50px"}}>
        Trending Now
      </Typography>
      <Container maxWidth="xl" style ={{marginTop: "50 px"}}>
      <Grid container columnSpacing={4}  rowSpacing={4}>
      {articles.map(article => (
      <Grid key= {article.title}item xs={12} sm ={6} md = {4} lg ={3} xl = {3}>
        <Card toggle={props.toggle} setToggle={props.setToggle} article={article}></Card>
    
  </Grid>))}

      </Grid>
     
    
      </Container >
      
    </div>
  );
   
}
export default Home;