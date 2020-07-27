import 'fontsource-roboto';
import './App.css';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import CategoryArticlesList from './screens/CategoryArticlesList';
import ArticleScreen from './screens/ArticleScreen';
import EditArticleScreen from './screens/EditArticleScreen';

const App = () => (
   <BrowserRouter>
      <Switch>
         <Route exact path="/" component={HomeScreen} />
         <Route
            path="/articles/by-category/:categoryId"
            component={CategoryArticlesList}
         />
         <Route path="/articles/edit/:articleId" component={EditArticleScreen} />
         <Route path="/articles/:articleId" component={ArticleScreen} />
      </Switch>
   </BrowserRouter>
);

export default App;
