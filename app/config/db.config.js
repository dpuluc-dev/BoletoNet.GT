module.exports = {
    HOST: "ep-frosty-cake-a5uid1zo-pooler.us-east-2.aws.neon.tech",
    USER: "neondb_owner",
    PASSWORD: "npg_u7iDs1BWYNhx",
    DB: "neondb",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};