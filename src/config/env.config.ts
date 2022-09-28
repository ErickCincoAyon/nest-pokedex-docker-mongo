export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: +process.env.PORT,
    pagination: {
        defaultLimit: +process.env.PAGINATION_LIMIT,
        defaultOffset: +process.env.PAGINATION_OFFSET,
    }
});