module.exports = (sequelize, Sequelize) => {

    const Localidad = sequelize.define("localidad", {

        id_localidad: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: Sequelize.STRING
        },

        vip: {
            type: Sequelize.DECIMAL(10, 2)
        },

        general_norte: {
            type: Sequelize.DECIMAL(10, 2)
        },

        platea: {
            type: Sequelize.DECIMAL(10, 2)
        }

    }, {
        timestamps: false,
        tableName: "localidad"
    });

    return Localidad;
};
