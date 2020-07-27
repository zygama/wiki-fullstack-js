import React, { useState, useEffect } from 'react';
import {
   CircularProgress,
   Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import { backendUrl } from '../utils';

const useStyles = makeStyles({
   root: {
      backgroundColor: '#999',
      height: '100vh',
      padding: '50px',
   },
   categoryContainer: {
      margin: '50px auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: '20px 20px',
   }
});

const CategoryArticlesList = (props) => {
   const classes = useStyles();
   const [articles, setArticles] = useState([]);
   const [loading, setLoading] = useState(true);
   const { searchInput, searchMode } = props.location;

   useEffect(() => {
      // Fill articles state
      const loadArticlesForCategory = async () => {
         let resultSearch = [];

         console.log(props);

         if (searchMode === 'tag') {
            resultSearch = await axios.get(
               `${backendUrl}/articles/tag/${searchInput}`
            );
            resultSearch = resultSearch.data;
            console.log(resultSearch);
         } else { // tag
            resultSearch = await axios.get(
               `${backendUrl}/articles/title/${searchInput}`
            );
            resultSearch = resultSearch.data;
            console.log(resultSearch);
         }

         console.log(resultSearch);
         setArticles(resultSearch);
         setLoading(false);
      };

      loadArticlesForCategory();
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
         <SearchBar />
         <Typography variant="h2" component="h2" gutterBottom>
            {`Résultat de la recherche par ${searchMode} pour ${searchInput}`}
         </Typography>
         <div className={classes.categoryContainer}>
            {articles.map((article) => (
               <div key={article._id}>
                  <ArticleCard title={article.title} id={article._id} />
               </div>
            ))}
         </div>
      </div>
   );
};

export default CategoryArticlesList;
