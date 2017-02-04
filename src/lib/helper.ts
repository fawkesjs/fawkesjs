export class Helper {
  static transactionCommit(t, data) {
    let p1 = Promise.resolve(data)
    let p2 = t.commit()
    return Promise.all([p1, p2])
      .then(datas => {
        return Promise.resolve(datas[0])
      })
  }
  static transactionRollback(t, err) {
    return t.rollback()
      .then(data => {
        return Promise.reject(err)
      })
  }
  static errCb(err, res) {
    let statusCode = err.statusCode ? err.statusCode : 500
    delete err.statusCode
    res.status(statusCode).json(err)
  }
}
