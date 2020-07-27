import React, { useState, useEffect } from 'react';
import {
   useHistory,
   BrowserRouter as Router, Switch, Route, Link
} from 'react-router-dom';
import {
   CircularProgress,
   Typography,
   Button,
   Modal,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import CardArticleCategory from '../components/CardArticleCategory';
import CategoryArticlesList from './CategoryArticlesList';
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
   },
   paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
   },
}));

function rand() {
   return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
   const top = 50 + rand();
   const left = 50 + rand();

   return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
   };
}

const ArticleScreen = (props) => {
   const history = useHistory();
   const classes = useStyles();
   const [article, setArticle] = useState({});
   const [loading, setLoading] = useState(true);
   const [open, setOpen] = React.useState(false);
   const [modalStyle] = useState(getModalStyle);
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

   if (loading) return <CircularProgress />;
   return (
      <div className={classes.root}>
         <div className={classes.buttons}>
            <Button
               onClick={() => {
                  history.push(`/articles/${props.id}`);
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
             Let Google help apps determine location. This means sending
             anonymous location data to Google, even when no apps are running.
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

         {/* <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
         >
            <div style={modalStyle} className={classes.paper}>
               <h2 id="simple-modal-title">Text in a modal</h2>
               <p id="simple-modal-description">
             Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
               </p>
            </div>
         </Modal> */}
      </div>
   );
};

export default ArticleScreen;
