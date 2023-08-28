module.exports = {
    DB_HOST: 'localhost',
    DB_USER: 'root',
    DB_PASSWORD: '',
    DB_NAME: 'ed_auth_mysql',
    DB_DIALECT: 'mysql',

    
    DB_POOL: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}