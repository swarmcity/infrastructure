var NS1 = require('ns1')
const envalid = require('envalid')
const { str } = envalid
const env = envalid.cleanEnv(process.env, {
    SSL_API_KEY:            str()
})

NS1.set_api_key(process.env.SSL_API_KEY)

NS1.Monitor.jobtypes().then(function(jobTypes) {
    console.log(jobTypes)
})

