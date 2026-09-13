const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.inventario = require("./inventario.model.js")(sequelize, Sequelize);
db.localidad = require("./localidad.model.js")(sequelize, Sequelize);
db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.cliente = require("./cliente.model.js")(sequelize, Sequelize);

db.artista = require("./artista.model.js")(sequelize, Sequelize);
db.concierto = require("./concierto.model.js")(sequelize, Sequelize);
// RELACIONES DE LLAVES FORÁNEAS
// Un Artista puede tener muchos Conciertos
db.artista.hasMany(db.concierto, { foreignKey: "idArtista" });
db.concierto.belongsTo(db.artista, { foreignKey: "idArtista" });


// ======================================== 
// RELACIÓN LOCALIDAD - INVENTARIO 
// ======================================== 
db.localidad.hasMany(db.inventario, { 
foreignKey: "id_localidad" 
}); 
db.inventario.belongsTo(db.localidad, { 
foreignKey: "id_localidad" 
});

module.exports = db; 
// Index terminado en las relaciones foraneas!