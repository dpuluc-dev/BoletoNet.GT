const db = require("../models");
const Usuario = db.usuario;
const Op = db.Sequelize.Op;


// Crear un usuario
exports.create = (req, res) => {
    const usuario = {
        nombre_completo: req.body.nombre_completo,
        nombre_usuario: req.body.nombre_usuario,
        password_hash: req.body.password_hash,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        rol: req.body.rol,
        fecha_creacion: req.body.fecha_creacion,
        status: req.body.status ? req.body.status : false
    }

    Usuario.create(usuario)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al crear el usuario!"
            });
        });
};


// Listar todos los usuarios (con filtro opcional por nombre_completo)
exports.findAll = (req, res) => {
    const nombre_completo = req.query.nombre_completo;
    var condition = nombre_completo ? { nombre_completo: { [Op.iLike]: `%${nombre_completo}%` } } : null;

    Usuario.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al recuperar los usuarios!"
            });
        });
};


// Obtener un usuario por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Usuario.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al recuperar el usuario con id=" + id
            });
        });
};


// Actualizar un usuario por id
exports.update = (req, res) => {
    const id = req.params.id;

    Usuario.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuario se actualizó correctamente."
                });
            } else {
                res.send({
                    message: `No se puede actualizar el usuario con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el usuario con id=" + id
            });
        });
};


// Eliminar un usuario por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Usuario.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuario se eliminó correctamente!"
                });
            } else {
                res.send({
                    message: `No se puede eliminar el usuario con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el usuario con id=" + id
            });
        });
};


// Login - Busca por nombre de usuario e incluye en password_hash 
exports.AccesoLogin = (req, res) => {
    const nombre_usuario = req.params.nombre_usuario;

    Usuario.findOne({ where: { nombre_usuario: nombre_usuario } })
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "Usuario no encontrado." });
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al buscar el usuario: " + err.message
            });
        });
};