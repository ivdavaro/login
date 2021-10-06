import React, {useState} from 'react'
import { auth, db } from '../firebase'
import { withRouter } from 'react-router-dom' 

const Registro = (props) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errForm, setErrForm] = useState(null)
    const [registro, setRegistro] = useState(true)
    
    const enviarDatos = (e)=>{
        e.preventDefault()
        if(!email.trim() || !password.trim()){
            setErrForm('Datos vacíos')
            return
        }
        if(password.length < 6){
            setErrForm('La contraseña debe ser de 6 o más caracteres')
            return
        }

        if(registro){
            registrarUsuario()
        }else{
            login()
        }
    }

    const login = React.useCallback(
        async () => {
            try {
                await auth.signInWithEmailAndPassword(email,password)
                console.log("Login exitoso");
                props.history.push('/privado')
            } catch (error) {
                console.log(error);
                if(error.code === 'auth/wrong-password'){
                    setErrForm("Password incorrecto")
                }
                if(error.code === 'auth/user-not-found'){
                    setErrForm("Usuario no encontrado")
                }
            }
        }, [email,password, props]
    )

    const registrarUsuario = React.useCallback(
        async () => {
            try {
                const res = await auth.createUserWithEmailAndPassword(email,password)
                await db.collection('usuarios').doc(res.user.uid).set(
                    {
                        email: email,
                        password: password,
                    }
                )
                setEmail("")
                setPassword("")
                setErrForm(null)
            } catch (error) {
                console.log(error);
                if(error.code === "aut/email-already-in-use"){
                    setErrForm("El email ya se encuentra registrado")
                }
                if(error.code === "aut/invalid-email"){
                    setErrForm("Email incorrecto")
                }
            }
        },[ email, password ]
    )

    return (
        <div className="mt-5">
            <h2 className="text-center"> 

                {
                    registro ? 'Registro de usuarios' : 'Login'
                }

            </h2>
            <hr/>
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                <form onSubmit={enviarDatos}>
                    <input type="email" className="form-control mb-2" placeholder="Correo electrónico" 
                    onChange={e=> setEmail(e.target.value)} value={email}
                    />
                    <input type="password" className="form-control mb-2" placeholder="Contraseña"
                        onChange={e=> setPassword(e.target.value)} value={password}
                    />
                    <button className="btn col-12 btn-primary mb-2" type="submit">
                        {
                            registro ? 'Registrar':'Login'
                        }
                    </button>
                    <button className="btn btn-warning col-12" type="button" onClick={ () => setRegistro(!registro)}>
                        {
                            registro ? '¿Ya tienes cuenta?' : 'Regístrate aquí '
                        }
                    </button>
                    {
                        errForm ? (
                            <div className="alert alert-danger mt-2">{errForm}</div>
                        ): null
                    }
                </form>
                </div>
            </div>            
        </div>
    )
}

export default withRouter( Registro )
