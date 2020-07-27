import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
   CircularProgress,
   Button,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import { backendUrl } from '../utils';

const useStyles = makeStyles((theme) => ({
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
   buttons: {
      float: 'right',
   },
   content: {
      marginTop: '70px',
      fontFamily: 'Roboto',
   },
   articleTitle: {
      marginBottom: '30px',
   }
}));

const ArticleScreen = (props) => {
   const history = useHistory();
   const classes = useStyles();
   const [article, setArticle] = useState({});
   const [loading, setLoading] = useState(true);
   const [open, setOpen] = React.useState(false);
   const { articleId } = props.match.params;

   useEffect(() => {
      const getArticle = async () => {
         let art = await axios.get(`${backendUrl}/articles/${articleId}`);
         art = art.data;

         setArticle(art);
         setLoading(false);
      };

      getArticle();
   }, []);

   const handleOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const handleDeleteArticle = async () => {
      await axios.delete(`${backendUrl}/articles/${articleId}`);
      history.replace('/');
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
         <div className={classes.buttons}>
            <Button
               onClick={() => {
                  history.push(`/articles/edit/${articleId}`);
               }}
               size="small"
               color="primary"
            >
               Modifier
            </Button>
            <Button onClick={handleOpen} size="small" color="secondary">
               Supprimer
            </Button>
         </div>
         <div className={classes.content}>
            {article.tags.map(tag => <Chip style={{ marginRight: '5px', marginBottom: '15px' }} label={tag} />)}
            <h2 className={classes.articleTitle}>{article.title}</h2>
            <p>{article.content}</p>
         </div>

         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title">
           Voulez-vous vraiment supprimer l&apos;article ?
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Voulez-vous vraiment supprimer l&apos;article ?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleDeleteArticle} color="primary">
                  Oui
               </Button>
               <Button onClick={handleClose} color="primary" autoFocus>
                  Non
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default ArticleScreen;
