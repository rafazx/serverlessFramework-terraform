'use strict';

const AWS = require('aws-sdk')
AWS.config.update({
  region: process.env.AWS_REGION
})
const documentClient = new AWS.DynamoDB.DocumentClient()
const bcrypt = require('bcryptjs')
const uuid = require('uuid')

const createUser = async (body) => {
  return await documentClient.put({
    TableName: process.env.DYNAMODB_USERS,
    Item: {
      id: uuid.v4(),
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10)
    }
  }).promise()
}

exports.register = async ({ body }) => {
  const request = JSON.parse(body)
  await createUser(request)

  return {
    statusCode: 201,
    body: JSON.stringify({ 
      message : 'Usuário Criado'
    })
  }
};
