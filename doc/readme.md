## Build in structure in this project
- Express
- Sequelize
- Typescript
- Swagger: use `fawkesjs -s ./swagger/swagger.json` to generate swagger document
- Express Rest Param Validation: integration with swagger document generation
- Acl (inside `fawkesjs-starter/src/module`)
- AccessToken (inside `fawkesjs-starter/src/module`)

## Structuring Your Project
- src/bin/: this is place to store script
- src/config/config.ts: this is place for main config
- src/config/config.{env}.ts: this is place for main config to overwrite for specific environment
- src/config/datasource.ts: this is place for datasource config, `db` is the main database to use
- src/config/datasource.{env}.ts: this is place for datasource config to overwrite for specific environment
- src/config/swagger.ts: this is place for swagger config
- src/config/swagger.{env}.ts: this is place for swagger config to overwrite for specific environment
- src/controller/: this is place for controller (which should not have business logic)
- src/middleware/index.ts: `preCtrls` will be the middleware to use between the app routing and the main controller, sequence is important here
- src/model/: this is where your model should be at
- src/module/: plugin module, an alternative place to put if you don't want it to be at node_modules
- src/orm/index.ts: `ormDefinitions` for list of ormDefinitions that you want to include
- src/orm/{orm}.ts: where your orm class should be at
- src/ref/: where your const class should be at
- src/route/{folders}/index.ts: `routes: IRoutes` contain list of route, `{folders}` will be your relative path to base url, `route/index.ts` is the base url.
- migrations/: sequelize migration file
- public/: your html file, can also be jade file, using whatever engine you want

## Naming Convention
- all folder singular form, to avoid headache in naming (if I use plural form, should `src/bin` be `src/bins` ?)

## src/route
- `export const swagger` is the default swagger config for all the route
- `IRoute.remote`: api endpoint relative to folder name (only support alphanumeric folder name). Using swagger naming convention, example in express `/account/:id` will be `/account/{id}` here
- `IRoute.func`: Controller function to use with this route, the controller should contain a parameter in `ICtrl` type
- `IRoute.acl?`: use with `fawkesjs-starter/src/module/acl` middleware
- `IRoute.swagger?`: to overwrite the default swagger config/ parameters of the route
- `IRoute.parameters?`:
  - type of `IRouteParameters`, which is swagger parameters, support required, strlen, min/max number, string/uuid checking
  - (RestMiddleware.processArgAsync) To use in `body` type parameter, the schema cannot be using `$ref`, only support type `object` at the moment

## src/controller
- `ICtrl.req`: express.Request,
- `ICtrl.res`: express.Response,
- `ICtrl.accountId?`: it will auto generate with `fawkesjs-starter/src/module/accessToken` middleware
- `ICtrl.arg`: it will auto generate with FawkesJs middleware RestMiddleware.processArgAsync

## Writing your own middleware function
- example `processArgAsync(preCtrl: IPreCtrl)`, consist of param interface `IPreCtrl`
- middleware should be using promise and Async naming
- `return Promise.resolve(preCtrl)` to pass the parameter to next middleware
- `return Promise.reject(err)` will result in response err
