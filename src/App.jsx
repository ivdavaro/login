import "./App.css"
import React, { useState, useEffect } from "react"

import {
  BrowserRouter as Router,  
  Switch,
  Route 
} from 'react-router-dom'
import Menu from "./components/Menu";
import Registro from "./components/Registro";
import Privada from "./components/Privada";
import {auth} from "./firebase"


function App() {

  const [user, setUser] = useState(false)

  useEffect(
    () => {
      auth.onAuthStateChanged(
        user => {
          if(user){
            setUser(user)
          }else{
            setUser(null)
          }
        }
      )
  }, [])

  return user !== false ? (



    <Router>
      <div>
        <Menu usuario = {user}/>


        <Switch>

          <Route path="/login">
            <Registro/>
          </Route>

          <Route path="/privado">
            <Privada/>
          </Route>

          <Route path="/">
            Inicio
          </Route>

        </Switch>
      </div>
    </Router>    
  ) : (
    <div>
      Cargando...
    </div>
  )
  

}

export default App;
