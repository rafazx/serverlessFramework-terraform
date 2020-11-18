
const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.AWS_REGION
})
const documentClient = new AWS.DynamoDB.DocumentClient()
const uuid = require('uuid')

const createDocument = async ({ authorizer }, request) => {
    const params = {
        TableName: process.env.DYNAMODB_BOOKINGS,
        Item: {
            id: uuid.v4(),
            date: request.date,
            user: authorizer
        }
    }
    await documentClient.put(params).promise()
}

exports.create = async ({requestContext, body}) => {
    const request = JSON.parse(body)
    await createDocument(requestContext, request);
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Agendamento Efetuado com sucesso'})
    }
}