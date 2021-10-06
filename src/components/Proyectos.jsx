import React, { useEffect, useState } from "react";
import { firebase } from "../firebase";

const Proyectos = () => {
    
  const [proyectos, setProyectos] = useState([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errNombre, setErrNombre] = useState("");
  const [errDescripcion, setErrDescripcion] = useState("");
  const [edicion, setEdicion] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("proyectos").get();
        const arrayProyectos = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProyectos(arrayProyectos);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerProyectos();
  }, []);

  const agregar = async (e) => {
    e.preventDefault();

    // if (!nombre.trim()) {
    //   setErrNombre("El campo nombre empresa no puede estar vacio");
    // } else if (!nombre.trim()) {
    //   setDescripcion("El campo nombre contacto no puede estar vacio");
    // } else {
    //   setProyectos([
    //     ...proyectos,

    //   ]);

    try {
      const db = firebase.firestore();
      const proy = {
        nombre: nombre,
        descripcion: descripcion,
      };

      const datos = await db.collection("proyectos").add(proy);

      setProyectos([
        ...proyectos,
        {
          id: datos.id,
          ...proy,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setNombre("");
    setDescripcion("");
    //}
  };

  const eliminarProveedor = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("proyectos").doc(id).delete();
      const filtroArray = proyectos.filter((item) => item.id !== id);
      setProyectos(filtroArray);
    } catch (error) {
      console.log(error);
    }
  };

  const editarProyecto = (item) => {
    setEdicion(true);
    setId(item.id);
    setNombre(item.nombre);
    setDescripcion(item.descripcion);
  };

  const actualizarProyecto = async (e) => {
    e.preventDefault();
    try {
      const proy = {
        nombre: nombre,
        descripcion: descripcion,
      };

      const db = firebase.firestore();
      await db.collection("proyectos").doc(id).update(proy);

      const filtro = proyectos.map((item) =>
        item.id === id
          ? { id: item.id, nombre: nombre, descripcion: descripcion }
          : item
      );

      setProyectos(filtro);

      setEdicion(false);
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
          <h1>Formulario</h1>
          <form onSubmit={edicion ? actualizarProyecto : agregar}>
            <div className="form-group">
              <label>Nombre :</label>
              <input
                type="text"
                placeholder="Nombre del proyecto"
                className="form-control mb-2"
                onChange={(e) => setNombre(e.target.value)}
                value={nombre}
              />
              {errNombre ? (
                <small className="text-danger">{errNombre}</small>
              ) : null}
            </div>
            <div className="form-group">
              <label>Nombre:</label>
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
            <button type="submit" className="btn btn-dark">
              {" "}
              {edicion ? "Actualizar" : "Enviar"}{" "}
            </button>
          </form>
        </div>
        <div className="col-sm-8">
          <h1>Lista de proyectos</h1>

          <div className="container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.length === 0 ? (
                  <thead className="list-group-item">Sin proyectos</thead>
                ) : (
                  proyectos.map((item) => (
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
                            onClick={() => editarProyecto(item)}
                          >
                            {" "}
                            <i className="fas fa-edit"></i>{" "}
                          </button>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => eliminarProveedor(item.id)}
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

export default Proyectos