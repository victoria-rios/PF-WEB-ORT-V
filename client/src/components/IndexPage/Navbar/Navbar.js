import React from 'react';
import {Link} from  'react-router-dom'

class Navbar extends React.Component {

    render (){
        return (

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
              <Link to="/"><a class="nav-item nav-link active">Home <span class="sr-only">(current)</span></a></Link>
              <Link to="/Signin"><a class="nav-item nav-link">Login</a></Link>
              <Link to="/Signup"><a class="nav-item nav-link">Registrarse</a></Link>
            <a class="nav-item nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </div>
        </div>
      </nav>  
        
      );
    }
  }

  export default Navbar;
