const { spec, request } = require('pactum');
const { eachLike, like } = require('pactum-matchers');

request.setBaseUrl('http://lojaebac.ebaconline.art.br');


let token;
beforeEach(async () => {
  token = await spec()
    .post('/public/authUser')
    .withJson({
      email: "admin@admin.com",
      password: "admin123"
    })
    .returns('data.token'); 
});  

it('API - Deve adicionar uma categoria', async() => {
    await spec()
    .post('/api/addCategory')
    .withHeaders("Authorization", token)
    .withJson({
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OWY1MGViMGNmMGE5MTMyNThiMjg2YyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc0Mjg0MjgxMiwiZXhwIjoxNzQyOTI5MjEyfQ.vMQyvdYmGCH2cLrGatdTmJVtK4648D3KZLJHrtouFp4",
            name: "Nova-Bolsa-Edição",
            photo: "https://i.ibb.co/fdnfMG4v/bolsa-ebac.webp"
          
        }).expectStatus(200)
        .expectJson('success', true);    
});