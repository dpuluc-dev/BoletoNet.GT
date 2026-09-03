const db = require("../models");
const Cliente = db.cliente;
const Op = db.Sequelize.Op;


// Crear un cliente
exports.create = (req, res) => {
    const cliente = {
        nombre_completo: req.body.nombre_completo,
        nombre_usuario: req.body.nombre_usuario,
        password_hash: req.body.password_hash,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        fecha_creacion: req.body.fecha_creacion,
        status: req.body.status ? req.body.status : false
    }

    Cliente.create(cliente)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al crear el cliente!"
            });
        });
};


// Listar todos los clientes (con filtro opcional por nombre_completo)
exports.findAll = (req, res) => {
    const nombre_completo = req.query.nombre_completo;
    var condition = nombre_completo ? { nombre_completo: { [Op.iLike]: `%${nombre_completo}%` } } : null;

    Usuario.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al recuperar los clientes!"
            });
        });
};


// Obtener un cliente por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Cliente.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al recuperar el cliente con id=" + id
            });
        });
};


// Actualizar un cliente por id
exports.update = (req, res) => {
    const id = req.params.id;

    Cliente.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El cliente se actualizó correctamente."
                });
            } else {
                res.send({
                    message: `No se puede actualizar el cliente con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el cliente con id=" + id
            });
        });
};


// Eliminar un cliente por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Cliente.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El cliente se eliminó correctamente!"
                });
            } else {
                res.send({
                    message: `No se puede eliminar el cliente con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el cliente con id=" + id
            });
        });
};


exports.AccesoLogin = (req, res) => {
    const nombre_usuario = req.params.nombre_usuario;

    Usuario.findOne({ where: { nombre_usuario: nombre_usuario } })
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: "CLiente no encontrado." });
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al buscar el cliente: " + err.message
            });
        });
};