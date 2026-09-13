const db = require("../models");
const Localidad = db.localidad;

// Crear localidad
exports.create = (req, res) => {
    const localidad = {
        nombre: req.body.nombre,
        vip: req.body.vip,
        general_norte: req.body.general_norte,
        platea: req.body.platea
    };

    Localidad.create(localidad)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear la localidad."
            });
        });
};

// Listar localidades
exports.findAll = (req, res) => {
    Localidad.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al obtener las localidades."
            });
        });
};

// Obtener localidad por ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Localidad.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: "No se encontró la localidad con id=" + id
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al obtener la localidad con id=" + id
            });
        });
};

// Actualizar localidad
exports.update = (req, res) => {
    const id = req.params.id;

    Localidad.update(req.body, {
        where: {
            id_localidad: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "La localidad fue actualizada correctamente."
                });
            } else {
                res.send({
                    message: "No se pudo actualizar la localidad con id=" + id
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar la localidad con id=" + id
            });
        });
};

// Eliminar localidad
exports.delete = (req, res) => {
    const id = req.params.id;

    Localidad.destroy({
        where: {
            id_localidad: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "La localidad fue eliminada correctamente."
                });
            } else {
                res.send({
                    message: "No se pudo eliminar la localidad con id=" + id
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar la localidad con id=" + id
            });
        });
};