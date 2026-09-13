const db = require("../models");
const Inventario = db.inventario;


//Crear Inventario 
exports.inventario = (req, res) => {
    const inventario = {
        id_concierto: req.body.id_concierto,
        id_localidad: req.body.id_localidad,
        precio: req.body.precio,
        cantidad_total: req.body.cantidad_total,
        cantidad_disponible: req.body.cantidad_disponible
    }

    Inventario.create(inventario)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
                message: err.message || "Se produjo un error al crear registro Inventario!"
            });
          });
   
};

//Listar todos los registros del Inventario
exports.findAll = (req, res) => {
  
Inventario.findAll()
     .then(data => {
      res.send(data);
     })
     .catch(err => {
      res.status(500).send({
        message: err.message || "Se produjo un error al recuperar datos de Inventario!"
      });
     });

};

// Obtener Inventario por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Inventario.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `No se encontró Inventario con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al recuperar Inventario con id=" + id
            });
        });
};

//Actualizar Inventario por id
exports.update = (req, res) => {
  const id = req.params.id;

  Inventario.update(req.body, {
    where: { id_inventario: id }
  }) 
    .then(num => {
      if(num == 1) {
        res.send({
          message: "El Inventario se actualizo correctamente."
        });
      } else {
        res.send({
        message: `No se puede actualizar Inventario con id=${id}`   
        });
      }
  })  
  .catch(err => {
    res.status(500).send({
      message: "Error al actualizar Inventario con id=" + id
    });
  });
    
};

// Eliminar Inventario por id
exports.delete = (req, res) => {
  const id = req.params.id;

  Inventario.destroy({
    where: { 
      id_inventario: id 
    }
  })
    .then(num => {
      if(num == 1) {
        res.send({
          message: "Se elimino el Inventario correctamente!"
        });
      } else {
        res.send({
          message: `No se puede eliminar el Inventario con id=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar Inventario con id=" + id
      });
    });
};



