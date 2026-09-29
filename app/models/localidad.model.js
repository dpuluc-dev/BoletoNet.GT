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
        status: {
            type: Sequelize.BOOLEAN,
            toDefaultValue: true
        }

    }, {
        timestamps: false,
        tableName: "localidad"
    });

    return Localidad;
};
