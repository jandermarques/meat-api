import 'jest';
import * as request from 'supertest';


let address: string = (<any>global).address;

test('GET /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        })
        .catch(fail);
});

test('POST /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuário 1',
            email: 'usuario1@gmail.com',
            password: '123456',
            cpf: '183.927.740-86'
        })
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Usuário 1');
            expect(response.body.email).toBe('usuario1@gmail.com');
            expect(response.body.cpf).toBe('183.927.740-86');
            expect(response.body.password).toBeUndefined();
        })
        .catch(fail);
});

test('GET /users/aaaa', () => {
    return request(address)
        .get('/users/aaaa')
        .then(response => {
            expect(response.status).toBe(404);
        })
        .catch(fail);
});

test('PATCH /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuário 2',
            email: 'usuario2@gmail.com',
            password: '123456'
        })
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .send({
                name: 'Usuário 2 - patch'
            })
        )
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Usuário 2 - patch');
            expect(response.body.email).toBe('usuario2@gmail.com');
            expect(response.body.password).toBeUndefined();
        })
        .catch(fail);
});