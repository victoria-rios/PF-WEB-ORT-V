import React from 'react';

import axios from 'axios';

 class VerAbogado extends React.Component { //asi no es necesario poner el export default al final

    constructor(props){
    
        super(props);

    this.state = {  //esto era this.state
        'abogado' : []
}
}

componentDidMount(){
    this.getItems()
}

getItems() {
  axios.get('http://localhost:5000/api/user/5ecae460343fbd4dd0acd4f8') //acá tengo que poder pasarle el Id como data append, ver luego, pasarle con this.state 

    .then( res =>  {
        const abogado_ = res.data;
        //console.log(res);
        this.setState({'abogado': abogado_}); //Esto no sé si lo está haciendo, y me rompe al renderizar
        console.log(this.state);
     })

     .catch(error => {
         console.log(error)
         })

/*.fetch('http://localhost:5000/api/user/5ecae460343fbd4dd0acd4f8')
.then(results => results.json())
.then(result => this.setState('abogado': results))*/



}

render () {

    return (
    <div> 
     
}


})

</div>
    ) //fin return render
} //fin render
} //fin clase

/*
{this.state.abogado.map(function(item,index){
            return <h1>{abogado.especialidad}</h1>
        }
        )} */


export default VerAbogado;