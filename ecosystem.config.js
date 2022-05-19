module.exports = {
  apps: [{
    name: "crypto-auto-trader",
    script: "./dist/index.js",
    watch: true,
    ignore_watch: [
      "node_modules",
      "logs",
    ],
    env: {
      NODE_ENV: "development"
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
}
