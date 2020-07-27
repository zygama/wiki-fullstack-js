import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
   CircularProgress,
   Typography,
   Button,
   Modal,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   TextField,
   FormControl,
   FormLabel,
   RadioGroup,
   FormControlLabel,
   Radio,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
   root: {
      backgroundColor: '#999',
      height: '100vh',
      padding: '50px',
   }
});

const SearchBar = () => {
   const history = useHistory();
   const [searchInput, setSearchInput] = useState('');
   const [searchMode, setSearchMode] = useState('titre');

   const handleSearch = async () => {
      // Get results
      history.push({
         pathname: `/articles/search/${searchInput}`,
         searchMode,
         searchInput
      });
   };

   return (
      <div style={{
         display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'
      }}
      >
         <TextField
            style={{ width: '30vw' }}
            id="filled-basic"
            label="Recherche"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
         />
         <FormControl component="fieldset">
            <RadioGroup
               row
               aria-label="gender"
               name="gender1"
               value={searchMode}
               onChange={(event) => setSearchMode(event.target.value)}
            >
               <FormControlLabel value="tag" control={<Radio />} label="Tag" />
               <FormControlLabel value="titre" control={<Radio />} label="Titre" />
            </RadioGroup>
         </FormControl>

         <Button color="primary" onClick={handleSearch}>
         Rechercher
         </Button>
      </div>
   );
};

export default SearchBar;
