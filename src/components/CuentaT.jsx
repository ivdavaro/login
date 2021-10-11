import React, { useEffect, useState } from "react";
import { db } from "../firebase"

const CuentaT = () => {

    const COLLECTION_DB = "cuentaT"
    const COLLECTION_DB_CATEGORIAS = "categorias"
    const COLLECTION_DB_CUENTAS = "cuentas"

    const [cuentaT, setCuentaT] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cuentas, setCuentas] = useState([]);

    const [cuenta, setCuenta] = useState("");
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [debe, setDebe] = useState("");
    const [haber, setHaber] = useState("");
    const [valor, setValor] = useState("");
    const [diferencia, setDiferencia] = useState("");
    const [saldo, setSaldo] = useState("");

    const [errCuenta, setErrCuenta] = useState("");
    const [errFecha, setErrFecha] = useState("");
    const [errDescripcion, setErrDescripcion] = useState("");
    const [errDebe, setErrDebe] = useState("");
    const [errHaber, setErrHaber] = useState("");
    const [errValor, setErrValor] = useState("");
    const [errDiferencia, setErrDiferencia] = useState("");
    const [errSaldo, setErrSaldo] = useState("");

    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState("");

    useEffect(() => {
        obtenerCategorias();
        obtenerCuentas();
    }, []);
    const obtenerCategorias = async () => {
        try {
            const data = await db.collection(COLLECTION_DB_CATEGORIAS).get();
            const arrayCategorias = data.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategorias(arrayCategorias);
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerCuentaT = async () => {
        try {
            const data = await db.collection(COLLECTION_DB).get();
            const arrayCuentaT = data.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCuentaT(arrayCuentaT);
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerCuentas = async () => {
        try {
            const data = await db.collection(COLLECTION_DB_CUENTAS).get();
            const arrayCuentas = data.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCuentas(arrayCuentas);
        } catch (error) {
            console.log(error);
        }
    };

    const agregarRegistro = async (e) => {
        e.preventDefault();

        if (!cuenta.trim()) {
            setErrNombre("El campo nombre de la cuenta no puede estar vacio");
        } else if (!fecha.trim()) {
            setErrDescripcion("El campo descripcion no puede estar vacio");
        } else if (!descripcion.trim() == '-1' ) {
            setErrTipoCategoria("Debe seleccionar el tipo de categoría");
        } else {

            try {
                const ctas = {
                    nombre: cuenta,
                    descripcion: fecha,
                    tipoCategoria: descripcion
                };

                const datos = await db.collection(COLLECTION_DB).add(ctas);

                setCuentaT([
                    ...cuentaT,
                    {
                        id: datos.id,
                        ...ctas,
                    },
                ]);
            } catch (error) {
                console.log(error);
            }

            setCuenta("");
            setFecha("");
            setDescripcion('-1')
        }
    };

    const eliminarRegistro = async (id) => {
        try {
            await db.collection(COLLECTION_DB).doc(id).delete();
            const filtroArray = cuentaT.filter((item) => item.id !== id);
            setCuentaT(filtroArray);
        } catch (error) {
            console.log(error);
        }
    };

    const editarRegistro = (item) => {
        setModoEdicion(true)
        setId(item.id)
        setCuenta(item.nombre)
        setFecha(item.descripcion)
        setDescripcion(item.tipoCategoria)
    };

    const actualizarRegistro = async (e) => {
        e.preventDefault();
        try {
            const cta = {
                nombre: cuenta,
                descripcion: fecha,
            };

            await db.collection(COLLECTION_DB).doc(id).update(cta);

            const filtro = cuentaT.map((item) =>
                item.id === id
                    ? { id: item.id, nombre: cuenta, descripcion: fecha, tipoCategoria: descripcion}
                    : item
            );

            setCuentaT(filtro);

            setModoEdicion(false);
            setCuenta("");
            setFecha("");
            setDescripcion('-1');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-4">
                    <h1>{!modoEdicion ? 'Agregar Categoría' : 'Modificar Categoría'}</h1>
                    <form onSubmit={modoEdicion ? actualizarRegistro : agregarRegistro}>
                        <div className="form-group">
                            <label>Cuenta :</label>                            
                            <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={(e) => setCuenta(e.target.value)}>
                            
                            {
                                cuentas.length === 0 ? 
                                (<option selected>No hay cuentas</option>):
                                (
                                    cuentas.map(
                                        (item) => (
                                            <option value={item.id}>{item.nombre}</option>
                                        )

                                    )

                                )
                            }
                            </select>
                            {errCuenta ? (
                                <small className="text-danger">{errCuenta}</small>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label>Descripción:</label>
                            <input
                                type="text"
                                placeholder="Descripción"
                                className="form-control mb-2"
                                onChange={(e) => setFecha(e.target.value)}
                                value={fecha}
                            />
                            {errDescripcion ? (
                                <small className="text-danger">{errDescripcion}</small>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label>Tipo Categoría:</label>                            
                            <select class="form-control mb-2" aria-label=".form-select-sm example" onChange={(e) => setDescripcion(e.target.value)}>
                                <option selected value="-1">Seleccione...</option>
                                <option value="INGRESO">Ingreso</option>
                                <option value="SALIDA">Salida</option>
                            </select>

                            {errDescripcion ? (
                                <small className="text-danger">{errTipoCategoria}</small>
                            ) : null}
                        </div>
                        <button type="submit" className="btn btn-dark">
                            {" "}
                            {modoEdicion ? "Actualizar" : "Enviar"}{" "}
                        </button>
                    </form>
                </div>
                <div className="col-sm-8">
                    <h1>Lista de Categorías</h1>

                    <div className="container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Tipo de categoría</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cuentaT.length === 0 ? (
                                    <thead className="list-group-item">Sin categorias</thead>
                                ) : (
                                    cuentaT.map((item) => (
                                        <tr
                                            className="animate__animated animate__bounceInDown"
                                            key={item.id}
                                        >
                                            <td>{item.nombre}</td>
                                            <td>{item.descripcion}</td>
                                            <td>{item.tipoCategoria}</td>

                                            <td>
                                                <div align="right">
                                                    <button
                                                        className="btn btn-sm btn-success mx-2"
                                                        onClick={() => editarRegistro(item)}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-edit"></i>{" "}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => eliminarRegistro(item.id)}
                                                    >
                                                        {" "}
                                                        <i className="fa fa-remove"></i>{" "}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CuentaT