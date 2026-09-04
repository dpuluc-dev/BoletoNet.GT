module.exports = (sequelize, Sequelize) => {

    const Usuario = sequelize.define("usuario", {

        nombre_completo: {
            type: Sequelize.STRING
        },

        nombre_usuario: {
            type: Sequelize.STRING
        },

        password_hash: {
            type: Sequelize.STRING
        },

        email: {
            type: Sequelize.STRING
        },

        telefono: {
            type: Sequelize.STRING
        },

        direccion: {
            type: Sequelize.STRING
        },

        rol: {
            type: Sequelize.STRING
        },

        fecha_creacion: {
            type: Sequelize.DATE
        },

        status: {
            type: Sequelize.BOOLEAN
        }
    });
    return Usuario;
}