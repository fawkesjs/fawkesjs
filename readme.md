## FawkesJs
> FawkesJs is a Javascript framework that is built on top of express, typescript and MVC structure.
> Inspired by Laravel and Loopback, the target of the framework is to make Javascript development even easier.

[![npm version](https://badge.fury.io/js/fawkesjs.svg)](https://badge.fury.io/js/fawkesjs)
[![Chat on Gitter](https://badges.gitter.im/fawkesjs/fawkesjs.svg)](https://gitter.im/fawkesjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## System Requirement
- Nodejs 7.6 or above (for the default support of async await)

## Usage
```bash
git clone https://github.com/fawkesjs/fawkesjs-starter
cd fawkesjs-starter
npm install && npm run start # swagger at http://localhost:5000/swagger
```

### Common Command
- Generating Swagger: `npm run swagger`
- Full Migrate DB: `npm run db:sync`
- Restart App: `node .` or `nodemon ./index.js -e ts --watch app`

## Some Note
FawkesJs-starter comes default with configuration suits for new project, such as using with postgres, api and web in same project.

However future scaling possibility has been implemented inside our code, just that we believe early optimization is bad and expensive, therefore we will not include that inside FawkesJs-starter.

## Build in structure in this project
- Express
- Sequelize
- Typescript
- Swagger: use `fawkesjs -s ./swagger/swagger.json` to generate swagger document
- Express Rest Param Validation: integration with swagger document generation
- Acl (inside `fawkesjs-starter/app/module`)
- AccessToken (inside `fawkesjs-starter/app/module`)

## Resources
- [Starter](https://github.com/fawkesjs/fawkesjs-starter)
- [Documentation](https://github.com/fawkesjs/fawkesjs/tree/master/doc)
