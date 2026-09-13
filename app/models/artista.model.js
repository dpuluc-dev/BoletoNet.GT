const { toDefaultValue } = require("sequelize/lib/utils");

module.exports = (sequelize, Sequelize) => {
    const Artista = sequelize.define("artista", {
        nombre_artistico: {
            type: Sequelize.STRING
        },
        genero_musical: {
            type: Sequelize.STRING
        },
        pais_origen: {
            type: Sequelize.STRING
        },
        fecha_registro: {
            type: Sequelize.DATEONLY
        },
        status: {
            type: Sequelize.BOOLEAN,
            toDefaultValue: true
        }
    }, {
        timestamps: false
    });
    return Artista;
}