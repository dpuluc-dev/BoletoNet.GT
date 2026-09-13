const db = require("../models");
const Concierto = db.concierto;
const Artista = db.artista;

// Crear un concierto
exports.create = async (req, res) => {
    try {
        const artista = await Artista.findByPk(req.body.idArtista);
        if (!artista) {
            return res.status(404).send({ message: "El artista no existe." });
        }

        const concierto = await Concierto.create({
            idArtista: req.body.idArtista,
            titulo_evento: req.body.titulo_evento,
            descripcion: req.body.descripcion,
            fecha_concierto: req.body.fecha_concierto,
            recinto: req.body.recinto,
            estado: req.body.estado,
            capacidad_total: req.body.capacidad_total,
            fecha_inicio_venta: req.body.fecha_inicio_venta,
            fecha_final_venta: req.body.fecha_final_venta
        });

        res.send(concierto);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err.message || "Se produjo un error al crear el concierto!"
        });
    }
};

// Listar todos los conciertos
exports.findAll = (req, res) => {
    Concierto.findAll({
        include: [{ model: Artista }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al recuperar los conciertos!"
            });
        });
};

// Buscar un concierto por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Concierto.findByPk(id, {
        include: [{ model: Artista }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al recuperar el concierto con id=" + id
            });
        });
};

// Actualizar un concierto por id
exports.update = (req, res) => {
    const id = req.params.id;

    Concierto.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: "El concierto se actualizo correctamente." });
            } else {
                res.send({ message: `No se puede actualizar el concierto con id=${id}` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error al actualizar el concierto con id=" + id });
        });
};

// Eliminar un concierto por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Concierto.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: "El concierto se elimino correctamente!" });
            } else {
                res.send({ message: `No se puede eliminar el concierto con id=${id}, el concierto no fue encontrado!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "No se pudo eliminar el concierto con id=" + id });
        });
}; 
