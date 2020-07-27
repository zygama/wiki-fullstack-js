import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
   Card,
   CardContent,
   Typography,
   CardActions,
   Button,
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

const ArticleCard = (props) => {
   const history = useHistory();
   const classes = useStyles();

   return (
      <Card className={classes.root}>
         <CardContent>
            <Typography variant="h5" component="h2">
               {props.title}
            </Typography>
         </CardContent>
         <CardActions>
            <Button
               onClick={() => {
                  history.push(`/articles/${props.id}`);
               }}
               size="small"
            >
               Voir l&apos;article
            </Button>
         </CardActions>
      </Card>
   );
};

export default ArticleCard;
