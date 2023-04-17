import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function MultiActionAreaCard(props) {

  const handleDelete = async() => {
    try{
   
        const response = await axios.get(`${process.env.REACT_APP_URI}delete_article/${props.article.title}`);
        
        props.setToggle(!props.toggle);
        } catch (err){
          console.log(err);
        }

  }
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={props.article.image_url}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.article.category.map((categories) => (<Chip key={categories}style={{marginRight:"7px",marginBottom:"5px"}}label={categories} />))}
          
          </Typography>
          <Typography variant="body2" color="text.secondary">
           <b>{props.article.title}</b>
          </Typography>
        </CardContent>
        <Typography variant="body2" style={{display:"flex",justifyContent:"end",marginRight:"10px"}}color="text.secondary">
           {props.article.publish_date}
          </Typography>
      </CardActionArea>
      <Divider></Divider>
      <CardActions>
        <Link to={`/article/${props.article.title}`}> <Button size="small" color="primary" >
          Learn More
        </Button></Link>
      
        <Button size="small" color="primary" onClick={handleDelete}>
         Delete
        </Button>
      </CardActions>
    </Card>
  );
}