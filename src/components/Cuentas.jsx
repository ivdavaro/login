import React, { useEffect, useState } from "react";
import { db } from "../firebase"

const Cuentas = () => {

    const COLLECTION_DB = "cuentas"
    const [cuentas, setCuentas] = useState([]);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [errNombre, setErrNombre] = useState("");
    const [errDescripcion, setErrDescripcion] = useState("");

    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState("");

    useEffect(() => {
        const obtenerCuentas = async () => {
            try {
                const data = await db.collection(COLLECTION_DB).get();
                const arrayCuentas = data.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCuentas(arrayCuentas);
            } catch (error) {
                console.log(error);
            }
        };

        obtenerCuentas();
    }, []);

    const agregarCuenta = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setErrNombre("El campo nombre de la cuenta no puede estar vacio");
        } else if (!descripcion.trim()) {
            setErrDescripcion("El campo descripcion no puede estar vacio");
        } else {

            try {
                const ctas = {
                    nombre: nombre,
                    descripcion: descripcion,
                };

                const datos = await db.collection("cuentas").add(ctas);

                setCuentas([
                    ...cuentas,
                    {
                        id: datos.id,
                        ...ctas,
                    },
                ]);
            } catch (error) {
                console.log(error);
            }

            setNombre("");
            setDescripcion("");
        }
    };

    const eliminarCuenta = async (id) => {
        try {
            await db.collection(COLLECTION_DB).doc(id).delete();
            const filtroArray = cuentas.filter((item) => item.id !== id);
            setCuentas(filtroArray);
        } catch (error) {
            console.log(error);
        }
    };

    const editarCuenta = (item) => {
        setModoEdicion(true);
        setId(item.id);
        setNombre(item.nombre);
        setDescripcion(item.descripcion);
    };

    const actualizarCuenta = async (e) => {
        e.preventDefault();
        try {
            const cta = {
                nombre: nombre,
                descripcion: descripcion,
            };

            await db.collection(COLLECTION_DB).doc(id).update(cta);

            const filtro = cuentas.map((item) =>
                item.id === id
                    ? { id: item.id, nombre: nombre, descripcion: descripcion }
                    : item
            );

            setCuentas(filtro);

            setModoEdicion(false);
            setNombre("");
            setDescripcion("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-4">
                    <h1>{!modoEdicion ? 'Agregar Cuenta' : 'Modificar Cuenta'}</h1>
                    <form onSubmit={modoEdicion ? actualizarCuenta : agregarCuenta}>
                        <div className="form-group">
                            <label>Nombre :</label>
                            <input
                                type="text"
                                placeholder="Nombre de la cuenta"
                                className="form-control mb-2"
                                onChange={(e) => setNombre(e.target.value)}
                                value={nombre}
                            />
                            {errNombre ? (
                                <small className="text-danger">{errNombre}</small>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label>Descripción:</label>
                            <input
                                type="text"
                                placeholder="Descripción de la cuenta"
                                className="form-control mb-2"
                                onChange={(e) => setDescripcion(e.target.value)}
                                value={descripcion}
                            />
                            {errDescripcion ? (
                                <small className="text-danger">{errDescripcion}</small>
                            ) : null}
                        </div>
                        <button type="submit" className="btn btn-dark">
                            {" "}
                            {modoEdicion ? "Actualizar" : "Enviar"}{" "}
                        </button>
                    </form>
                </div>
                <div className="col-sm-8">
                    <h1>Lista de cuentas</h1>

                    <div className="container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cuentas.length === 0 ? (
                                    <thead className="list-group-item">Sin cuentas</thead>
                                ) : (
                                    cuentas.map((item) => (
                                        <tr
                                            className="animate__animated animate__bounceInDown"
                                            key={item.id}
                                        >
                                            <td>{item.nombre}</td>
                                            <td>{item.descripcion}</td>

                                            <td>
                                                <div align="right">
                                                    <button
                                                        className="btn btn-sm btn-success mx-2"
                                                        onClick={() => editarCuenta(item)}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-edit"></i>{" "}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => eliminarCuenta(item.id)}
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

export default Cuentas