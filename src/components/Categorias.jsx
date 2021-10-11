import React, { useEffect, useState } from "react";
import { db } from "../firebase"

const Categorias = () => {

    const COLLECTION_DB = "categorias"
    const [categorias, setCategorias] = useState([]);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipoCategoria, setTipoCategoria] = useState("");

    const [errNombre, setErrNombre] = useState("");
    const [errDescripcion, setErrDescripcion] = useState("");
    const [errTipoCategoria, setErrTipoCategoria] = useState("");

    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState("");

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const data = await db.collection(COLLECTION_DB).get();
                const arrayCategorias = data.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategorias(arrayCategorias);
            } catch (error) {
                console.log(error);
            }
        };

        obtenerCategorias();
    }, []);

    const agregarCuenta = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setErrNombre("El campo nombre de la cuenta no puede estar vacio");
        } else if (!descripcion.trim()) {
            setErrDescripcion("El campo descripcion no puede estar vacio");
        } else if (!tipoCategoria.trim() == '-1' ) {
            setErrTipoCategoria("Debe seleccionar el tipo de categoría");
        } else {

            try {
                const ctas = {
                    nombre: nombre,
                    descripcion: descripcion,
                    tipoCategoria: tipoCategoria
                };

                const datos = await db.collection(COLLECTION_DB).add(ctas);

                setCategorias([
                    ...categorias,
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
            setTipoCategoria('-1')
        }
    };

    const eliminarCategorias = async (id) => {
        try {
            await db.collection(COLLECTION_DB).doc(id).delete();
            const filtroArray = categorias.filter((item) => item.id !== id);
            setCategorias(filtroArray);
        } catch (error) {
            console.log(error);
        }
    };

    const editarCuenta = (item) => {
        setModoEdicion(true)
        setId(item.id)
        setNombre(item.nombre)
        setDescripcion(item.descripcion)
        setTipoCategoria(item.tipoCategoria)
    };

    const actualizarCategorias = async (e) => {
        e.preventDefault();
        try {
            const cta = {
                nombre: nombre,
                descripcion: descripcion,
            };

            await db.collection(COLLECTION_DB).doc(id).update(cta);

            const filtro = categorias.map((item) =>
                item.id === id
                    ? { id: item.id, nombre: nombre, descripcion: descripcion, tipoCategoria: tipoCategoria}
                    : item
            );

            setCategorias(filtro);

            setModoEdicion(false);
            setNombre("");
            setDescripcion("");
            setTipoCategoria('-1');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-4">
                    <h1>{!modoEdicion ? 'Agregar Categoría' : 'Modificar Categoría'}</h1>
                    <form onSubmit={modoEdicion ? actualizarCategorias : agregarCuenta}>
                        <div className="form-group">
                            <label>Nombre :</label>
                            <input
                                type="text"
                                placeholder="Nombre de la categoría"
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
                                placeholder="Descripción"
                                className="form-control mb-2"
                                onChange={(e) => setDescripcion(e.target.value)}
                                value={descripcion}
                            />
                            {errDescripcion ? (
                                <small className="text-danger">{errDescripcion}</small>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label>Tipo Categoría:</label>                            
                            <select class="form-control mb-2" aria-label=".form-select-sm example" onChange={(e) => setTipoCategoria(e.target.value)}>
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
                                {categorias.length === 0 ? (
                                    <thead className="list-group-item">Sin categorias</thead>
                                ) : (
                                    categorias.map((item) => (
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
                                                        onClick={() => editarCuenta(item)}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-edit"></i>{" "}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => eliminarCategorias(item.id)}
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

export default Categorias