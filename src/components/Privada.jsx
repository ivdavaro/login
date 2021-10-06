import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { auth } from '../firebase'

const Privada = (props) => {

    const [usuario, setUsuario] = useState(null)

    React.useEffect(

            () =>{
                if (auth.currentUser) {
                    console.log('Existe usuario');
                    setUsuario(auth.currentUser)
                } else {
                    console.log('No existe usuario');
                    props.history.push('/login')
                }

            }, [props.history]

    )

    return (
        <div>
            <h1>Zona privada</h1>
            <h1>
            {
                usuario && (
                    <h1> {usuario.email}</h1>
                )
            }
            </h1>
        </div>
    )
}

export default withRouter ( Privada )
