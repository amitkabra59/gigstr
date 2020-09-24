# gigstr
Building backend prototype as part of test given by Gigstr

---
## Requirements

For development, you will need Node.js and a node global package, npm, postgresql installed in your environment.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###


---

## Install

    $ git clone https://github.com/amitkabra59/gigstr
    $ cd gigstr
    $ npm install

## Running the project

    $ npm start

## Running the tests

    $ npm test

## API Routes

    GET    /api/tasks
    POST   /api/login/:id
    POST   /api/admin/task
    DELETE /api/admin/task/:id
    PUT    /api/task/:id/assign
    PUT    /api/task/:id/done

 
All API endpoints work with the JSON body. 
Each request are authorized by a token. The database url, port, and other secret keys are stored locally in .env file. 


## Postgresql
Two tables are created in postgresql database, namely, users and tasks. Each user in users table is assigned only one of the following roles:
- admin
- gigstr

Users with admin role can perform following operations:
  - create/delete a new/existing task
  - view the created task list
  - cannot change task status

Users with gigstr role can perform following operations:
  - view the task list added by admin 
  - update status of tasks to assign/done
  - can assign only one task at a time
  - cannot create/delete tasks

Schema and tables are created in postgresql database using following commands:

    $ CREATE SCHEMA users;

    $ CREATE TABLE users.users (
      name character varying(100),
      id character varying(15) NOT NULL,
      role character varying(10) NOT NULL );

    $ ALTER TABLE ONLY users.users
      ADD CONSTRAINT id PRIMARY KEY (id);

    $ CREATE TABLE users.tasks (
      id character varying(15) NOT NULL,
      description character varying NOT NULL,
      status character varying(15) NOT NULL,
      assignee_id character varying );

    $ ALTER TABLE ONLY users.tasks
      ADD CONSTRAINT tasks_pkey PRIMARY KEY (id); 


## Json Web Token

This project has a few routes that need protecting and authorization based on roles.
JSON Web Token (JWT) is an open standard that defines a compact and self-contained way of securely transmitting information between parties as a JSON object. Authorization is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. The verifyToken function in verifyAuth.js file is used to verify if the token is valid or not.
