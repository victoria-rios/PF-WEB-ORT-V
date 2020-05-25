import React from 'react';
import Signin from './components/IndexPage/Register/Signin';
import Signup from './components/IndexPage/Register/Signup';
import TerminarRegistro from './pages/TerminarRegistro';
import Home from './components/IndexPage/Home/Home';
import VerAbogado from './pages/VerAbogado';

//import UserProfile from './components/IndexPage/UserProfile.js';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class App extends React.Component {

render (){
    return (
      
   <div> <TerminarRegistro /> </div>

     /* <Router>

        <Switch>

        <Route exact path="/" component={Home} />
      
        <Route exact path="/Signup" component={Signup} />
      
        <Route exact path="/Signin" component={Signin} />


        </Switch>

      </Router>

      */
           ); 

         }
}


export default App;