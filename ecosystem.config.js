module.exports = {
    apps: [
        {
            name: "Blog-App",
            script: "./index.js",
            env: {
                NODE_ENV: "production",
                PORT: 9000
            },
        }
    ]
}