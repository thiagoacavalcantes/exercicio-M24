const { spec } = require('pactum');
const { like } = require('pactum-matchers');
const pjr = require('pactum-json-reporter');


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

it('Deve adicionar uma categoria com sucesso', async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withHeaders('Authorization', '$S{authToken}')
    .withGraphQLQuery(`
      mutation AddCategory($name: String, $photo: String) {
        addCategory(name: $name, photo: $photo) {
          name
          photo
        }
      }
    `)
    .withGraphQLVariables({
      name: "bolsas-teste-exercicio-QA-001",
      photo: "https://i.ibb.co/fdnfMG4v/bolsa-ebac.webp"
    })
    .expectStatus(200)
    .stores('categoryId', 'addCategory.id'); // Salva o ID da categoria na sessão
});

it('Deve deletar uma categoria', async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withHeaders('Authorization', '$S{authToken}')
    .withGraphQLQuery(`
      mutation DeleteCategory($deleteCategoryId: ID!) {
        deleteCategory(id: $deleteCategoryId) {
          name
        }
      }
    `)
    .withGraphQLVariables({
      deleteCategoryId: '$S{categoryId}' // Usa o ID armazenado
    })
    .expectStatus(200);
});

it('Deve editar uma categoria com sucesso', async() => {
  await spec()
  .post('http://lojaebac.ebaconline.art.br/graphql')
  .withGraphQLQuery(`
      mutation Mutation($editCategoryId: ID!, $name: String) {
      editCategory(id: $editCategoryId, name: $name) {
      name
}
}`)
.withGraphQLVariables({
  editCategoryId: "67d9d956712a3b283621c6bb",
  name: "Teste-Alteração-Categoria-GraphQL"
}).expectStatus(200)

});

