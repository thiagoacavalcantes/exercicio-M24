const pactum = require('pactum');
require('pactum-flow-plugin'); // Ativa o plugin se necessário

const { reporter, flow, handler } = pactum;
const request = pactum.request;



function addFlowReporter() {
  pf.config.url = 'http://localhost:8080'; // pactum flow server url
  pf.config.projectId = 'lojaebac';
  pf.config.projectName = 'Loja EBAC';
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

handler.addInteractionHandler('Add Category Response', () => {
    return {
        provider: 'lojaebac-api',
        flow: 'addCategory',
        request: {
            method: 'POST',
            path: '/api/addCategory',
            body: {
                uthorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OWY1MGViMGNmMGE5MTMyNThiMjg2YyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc0Mjg0MjgxMiwiZXhwIjoxNzQyOTI5MjEyfQ.vMQyvdYmGCH2cLrGatdTmJVtK4648D3KZLJHrtouFp4",
                name: "Nova-Bolsa-Edição",
                photo: "https://i.ibb.co/fdnfMG4v/bolsa-ebac.webp"
      },
      response: {
        status: 200,
        body: {
            "success": true
            }
         }
        }
    }
})

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

it('FRONT - Deve adicionar uma categoria', async() => {
    await flow("addCategory")
    .useInteraction('Add Category Response')
    .post('/api/addCategory')
    .withHeaders("Authorization", token)
    .withJson({
            authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OWY1MGViMGNmMGE5MTMyNThiMjg2YyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc0Mjg0MjgxMiwiZXhwIjoxNzQyOTI5MjEyfQ.vMQyvdYmGCH2cLrGatdTmJVtK4648D3KZLJHrtouFp4",
            name: "Nova-Bolsa-Edição",
            photo: "https://i.ibb.co/fdnfMG4v/bolsa-ebac.webp"
          
        }).expectStatus(200)
        .expectJson('success', true);    
});