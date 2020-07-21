import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
   Card,
   CardContent,
   Typography,
   CardActions,
   Button
} from '@material-ui/core';

const useStyles = makeStyles({
   root: {
      minWidth: 275,
   },
   title: {
      fontSize: 14,
   },
   pos: {
      marginBottom: 12,
   },
});

const CardArticleCategory = (props) => {
   const classes = useStyles();

   return (
      <Card className={classes.root}>
         <CardContent>
            <Typography variant="h5" component="h2">
               {props.categoryName}
            </Typography>
         </CardContent>
         <CardActions>
            <Button onClick={() => { alert('clicked'); }} size="small">Voir les articles</Button>
         </CardActions>
      </Card>
   );
};

export default CardArticleCategory;
