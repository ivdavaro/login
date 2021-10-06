import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { auth } from '../firebase'


const Menu = (props) => {

    const cerrarSesion = () => {
        auth.signOut()
        .then(
            () => {
                props.history.push('/login')
            }
        )
    }

    return (
        <div className="navbar navbar-dark bg-dark">
            <Link to= "/" className="navbar-brand">
                Proyectos React
            </Link>
            <div>
                <div className="d-flex">
                    <NavLink className="btn btn-dark" to="/" exact>Inicio</NavLink>
                    {
                        props.usuario !== null ? (
                            <NavLink className="btn btn-dark" to="/privado">Privado</NavLink>
                        ): null
                    }
                    
                    {
                        props.usuario !== null ? (
                            <button className ="btn btn-warning" 
                                onClick={() => cerrarSesion()}
                            >Cerrar Sesión</button>
                        ): (
                            <NavLink className="btn btn-dark" to="/login">Login</NavLink>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter( Menu )
