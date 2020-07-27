import React, { useState, useEffect } from 'react';
import {
   CircularProgress,
   Typography,
   Button,
   TextField,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
   useHistory
} from 'react-router-dom';
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
   },
   inputs: {
      width: '35vw',
      marginBottom: '30px'
   }
});

const CategoryArticlesList = (props) => {
   const history = useHistory();
   const classes = useStyles();
   const [articles, setArticles] = useState([]);
   const [categoryName, setCategoryName] = useState('');
   const [loading, setLoading] = useState(true);
   const [open, setOpen] = React.useState(false);
   const { categoryId } = props.match.params;
   const [newArticleTitle, setNewArticleTitle] = React.useState('');
   const [newArticleContent, setNewArticleContent] = React.useState('');
   const [newArticleTags, setNewArticleTags] = React.useState('');

   useEffect(() => {
      // Fill articles state
      const loadArticlesForCategory = async () => {
         const category = await axios.get(
            `${backendUrl}/categories/${categoryId}`
         );
         setCategoryName(category.data.title);

         let articlesByCategory = await axios.get(
            `${backendUrl}/articles/categorie/${categoryId}`
         );
         articlesByCategory = articlesByCategory.data;
         const allCategories = await axios.get(`${backendUrl}/categories`);
         console.log(allCategories);

         setArticles(articlesByCategory);
         setLoading(false);
      };

      loadArticlesForCategory();
   }, []);

   const handleOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const onCreateArticle = async () => {
      setLoading(true);
      await axios.post(`${backendUrl}/articles`, {
         title: newArticleTitle,
         content: newArticleContent,
         categorie: categoryId,
         tags: newArticleTags.split(',')
      });
      handleClose();
      history.go();
   };

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
            {`Les articles de la catégorie ${categoryName}`}
         </Typography>
         <Button onClick={handleOpen} size="small" color="primary">
         Créer un article
         </Button>
         <div className={classes.categoryContainer}>
            {articles.map((article) => (
               <div key={article._id}>
                  <ArticleCard title={article.title} id={article._id} />
               </div>
            ))}
         </div>
         <div>
            <Dialog open={open}>
               <DialogTitle id="alert-dialog-title">Créer un article</DialogTitle>
               <DialogContent>
                  <form
                     action="/"
                     method="POST"
                     onSubmit={(e) => {
                        e.preventDefault();
                        alert('Submitted form!');
                        handleClose();
                     }}
                  >
                     <div className={classes.inputs}>
                        <TextField
                           required
                           id="filled-required"
                           label="Titre"
                           variant="filled"
                           fullWidth
                           value={newArticleTitle}
                           onChange={(event) => setNewArticleTitle(event.target.value)}
                        />
                     </div>
                     <div className={classes.inputs}>
                        <TextField
                           required
                           id="filled-required"
                           label="Contenu"
                           variant="filled"
                           fullWidth
                           value={newArticleContent}
                           onChange={(event) => setNewArticleContent(event.target.value)}
                        />
                     </div>
                     <div className={classes.inputs}>
                        <TextField
                           required
                           id="filled-required"
                           label="Tags"
                           variant="filled"
                           fullWidth
                           value={newArticleTags}
                           onChange={(event) => setNewArticleTags(event.target.value)}
                           helperText="Séparé par des virgules"
                        />
                     </div>
                  </form>
               </DialogContent>
               <DialogActions>
                  <Button onClick={onCreateArticle} color="primary" type="submit">
               Créer
                  </Button>
                  <Button onClick={handleClose} color="primary" autoFocus>
               Annuler
                  </Button>
               </DialogActions>
            </Dialog>
         </div>
      </div>
   );
};

export default CategoryArticlesList;
