module.exports = (sequelize, Sequelize) => {
const Inventario = sequelize.define("inventario", {

      id_inventario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        id_concierto : {
            type: Sequelize.INTEGER
        },

        id_localidad: {
            type: Sequelize.INTEGER
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2)
        },
        cantidad_total: {
            type: Sequelize.INTEGER
        },
        cantidad_disponible: {
            type: Sequelize.INTEGER

        }

        }, {
            timestamps: false
        

    });

    return Inventario;
};
