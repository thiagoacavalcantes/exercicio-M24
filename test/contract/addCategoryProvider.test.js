const { reporter, flow } = require('pactum');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
  pf.config.url = 'http://localhost:8080'; // pactum flow server url
  pf.config.projectId = 'lojaebac-api';
  pf.config.projectName = 'Loja EBAC API';
  pf.config.version = '1.0.0';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
});

// global after
after(async () => {
  await reporter.end();
});

request.setBaseUrl('http://lojaebac.ebaconline.art.br');


let token;
beforeEach(async () => {
  token = await flow()
    .post('/public/authUser')
    .withJson({
      email: "admin@admin.com",
      password: "admin123"
    })
    .returns('data.token'); 
});  

it.only('API - Deve adicionar uma categoria', async() => {
    await flow("Add Category")
    .post('/api/addCategory')
    .withHeaders("Authorization", token)
    .withJson({
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OWY1MGViMGNmMGE5MTMyNThiMjg2YyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc0Mjg0MjgxMiwiZXhwIjoxNzQyOTI5MjEyfQ.vMQyvdYmGCH2cLrGatdTmJVtK4648D3KZLJHrtouFp4",
            name: "Nova-Bolsa-Edição",
            photo: "https://i.ibb.co/fdnfMG4v/bolsa-ebac.webp"
          
        }).expectStatus(200)
        .expectJson('success', true);    
});