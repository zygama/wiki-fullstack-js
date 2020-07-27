import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import CardArticleCategory from '../components/CardArticleCategory';
import { backendUrl } from '../utils';

const useStyles = makeStyles({
   root: {
      backgroundColor: '#999',
      height: '100vh',
      padding: '50px'
   },
   categoryContainer: {
      margin: '50px auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: '20px 20px'
   }
});

const HomeScreen = () => {
   const classes = useStyles();
   const [articlesCategories, setArticlesCategories] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const getArticlesCategories = async () => {
         let categories = await axios.get(`${backendUrl}/categories`);
         categories = categories.data;
         console.log(categories);

         setArticlesCategories(categories);
         setLoading(false);
      };

      getArticlesCategories();
   }, []);

   if (loading) {
      return (
         <div className={classes.root}>
            <CircularProgress />
         </div>
      );
   }
   return (
      <div className={classes.root}>
         <Typography variant="h2" component="h2" gutterBottom>
         Les catégories
         </Typography>
         <div className={classes.categoryContainer}>
            {articlesCategories.map((category) => (
               <div key={category._id}>
                  <CardArticleCategory
                     categoryName={category.title}
                     id={category._id}
                  />
               </div>
            ))}
         </div>
      </div>
   );
};

export default HomeScreen;
