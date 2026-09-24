const db = require("../models");
const Venta = db.venta;

// Create and Save a new Venta
exports.create = (req, res) => {
    if (!req.body.id_vendedor || !req.body.total_venta) {
        res.status(400).send({
            message: "id_vendedor y total_venta son obligatorios!"
        });
        return;
    }

    const venta = {
        id_vendedor: req.body.id_vendedor,
        fecha_venta: req.body.fecha_venta,   // si no viene, Sequelize usa el default NOW()
        total_venta: req.body.total_venta
    };

    Venta.create(venta)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Venta."
            });
        });
};

// Retrieve all Ventas from the database.
exports.findAll = (req, res) => {
    Venta.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving ventas."
            });
        });
};

// Find a single Venta with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Venta.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Venta with id=" + id
            });
        });
};

// Update a Venta by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Venta.update(req.body, {
        where: { id_venta: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Venta was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Venta with id=${id}. Maybe Venta was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Venta with id=" + id
            });
        });
};

// Delete a Venta with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Venta.destroy({
        where: { id_venta: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Venta was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Venta with id=${id}. La venta no fue encontrada!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Venta with id=" + id
            });
        });
};

// Delete all Ventas from the database.
exports.deleteAll = (req, res) => {
    Venta.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Ventas were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all ventas."
            });
        });
}; 
