import React from "react";
import{useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';

const Article = () => {
  
  const titleTest = "Fighting between Sudan military rivals enters a second day, with dozens dead"
  const original_text = " Fierce fighting across Sudan entered a second day as months of tensions between a paramilitary group and the country’s army erupted into violence. Clashes around the army headquarters and presidential palace in capital Khartoum involved heavy weapons. There have also been reports of battles hundreds of miles away in the eastern city of Port Sudan and in the western Darfur region."
  const publish_date = "April 14, 2023"
  const author = "ABC John"
  const image_url = "https://media.cnn.com/api/v1/images/stellar/prod/230415120804-04-sudan-unrest-0415.jpg?c=16x9&q=h_720,w_1280,c_fill/f_webp"
  
  const [article, setArticle] = useState(Object);
  const {title} = useParams();
 
  const styles = {
  articleContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "16px",
  },
  articleImage: {
    maxWidth: "100%",
    height: "auto",
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
const getArticle = async () =>{

  try{
   
      const response = await axios.get(`${process.env.REACT_APP_URI}get_article/${title}`)
      
      setArticle(response.data)
      } catch (err){
        console.log(err);
      }
}

useEffect( () => {
 getArticle();
}, []);


  return (
    <div style={styles.articleContainer}>
      <img src={article?.image_url} alt={article?.title} style={styles.articleImage} />
      <h1 style={styles.articleTitle}>{article?.title}</h1>
      <p style={styles.articleDate}>Date Published: {article?.publish_date}</p>
      <p style={styles.articleDate}>Author: {article?.author}</p>
      <p style={styles.articleContent}>{article?.original_text}</p>
    </div>
  );
};


export default Article;