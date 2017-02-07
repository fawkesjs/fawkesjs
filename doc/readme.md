## Build in structure in this project
- Express
- Sequelize
- Typescript
- Swagger: use `fawkesjs -s ./swagger/swagger.json` to generate swagger document
- Express Rest Param Validation: integration with swagger document generation
- Acl (inside `fawkesjs-starter/app/module`)
- AccessToken (inside `fawkesjs-starter/app/module`)

## Structuring Your Project
- app/bin/: this is place to store script
- app/config/config.ts: this is place for main config
- app/config/config.{env}.ts: this is place for main config to overwrite for specific environment
- app/config/datasource.ts: this is place for datasource config, `db` is the main database to use
- app/config/datasource.{env}.ts: this is place for datasource config to overwrite for specific environment
- app/config/swagger.ts: this is place for swagger config
- app/config/swagger.{env}.ts: this is place for swagger config to overwrite for specific environment
- app/controller/: this is place for controller (which should not have business logic)
- app/middleware/index.ts: `preCtrls` will be the middleware to use between the app routing and the main controller, sequence is important here
- app/model/: this is where your model should be at
- app/module/: plugin module, an alternative place to put if you don't want it to be at node_modules
- app/orm/index.ts: `ormDefinitions` for list of ormDefinitions that you want to include
- app/orm/{orm}.ts: where your orm class should be at
- app/ref/: where your const class should be at
- app/route/{folders}/index.ts: `routes: IRoutes` contain list of route, `{folders}` will be your relative path to base url, `route/index.ts` is the base url.
- migrations/: sequelize migration file
- public/: your html file, can also be jade file, using whatever engine you want

## Naming Convention
- all folder singular form, to avoid headache in naming (if I use plural form, should `app/bin` be `app/bins` ?)

## app/route
- `export const swagger` is the default swagger config for all the route
- `IRoute.remote`: api endpoint relative to folder name (only support alphanumeric folder name). Using swagger naming convention, example in express `/account/:id` will be `/account/{id}` here
- `IRoute.func`: Controller function to use with this route, the controller should contain a parameter in `ICtrl` type
- `IRoute.acl?`: use with `fawkesjs-starter/app/module/acl` middleware
- `IRoute.swagger?`: to overwrite the default swagger config/ parameters of the route
- `IRoute.parameters?`:
  - type of `IRouteParameters`, which is swagger parameters, support required, strlen, min/max number, string/uuid checking
  - (RestMiddleware.processArgAsync) To use in `body` type parameter, the schema cannot be using `$ref`, only support type `object` at the moment

## app/controller
- `ICtrl.req`: express.Request,
- `ICtrl.res`: express.Response,
- `ICtrl.accountId?`: it will auto generate with `fawkesjs-starter/app/module/accessToken` middleware
- `ICtrl.arg`: it will auto generate with FawkesJs middleware RestMiddleware.processArgAsync

## Writing your own middleware function
- example `processArgAsync(preCtrl: IPreCtrl)`, consist of param interface `IPreCtrl`
- middleware should be using promise and Async naming
- `return Promise.resolve(preCtrl)` to pass the parameter to next middleware
- `return Promise.reject(err)` will result in response err
