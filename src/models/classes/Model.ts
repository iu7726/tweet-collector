import ConnectionPool from "libs-connection-pool";

export default class Model {
  constructor(protected readonly connection: ConnectionPool) {}
}