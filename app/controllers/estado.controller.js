const db = require("../models");
const Estado = db.estado;
const Op = db.Sequelize.Op;


// Crear un artista
exports.create = (req, res) => {
    const estado = {
        estado: req.body.estado,
        fecha_creacion: req.body.fecha_creacion,
        status: req.body.status ? req.body.status : true
    }

    Estado.create(estado)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al crear el estado!"
            });
        });
};


// Listar todos los estados (con filtro opcional por estado)
exports.findAll = (req, res) => {
    const estado = req.query.estado;
    var condition = estado ? { estado: { [Op.iLike]: `%${estado}%` } } : null;

    Estado.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al recuperar los tipos de estados!"
            });
        });
};


// Obtener un estado por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Estado.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al recuperar el estado con id=" + id
            });
        });
};


// Actualizar un estado por id
exports.update = (req, res) => {
    const id = req.params.id;

    Estado.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El estado se actualizó correctamente."
                });
            } else {
                res.send({
                    message: `No se puede actualizar el estado con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el estado con id=" + id
            });
        });
};


// Eliminar un estado por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Estado.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "El estado se eliminó correctamente!"
                });
            } else {
                res.send({
                    message: `No se puede eliminar el estado con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "No se pudo eliminar el estado con id=" + id
            });
        });
}; 
