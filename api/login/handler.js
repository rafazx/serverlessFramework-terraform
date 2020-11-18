const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.AWS_REGION
})
const documentClient = new AWS.DynamoDB.DocumentClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async ({ body }) => {
    const request = JSON.parse(body)
    const params = {
        TableName: process.env.DYNAMODB_USERS,
        IndexName: process.env.EMAIL_GSI,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': request.email
        }
    }
    const data = await documentClient.query(params).promise()
    const user = data.Items[0]

    if(user) {
        if(bcrypt.compareSync(request.password, user.password)) {
            delete user.password
            return {
                statusCode: 200,
                body: JSON.stringify({ token : jwt.sign(user, process.env.JWT_SECRET)})
            }
        }
        return {
            statusCode: 401,
            body: JSON.stringify({ message : 'Usuário ou Senha errados'})
        }
    }
    return {
        statusCode: 401,
        body: JSON.stringify({ message : 'Usuário ou Senha errados'})
    }
}