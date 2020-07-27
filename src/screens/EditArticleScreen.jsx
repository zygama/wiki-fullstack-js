import React, { useState, useEffect } from 'react';
import {
   useHistory
} from 'react-router-dom';
import {
   CircularProgress,
   Button,
   TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import { backendUrl } from '../utils';

const useStyles = makeStyles({
   root: {
      backgroundColor: '#999',
      height: '100vh',
      padding: '50px',
      width: '100vw'
   },
   categoryContainer: {
      margin: '50px auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: '20px 20px',
   },
   content: {
      marginTop: '70px',
      fontFamily: 'Roboto',
   },
   articleTitle: {
      marginBottom: '30px',
   },
   inputs: {
      width: '35vw',
   },
});

const ArticleScreen = (props) => {
   const history = useHistory();
   const classes = useStyles();
   const [article, setArticle] = useState({});
   const [articleTags, setArticleTags] = useState({});
   const [articleTitle, setArticleTitle] = useState('');
   const [articleContent, setArticleContent] = useState('');
   const [articleVersions, setArticleVersions] = useState([]);
   const [versionArticle, setVersionArticle] = useState('');
   const [loading, setLoading] = useState(true);
   const { articleId } = props.match.params;

   useEffect(() => {
      const getArticle = async () => {
         let art = await axios.get(`${backendUrl}/articles/${articleId}`);
         art = art.data;

         setArticle(art);
         setArticleTitle(art.title);
         setArticleContent(art.content);
         setArticleTags(art.tags);
         setLoading(false);
      };

      getArticle();
   }, []);

   const handleCancel = () => {
      history.replace(`/articles/${articleId}`);
   };

   const handleUpdate = async () => {
      setLoading(true);
      await axios.post(`${backendUrl}/articles/update`, {
         title: articleTitle,
         content: articleContent,
         tags: articleTags.split(','),
         idArticleVersionned: article.idArticleVersionned,
         categorie: article.categorie
      });
      history.replace(`/articles/by-category/${article.categorie}`);
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
         <form noValidate autoComplete="off">
            <div className={classes.inputs}>
               <TextField
                  id="standard-basic"
                  label="Titre"
                  value={articleTitle}
                  fullWidth
                  onChange={(event) => setArticleTitle(event.target.value)}
               />
            </div>
            <div className={classes.inputs}>
               <TextField
                  id="filled-basic"
                  label="Contenu"
                  value={articleContent}
                  fullWidth
                  onChange={(event) => setArticleContent(event.target.value)}
               />
            </div>
            <div className={classes.inputs}>
               <TextField
                  id="outlined-basic"
                  label="Tags"
                  value={articleTags}
                  fullWidth
                  onChange={(event) => setArticleTags(event.target.value)}
                  helperText="Séparé par des virgules"
               />
            </div>
            {/* <Select
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={versionArticle}
               onChange={onClickVersionArticle}
            >
               {articleVersions.map((version, index) => {
                  if (index === articleVersions.length) {
                     return (
                        <MenuItem value={version}>Actuelle</MenuItem>
                     );
                  }
                  <MenuItem value={version}>{`v${index}`}</MenuItem>;
               })}
            </Select> */}
            <div>
               <Button onClick={handleCancel} color="primary">
             Annuler
               </Button>
               <Button onClick={handleUpdate} color="primary" autoFocus>
             Valider
               </Button>
            </div>
         </form>
      </div>
   );
};

export default ArticleScreen;
