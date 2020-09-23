let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app/server');
const dotenv = require('dotenv').config();
const { status } = require('../app/helpers/status');

chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
    describe("GET /", () => {
        it("It should GET all the tasks", (done) => {
            chai.request(app).get('/api/tasks').set('auth-token', process.env.GIGSTR_TOKEN).end((err, response) => {
                response.should.have.status(status.success);
                response.body.should.be.a('array');
                done();
            });
        })
    });

    describe("POST /", () => {
        it("It should POST a new task", (done) => {
            chai.request(app).post('/api/admin/task').set('auth-token', process.env.ADMIN_TOKEN).send([{
                "id": "0550",
                "description": "This is a new job",
                "status": "new",
                "assignee_id": null
            }]).end((err, response) => {

                response.should.have.status(status.created);
                // response.text.should.equal(`Task added with id ${response.body.data}`);
                response.created.should.equal(true);
                done();
            });
        })
    });

    describe(" LOGIN /", () => {
        it("It should LOGIN and generate a token", (done) => {
            const id = '201'
            chai.request(app).post(`/api/login/${id}`).end((err, response, body) => {
                response.should.have.header('auth-token');
                response.should.have.status(status.success);
                done();
            });
        });
    });

    describe(" NOT LOGIN /", () => {
        it("It should NOT LOGIN", (done) => {
            const id = '2010'
            chai.request(app).post(`/api/login/${id}`).end((err, response, body) => {
                response.should.not.have.header('auth-token');
                response.should.have.status(status.bad);
                response.text.should.equal('Bad request, the user does not exist!')
                done();
            });
        });
    });

    describe(" ASSIGN TASK /", () => {
        it("It should assign task", (done) => {
            const id = '0550'
            chai.request(app).put(`/api/task/${id}/assign`).set('auth-token', process.env.GIGSTR_NEW_TOKEN).end((err, response, body) => {
                response.text.should.equal(`Task with ID: ${id} is assigned `);
                response.should.have.status(status.success);
                done();
            });
        });
    });

    describe(" NOT ASSIGN more than one task /", () => {
        it("It should not assign more than one task", (done) => {
            const id = '0501'
            chai.request(app).put(`/api/task/${id}/assign`).set('auth-token', process.env.GIGSTR_NEW_TOKEN).end((err, response, body) => {
                response.text.should.equal(`Please complete the assigned task first`);
                response.should.have.status(status.success);
                done();
            });
        });
    });

    describe("DELETE TASK /", () => {
        const id = '0550';
        it("It should DELETE a task", (done) => {
            chai.request(app).delete(`/api/admin/task/${id}`).set('auth-token', process.env.ADMIN_TOKEN).end((err, response) => {
                response.should.have.status(status.created);
                response.text.should.equal(`Task deleted with id ${id}`);
                response.created.should.equal(true);
                done();
            });
        })
    });
});


describe("SECURE ROUTES", () => {
    describe("NOT GET /", () => {
        it("It should NOT GET all the tasks", (done) => {
            chai.request(app).get('/api/tasks').end((err, response) => {
                response.should.have.status(status.unauthorized);
                response.body.error.should.equal("Token not provided");
                response.unauthorized.should.equal(true);
                done();
            });
        })
    });

    describe("NOT POST /", () => {
        it("It should NOT POST a new tasks", (done) => {
            chai.request(app).post('/api/admin/task').send([{
                "id": "0517",
                "description": "This is a new job",
                "status": "new",
                "assignee_id": null
            }]).end((err, response) => {
                response.should.have.status(status.unauthorized);
                response.body.error.should.equal("Token not provided");
                response.unauthorized.should.equal(true);
                done();
            });
        })
    });

    describe("Gigstrs CANNOT POST a new task without valid token /", () => {
        it("It should not POST a new task", (done) => {
            chai.request(app).post('/api/admin/task').set('auth-token', process.env.GIGSTR_TOKEN).send([{
                "id": "0517",
                "description": "This is a new job",
                "status": "new",
                "assignee_id": null
            }]).end((err, response, body) => {
                response.should.have.status(status.unauthorized);
                response.text.should.equal("Unauthorized");
                response.unauthorized.should.equal(true);
                done();
            });
        })
    });

    describe("CANNOT ASSIGN TASK without valid token/", () => {
        it("It should not assign task", (done) => {
            const id = '0526'
            chai.request(app).put(`/api/task/${id}/assign`).end((err, response, body) => {
                response.should.have.status(status.unauthorized);
                response.body.error.should.equal("Token not provided");
                response.unauthorized.should.equal(true);
                done();
            });
        });
    });

    describe("Admin CANNOT ASSIGN task /", () => {
        it("It should not assign task", (done) => {
            const id = '0526'
            chai.request(app).put(`/api/task/${id}/assign`).set('auth-token', process.env.ADMIN_TOKEN).end((err, response, body) => {
                response.text.should.equal("Unauthorised");
                response.should.have.status(status.unauthorized);
                response.unauthorized.should.equal(true);
                done();
            });
        });
    });

    describe("CANNOT CHANGE STATUS of a task without valid token /", () => {
        it("It should not assign task", (done) => {
            const id = '0526'
            chai.request(app).put(`/api/task/${id}/done`).end((err, response, body) => {
                response.body.error.should.equal("Token not provided");
                response.should.have.status(status.unauthorized);
                response.unauthorized.should.equal(true);
                done();
            });
        });
    });

    describe("Admin CANNOT CHANGE STATUS of a task /", () => {
        it("It should not assign task", (done) => {
            const id = '0526'
            chai.request(app).put(`/api/task/${id}/done`).set('auth-token', process.env.ADMIN_TOKEN).end((err, response, body) => {
                response.text.should.equal("Unauthorized");
                response.should.have.status(status.unauthorized);
                response.unauthorized.should.equal(true);
                done();
            });
        });
    });

    describe("CANNOT DELETE TASK without valid token /", () => {
        const id = '0531';
        it("It should not DELETE a task", (done) => {
            chai.request(app).delete(`/api/admin/task/${id}`).end((err, response) => {
                response.should.have.status(status.unauthorized);
                response.body.error.should.equal('Token not provided');
                response.unauthorized.should.equal(true);
                done();
            });
        });
    });

    describe("Gigstr CANNOT DELETE TASK /", () => {
        const id = '0531';
        it("It should not DELETE a task", (done) => {
            chai.request(app).delete(`/api/admin/task/${id}`).set('auth-token', process.env.GIGSTR_TOKEN).end((err, response) => {
                response.should.have.status(status.unauthorized);
                response.text.should.equal('Unauthorized');
                response.unauthorized.should.equal(true);
                done();
            });
        });
    });

    describe("REFRESH token /", () => {
        const token = process.env.TEST_REFRESH_TOKEN;
        const secret = process.env.REFRESH_SECRET;
        it("It should generate a new access and refresh tokens", (done) => {
            chai.request(app).post(`/api/refresh`).set('refresh-token', token).end((err, response) => {
                response.should.have.status(status.success);
                response.should.have.header('auth-token');
                response.should.have.header('refresh-token');
                done();
            });
        });
    });
});