const { spec } = require('pactum');
const { like } = require('pactum-matchers');
const pjr = require('pactum-json-reporter');

pjr.file = 'exercicio-ebac-24';
beforeEach(async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withGraphQLQuery(`
      mutation AuthUser($email: String, $password: String) {
        authUser(email: $email, password: $password) {
          success
          token
        }
      }
    `)
    .withGraphQLVariables({
      email: "adminqa@ebac.com",
      password: "admin123"
    })
    .expectStatus(200)
    .stores('authToken', 'data.authUser.token');  
});

it('Deve adicionar um produto com sucesso', async () => {
  await spec()
  .post('http://lojaebac.ebaconline.art.br/graphql')
  .withHeaders('Authorization', '$S{authToken}') 
  .withGraphQLQuery(`mutation AddProduct($name: String, $price: Float, $photos: [String]) {
  addProduct(name: $name, price: $price, photos: $photos) {
    name
    price
    photos
  }
}`
      )
      .withGraphQLVariables({
          name: "Teste Exercicio 1",
          price: 100.99,
          photos: "https://i.ibb.co/fdnfMG4v/bolsa-ebac.webp",
          })
      .expectStatus(200)
      .stores('productId', 'addproduct.id')
      .expectJsonMatch({
        data: {
          addProduct: {
              name: like("Teste")
          }
     }
  })
});




  it('Deve editar um produto com sucesso', async () => {
    await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withHeaders('Authorization', '$S{authToken}') 
    .withGraphQLQuery(`
        mutation EditProduct($editProductId: ID!, $name: String) {
          editProduct(id: $editProductId, name: $name) {
             name
                }
              }
        `)
        .withGraphQLVariables({
            editProductId: '$S{productId}',
            name: "Edição de Produto"
        })
        .expectStatus(200)
    })

    it('Deve deletar um produto com sucesso', async () => {
      await spec()
      .post('http://lojaebac.ebaconline.art.br/graphql')
      .withHeaders('Authorization', '$S{authToken}') 
      .withGraphQLQuery(`
          mutation DeleteProduct($deleteProductId: ID!) {
              deleteProduct(id: $deleteProductId) {
                  name
                  }
              }
          `)
          .withGraphQLVariables({
              deleteProductId: '$S{productId}'
          })
          .expectStatus(200)
      })
    
  