import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

export default function MultiActionAreaCard(props) {
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
          <Chip label={props.article.category} />
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
        <Button size="small" color="primary">
          Learn More
        </Button>
        <Button size="small" color="primary">
         Delete
        </Button>
      </CardActions>
    </Card>
  );
}